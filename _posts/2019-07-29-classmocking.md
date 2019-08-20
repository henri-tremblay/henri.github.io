---
layout: post 
title: "Pragmatism applied: Avoid single implementation interface"
date: '2019-07-29T00:00:00.000-05:00' 
author: Henri Tremblay 
tags:
- Pragmatism applied 
---

A long time ago (think 2000), all classes in Java used to have an interface.
You first started with `MyInterface` then added a `MyInterfaceImpl`.

This caused a lot of boilerplating and debugging annoyance.
I used to have code generator to make it easier.

Why were we doing that?

Two reasons. A bad and a good one.

## The bad reason is decoupling

The idea was that if you depend on an interface you can swap the implementation if ever needed.

This is a "you might need it later" issue.
Every sentence with "might" and "later" in it should be rephrased as "I don't care".
Because most of the time, "later" never occurs and you are just wasting time an energy right now just in case.
Whatever happens later should be dealt with later.

That said, you might argue that "yes, but it will be much more painful to deal with it later".
Ok. Let's check.

Let's say you have some cheese

```java
public class Cheese {

  private final String name;

  public Cheese(String name) {
    this.name = Objects.requireNonNull(name);
  }

  public String getName() {
    return name;
  }
}
```

Then you want to retrieve the cheese from a database.

```java
public class CheeseDao {

  private final Database database;

  public Cheese findByName(String name) {
    return database.names()
        .filter(name::equals)
        .reduce((a, b) -> {
          throw new IllegalStateException("More than one entry found for " + name);
        })
        .map(Cheese::new)
        .orElse(null);
  }
}
```

And then you have a REST resource depending on the `CheeseDAO`.

```java
public class CheeseResource {

  private final CheeseDAO cheeseDAO;

  public CheeseResource(CheeseDAO cheeseDAO) {
    this.cheeseDAO = cheeseDAO;
  }

  public Cheese get(String name) {
    return cheeseDAO.findByName(name);
  }
}
```

Since you are an efficient human being, you decided that no interface was needed for the `CheeseDAO`.
It has only one implementation so far and you have not building a cheese open source library.
All this code is into your little cheese application.

But one day, some requirements arrive and you actually do need another implementation.
"Later" actually happened.

So you now turn `CheeseDAO` into an interface.

```java
public interface CheeseDao {
  Cheese findByName(String name);
}

public class CheeseDatabaseDao implements CheeseDao {

  private final Database database;

  public Cheese findByName(String name) {
    return database.names()
        .filter(name::equals)
        .reduce((a, b) -> {
          throw new IllegalStateException("More than one entry found for " + name);
        })
        .map(Cheese::new)
        .orElse(null);
  }
}
```

And now, off you go to fix compilation errors on all the classes depending on `CheeseDAO`.

For instance, you modify `CheeseResource` to this:

```java
public class CheeseResource {

  private final CheeseDAO cheeseDAO;

  public CheeseResource(CheeseDAO cheeseDAO) {
    this.cheeseDAO = cheeseDAO;
  }

  public Cheese get(String name) {
    return cheeseDAO.findByName(name);
  }
}
```

I'll leave you 5 seconds. 1,   2,   3,   4,   5.

Yes, I'm messing with you.
Nothing has changed.
Not a single character.

Turning a class into an interface "later" wasn't painful after all.

Which is why I call it a bad reason. 
Doing it is painful now and has no benefit later.

## Now, the good reason: Testing

The problem with a concrete class is that you need to instantiate.
In a testing context, you want to mock dependencies.
In order to mock a concrete class, you need two things

1. Extend the class to be able to mock the behavior 
2. Instantiate the class

The first requirement is easy, the second is trickier.
If the class is simple and has a simple constructor to call, everything is alright.
If the class is quite annoying to instantiate, you have a problem.

This is where I step in.
The coolest trick would be to instantiate the class without calling any constructor.

Fortunately, Java allows that. 
Because serialization does it all the time.
You just need to sneak under the hood a little.

Originally, I got involved in open source to solve that problem specifically.
Most mocking framework today are using [Objenesis](http://objenesis.org/) to perform this task.
I talked a bit about it in a [previous post]({{ site.baseurl }}{% post_url 2015-02-17-the-history-of-partial-mocking %}). 

So, since 2003, you don't need to be afraid to use concrete classes as dependencies.
You can mock them just as any interface.
