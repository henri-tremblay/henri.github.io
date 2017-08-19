---
layout: post
title: Cancel CompletableFuture
date: '2017-08-18T00:00:00.000-07:00'
author: Henri Tremblay
tags:
- What I learned today
---

I felt on some code yesterday and had to think a bit about it before deciding that it wasn't working as expected. And then went on to
wonder if I could make it work. I found it interesting so I thought I should tell you about it.

{% highlight java %}
@Test
public void testListGetsFilled() throws Exception {
  List<String> list = Collections.emptyList();
  
  CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
    while(true) {
      if(!list.isEmpty()) {
        return list.size();
      }
    }
  });
  
  // ... do some async task that should fill the list in less than 1 second ...
  
  assertThat(future.get(1, TimeUnit.SECONDS)).isGreaterThan(0);
}
{% endhighlight %}

So. What's going on here?

1. We have a list
2. A `CompletableFuture` is waiting for the list to be filled
3. We wait on the future until is has finished
4. If it takes too long, we timeout

It works. If the list is filled, the test will be successful, if the list is never filled, the `get` will timeout after
1 seconds (throwing a `TimeoutException`) and the test will fail.

The only problem is that if the test does fail, the future task itself will never finish. It is still stuck in the `while`
loop.

Why?

Because nothing can stop it. `supplyAsync` is submitting a task to the common pool. This task will run in a thread we are
not managing. The task won't stop until the list isn't empty anymore. That's it.

A timeout of the `CompletableFuture` won't change anything. It just means that we are not waiting on the `get` anymore. But
it has no power over the task itself.

What can we do?

Maybe we can interrupt it? Let's try.

{% highlight java %}
@Test
public void testListGetsFilled_withInterrupt() throws Exception {
  List<String> list = Collections.emptyList();

  CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
    while(true) {
      if(!list.isEmpty()) {
        return list.size();
      }
      try {
        Thread.sleep(1);
      } catch (InterruptedException e) {
        return 0;
      }
    }
  });

  // ... do some async task that should fill the list in less than 1 second ...

  assertThat(future.get(1, TimeUnit.SECONDS)).isGreaterThan(0);
}
{% endhighlight %}

In the original loop, nothing could be interrupted. Now we introduce a `sleep`. It can be interrupted. However, it won't.

The timeout on the `get` doesn't trigger an interrupt on the thread running the task.

That doesn't work either?

Can it be cancelled you say?

{% highlight java %}
@Test
public void testListGetsFilled_cancelled() throws Exception {
  List<String> list = Collections.emptyList();

  AtomicReference<CompletableFuture<Integer>> ref = new AtomicReference<>();

  CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
    while(true) {
      if(ref.get() != null && ref.get().isCancelled()) {
        return list.size();
      }
      if(!list.isEmpty()) {
        return list.size();
      }
    }
  });

  ref.set(future);

  // ... do some async task that should fill the list in less than 1 second ...

  assertThat(future.get(1, TimeUnit.SECONDS)).isGreaterThan(0);
}
{% endhighlight %}

Here the code is a bit more complicated. We can't access the future from the lambda directly. Because the lambda starts
before the assignment is made. So we use an `AtomicReference`, wait until its content isn't null anymore and then wait
for cancellation... that never arrives.

Yes. The timeout on the `get` won't trigger a cancellation. This is on purpose. There is nothing preventing you from waiting 
a bit on the `get`, do something else, and come back to `get` again.

Enough of that! Tell me what works!

OK. OK. Calm down. I'll show you but it's not pretty.

{% highlight java %}
@Test
public void testListGetsFilled_cancelledForReal() throws Exception {
  List<String> list = Collections.emptyList();

  AtomicReference<CompletableFuture<Integer>> ref = new AtomicReference<>();

  CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
    while(true) {
      if(ref.get() != null && ref.get().isCancelled()) {
        return 0;
      }
      if(!list.isEmpty()) {
        return list.size();
      }
    }
  });

  ref.set(future);

  // ... do some async task that should fill the list in less than 1 second ...

  try {
    future.get(1, TimeUnit.SECONDS);
  } catch (TimeoutException e) {
    future.cancel(false);
  }
  
  assertThat(future.get()).isGreaterThan(0);
}
{% endhighlight %}

So now we are cancelling the task ourselves. That works. The task correctly finishes. One funny thing to mention is that the
assert won't fail. In fact, it's the call to `future.get()` in `assertThat` that will throw a `CancellationException` and
make the test fail.

OK. We now have a pretty ugly and complicated solution that works.

Can we simplify?

You might have noticed that `cancel()` take a parameter named `mayInterruptIfRunning`. That sounds promising! We can get
an interruption! Let's try.

{% highlight java %}
@Test
public void testListGetsFilled_cancelledToInterrupt() throws Exception {
  List<String> list = Collections.emptyList();

  CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
    while(true) {
      if(Thread.interrupted()) {
        System.out.println("Done");
        return 0;
      }
      if(!list.isEmpty()) {
        return list.size();
      }
    }
  });

  // ... do some async task that should fill the list in less than 1 second ...

  try {
    future.get(1, TimeUnit.SECONDS);
  } catch (TimeoutException e) {
    future.cancel(false);
  }

  assertThat(future.get()).isGreaterThan(0);
}
{% endhighlight %}

No atomic reference anymore. But doesn't work. The task doesn't get interrupted. If I quote the javadoc for `cancel()`:

> **mayInterruptIfRunning** this value has no effect in this implementation because interrupts are not used to control processing.

Basically, that means `CompletableFuture` are not supposed to be interrupted. They are at a higher level of abstraction.

Here is the nicest solution I know about.

{% highlight java %}
@Test
public void testListGetsFilled_cancelledByFlag() throws Exception {
  List<String> list = Collections.emptyList();

  AtomicBoolean cancelled = new AtomicBoolean(false);

  CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
    while(true) {
      if(cancelled.get()) {
        return list.size();
      }
      if(!list.isEmpty()) {
        return list.size();
      }
    }
  });

  // ... do some async task that should fill the list in less than 1 second ...

  try {
    future.get(1, TimeUnit.SECONDS);
  } catch (TimeoutException e) {
    cancelled.set(true);
  }

  assertThat(future.get()).isGreaterThan(0);
}
{% endhighlight %}

Yes, it's just a simple flag. But it works nicely.

Still, you might ask me: "Why is it that complicated?"

In fact, I'm not totally sure. I think `CompletableFuture` are not meant to be used like this. They are supposed to 
complete. Or to fail exceptionally. Normal `Future` are the ones that are supposed to loop like that. 

But I'll need more digging to be more conclusive. Right now, I only wanted to share my *How to cancel a `CompletableFuture`?* 
discovery.
