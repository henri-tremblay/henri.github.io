---
layout: post
title: Future behaviour through time
date: '2016-11-30T01:00:00.000-08:00'
author: Henri Tremblay
tags:
- What I learned today
---

Yesterday, I was playing with interruption. At some point I ended up with this code.

```java
public <T> T uninterruptibleGet(Future<T> future) throws ExecutionException {
  while(true) {
    try {
      return future.get();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    }
  }
}
```

This is bad code. Don't do that. It should be an infinite loop. For those not playing with interruption daily
here's why:

1. Waiting on `get`
2. Be interrupted
3. Catch the exception and set the interruption state back (`Thread.currentThread().interrupt()`)
4. Go back to `get`
5. Notice we are interrupted (the interruption state is on)
6. Throw an `InterruptedException`
7. Go to 4

The thing is that when running the code, there was no infinite loop.

So I wanted to know why.

The answer is in `FutureTask.get()`.

```java
public V get() throws InterruptedException, ExecutionException {
    int s = state;
    if (s <= COMPLETING) // here
        s = awaitDone(false, 0L);
    return report(s);
}
```

The `get` method first look at the state, if done, it just returns. If not, then it interrupts. Here we go, 
job done.

Then it goes to the Continuous Integration. And goes in an infinite loop. Whaaat???

At first I thought it was some race condition that was happening with other tests (they are run in parallel).

But no. The answer is much simpler than that: JDK 6

The `FutureTask` code above is from JDK 8. The JDK 6 code is different. It first starts to check the 
interrupt. So infinite loop it is.

Now, was is the right idiom for an `uninterruptibleGet`?

To get the long answer, I highly suggest that you go read [Java Concurrency in Practice](http://jcip.net/) 
(chapter 7) right now. It is a must read for any Java programmer.

The short answer is this:

```java
public <T> T uninterruptibleGet(Future<T> future) throws ExecutionException {
  boolean interrupted = false;
  try {
    while (true) {
      try {
        return future.get();
      } catch (InterruptedException e) {
        interrupted = true;
      }
    }
  } finally {
    if (interrupted)
      Thread.currentThread().interrupt();
  }
}
```
