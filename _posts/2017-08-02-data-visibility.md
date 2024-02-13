---
layout: post
title: Java Data Visibility
date: '2017-08-02T00:00:00.000-07:00'
author: Henri Tremblay
tags:
- What I learned today
---

I was at [JCrete](http://www.jcrete.org/) two weeks ago. For those who don't know, it is an awesome Java unconference where everyone with
their family to talk about Java. It has been created by Heinz Kabutz a.k.a [The Java Specialist](http://www.javaspecialists.eu/). I was 
really happy to see a bunch of heads I haven't seen since moving back to Montreal. 

One of the sessions I've led was about data visibility according to the [JMM](https://www.jcp.org/en/jsr/detail?id=133). I didn't care about 
lock and synchronization. Just data visibility.

> If I write to this variable, will this other thread see the new value for sure?

I was lucky enough to gather with a handful of subject-matter experts.

My goal was to give really simple examples of what works or not. The final code can be found on 
[JCrete's github](https://github.com/JCrete/jcrete2017/tree/master/Day1/Session2/DataVisibility).

But I will still describe it here. It's based on the concept of "Will the thread ever get out of the loop?". All the examples are almost identical.

{% highlight java %}
@Test
public void test() {
    new Thread(() -> {
        while (!field);
        System.out.println("Done");
    }).start();
    field = true;
}
{% endhighlight %}

1. A thread is started
2. It loops until a field is flipped to `true`
3. The main thread flips the field to `true`

If the field visibility is correct, when the main thread flips the field, the child thread will see the value and correctly exit the loop. If
it's not, the thread **might** go in an infinite loop according to the JMM. I'm saying "might" because depending on the CPU architecture, 
JVM version and the way the wind is blowing, it might see the value correctly on your machine. That doesn't mean it will work ever after.

I recommend that you first guess the result before looking at the answer.

The first example is when we just flip the field in same thread.

{% highlight java %}
@Test
public void test() {
    new Thread(() -> {
        field = true;
        while (!field);
        System.out.println("Done");
    }).start();
}
{% endhighlight %}

**Does it work:** Yes

We will call this one the obvious example because it obviously works.
But, even if it's obvious, the JMM still have a rule for it.

    Each action in a thread happens-before every subsequent action in that thread.

Let's move to something less obvious.
We will start with a normal field (no final or volatile) without any kind of synchronization.

{% highlight java %}
private boolean stopNormalField;

@Test
public void normalField() {
    new Thread(() -> {
        while (!stopNormalField);
        System.out.println("Done");
    }).start();
    stopNormalField = true;
}
{% endhighlight %}

**Does it work:** No

Data visibility to another thread is not guaranteed by a normal field. The child thread might never see `stopNormalField` ever value changed.

Now, let's turn it to a `volatile` field.

{% highlight java %}
private volatile boolean stopVolatileField;

@Test
public void volatileField() {
    new Thread(() -> {
        while (!stopVolatileField);
        System.out.println("Done");
    }).start();
    stopVolatileField = true;
}
{% endhighlight %}

**Does it work:** Yes

Volatile ensure data visibility. 

    A write to a volatile field happens-before every subsequent read of that volatile.

When a volatile field is changed, all other threads are seeing the value right away. 
Volatile tells the JVM that the value shouldn't be kept local to the thread.

*Happens-before* is JMM jargon. 
It has a strict definition. 
That means what it means in English. 
That you are sure something happened before something else.

So, in the JMM jargon, a volatile write _happens-before_ any subsequent read of the volatile field.

The volatile also has the added bonus of ensuring the atomicity of the update.
It means the value is updated in one shot. No half-written value.

So far so good.

What about a volatile array?

{% highlight java %}
private volatile boolean[] stopArrayField = new boolean[1];

@Test
public void volatileArrayField() {
    new Thread(() -> {
        while (!stopArrayField[0]);
        System.out.println("Done");
    }).start();
    stopArrayField[0] = true;
}
{% endhighlight %}

**Does it work:** No

Data visibility of array elements is not guaranteed. Elements of a volatile array are not volatile. Yes, it is non-intuitive.

Let's now start with higher abstraction from `java.util.concurrent` (JUC). First, an atomic field.

{% highlight java %}
private AtomicBoolean stopAtomicField;

@Test
public void atomicField() {
    stopAtomicField = new AtomicBoolean();
    new Thread(() -> {
        while (!stopAtomicField.get());
        System.out.println("Done");
    }).start();
    stopAtomicField.set(true);
}
{% endhighlight %}

**Does it work:** Yes

Of course it works. Data visibility of the content of an atomic is guaranteed. Note, however, that it doesn't apply to the field referencing 
the atomic field (`stopAtomicField`). It still works on our case because we assign (`stopAtomicField = new AtomicBoolean()`) before starting 
the thread. The JVM makes sure a starting thread will see everything that *happened-before*.

Now. What about synchronization?

{% highlight java %}
@Test
public void synchronizedField() {
    new Thread(() -> {
        while (true) {
            synchronized (this) {
                if(stopNormalField) {
                    break;
                }
            }
        }
        System.out.println("Done");
    }).start();
    synchronized (this) {
        stopNormalField = true;
    }
}
{% endhighlight %}

**Does it work:** Yes

JMM says:

    An unlock on a monitor happens-before every subsequent lock on that monitor.

Which means two threads synchronizing on the **same** mutex are seeing the same thing **inside** the synchronized section. 
All words in bold are really important.

For instance, not synchronizing on the same mutex means all bets are off.

{% highlight java %}
@Test
public void synchronizedOnDifferentMutexField() {
    new Thread(() -> {
        while (true) {
            synchronized (new Object()) { // Wrong mutex
                if(stopNormalField) {
                    break;
                }
            }
        }
        System.out.println("Done");
    }).start();
    synchronized (this) {
        stopNormalField = true;
    }
}
{% endhighlight %}

**Does it work:** No

By the way, watch out for lambda and inner classes. They don't have the same `this`. For a lambda, `this` is the class where the lambda is 
defined. For an inner class, it is the inner class.

{% highlight java %}
@Test
public void synchronizedInnerClassField() {
    new Thread(new Runnable() {
        @Override
        public void run() {
            while (true) {
                synchronized (DataVisibilityTest.this) { // Specify the this from the outer class
                    if (stopNormalField) {
                        break;
                    }
                }
            }
            System.out.println("Done");
        }
    }).start();
    synchronized (this) {
        stopNormalField = true;
    }
}
{% endhighlight %}

**Does it work:** Yes

Synchronization works. Fair enough. But can I use a lock? I was told locks are better than synchronization.

{% highlight java %}
private Lock lock = new ReentrantLock();

@Test
public void lockField() {
    new Thread(() -> {
        while (true) {
            lock.lock();
            try {
                if(stopNormalField) {
                    break;
                }
            } finally {
                lock.unlock();
            }
        }
        System.out.println("Done");
    }).start();
    lock.lock();
    try {
        stopNormalField = true;
    } finally {
        lock.unlock();
    }
}
{% endhighlight %}

**Does it work:** Yes

Locking provides the same data visibility as synchronizing.

In fact, all JUCs are providing the necessary memory barriers to get the correct visibility. Below, `countDown` and `await` will make sure 
the child thread sees the world correctly.

{% highlight java %}
@Test
public void latchField() {
    CountDownLatch latch = new CountDownLatch(1);
    new Thread(() -> {
        try {
            latch.await();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        while (!stopNormalField);
        System.out.println("Done");
    }).start();
    stopNormalField = true;
    latch.countDown();
}
{% endhighlight %}

**Does it work:** Yes

As soon as you use JUC abstractions, things tend to magically work in fact. 
Which is a good thing even though everything *magically* working is always a bit frightening.

Now, something strange when asked.

{% highlight java %}
@Test
public void setBeforeThreadField() {
    stopNormalField = true;
    new Thread(() -> {
        while (!stopNormalField);
        System.out.println("Done");
    }).start();
}
{% endhighlight %}

We set the normal field before starting the thread.

**Does it work:** Yes

That one, you probably guessed right.
Because if it was not working, it would mean that the thread would never see the value of a field set before it started.
But of course there's a rule for that.

    A call to start() on a thread happens-before any actions in the started thread.

What about this one?

{% highlight java %}
@Test
public void joinThread() throws InterruptedException {
    stopNormalField = true;
    Thread t = new Thread(() -> {
        while (!stopNormalField); 
        System.out.println("Done");
        stopNormalField = false;
    });
    t.start();
    t.join();
    System.out.println(stopNormalField);
}
{% endhighlight %}

It's a bit different because we are wondering if the main thread will see the value set by the child thread after the join.

**Does it work:** Yes

Why? Because the JMM says so, of course.

    All actions in a thread happen-before any other thread successfully returns from a join() on that thread.

Quite useful.

OK. We will finish this post with the *Don't do this at home* example. 
It means it is trickier to get right, and you won't need it for business as usual.

{% highlight java %}
@Test
public void mutexField() {
    new Thread(() -> {
        while (!stopVolatileField);
        while (!stopNormalField);
        System.out.println("Done");
    }).start();
    stopNormalField = true;
    stopVolatileField = true;
}
{% endhighlight %}

**Does it work:** Yes

Here we cause the synchronization of the normal field by using a volatile field. 
Writing to `stopVolatileField` causes a *happens-before* relationship. 
And *happens-before* are transitive as per the JMM.

    If an action a happens-before an action b, and b happens before an action c, then a happens before c.

In our case, it means the value written to `stopNormalField` will be seen by the child thread after it reads `stopVolatileField`.

Thanks again to all the contributors to this session (you will find some of them on the [readme](https://github.com/JCrete/jcrete2017/blob/master/Day1/Session2/DataVisibility/README.adoc). 
