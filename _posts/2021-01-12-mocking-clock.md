---
layout: post
title: Mocking Time
date: '2021-01-12T01:00:00.000-08:00'
author: Henri Tremblay
tags:
- What I learned today
---

In many cases in our code we do something like that:

```java
LocalDate today = LocalDate.now();
```

The problem is that your tests then needs to work based on the real current date (or time, or zone date time, whatever).

Sometime it’s fine, sometimes the test fails randomly. At end of day, month or year in particular.
It also forces you to calculated the expected result instead of using a constant.

In the new Java date/time API, there is a built-in way to set a constant time called a `Clock`.

So instead of the code above, you do

```java
Clock clock = …;
LocalDate today = LocalDate.now(clock);
```

`Clock` is an interface with multiple implementations.

If you want a real clock, you can do this.

```java
Clock clock = Clock.systemDefaultZone();
Clock clock = Clock.systemUTC();
Clock clock = Clock.system(ZoneId.systemDefault());
```

But it you want a fake clock during your test, you can do this:

```java
Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
```

Sadly, I must confess, since the clock is using an `Instant`, it’s a bit more complicated to initialize then I would like.
For example, to put it to a specific day, you do that:

```java
LocalDate today = LocalDate.ofYearDay(2019, 200);
Clock clock = Clock.fixed(today.atStartOfDay().toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
```

There are methods to make the clock tick or move forward.
However, it's an immutable class, so ticking the clock will return a new clock.
Nothing prevents you from doing your own `MutableClock`.
Here is an implementation.

```java
public class MutableClock extends Clock {

  private volatile Instant now;
  private final ZoneId zone;

  public MutableClock() {
    this(Instant.now());
  }
  
  public MutableClock(Instant now) {
    this(now, ZoneId.systemDefault());
  }

  public MutableClock(Instant now, ZoneId zone) {
    this.now = now;
    this.zone = zone;
  }

  @Override
  public ZoneId getZone() {
    return zone;
  }

  @Override
  public Clock withZone(ZoneId zone) {
    return new MutableClock(now, zone);
  }

  @Override
  public Instant instant() {
    return now;
  }

  public synchronized void plus(TemporalAmount amount) {
    now = now.plus(amount);
  }
}
```

I found it a really useful tool to fix existing code in a class where you want the time to move at your own pace.

* Add a Clock attribute
* Add a constructor taking the clock in parameter
* The existing constructor uses the system clock `Clock.systemDefaultZone()`
* Each time a `now()` (e.g `LocalDate.now()`) is called, you use `now(clock)` instead
* You can now move the time when needed in your test

Happy clock mocking!
