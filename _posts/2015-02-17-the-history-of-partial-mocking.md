---
layout: post
title: The history of partial mocking
date: '2015-02-17T18:57:00.000-08:00'
author: Henri Tremblay
tags:
- Stories
modified_time: '2015-03-04T19:25:29.706-08:00'
blogger_id: tag:blogger.com,1999:blog-8282654404214414992.post-3677334224125818897
blogger_orig_url: http://blog.tremblay.pro/2015/02/the-history-of-partial-mocking.html
---

Someone asked me this week to give some legitimate reasons to use partial mocking. 
It's indeed a good question. 
Especially because the EasyMock [documentation](http://easymock.org/user-guide.html#mocking-partial) is explicit on telling that using it is probably a code smell.

The funny thing about partial mocking is that I've invented it to workaround issues we had at that time (2004... a long long time ago in the computer engineering world). 
It's only later that we've discovered some legitimate usages.
You see, when I first started to work on class mocking, it wasn't possible to bypass the constructor yet (or at least, I wasn't yet digging in the JVM far enough to be able to do so). 
So, I was using a lot of deductions to find which constructor will be the best to use. 
The algorithm was something like this:

1. Try to use the default constructor
2. If it's not there, use the constructor with the less parameters and create a mock for each of these parameters
3. Pray it won't fail when creating the new instance

Frequently, this method would fail because some nasty individual had put really agressive code in a constructor. 
For instance, I've seen constructors opening sockets...

So, to workaround that, I made it possible to select the constructor to use and also to pass real arguments to it. 
The arguments were not used afterwards. 
They were just there to prevent the constructor from crashing.

But then, something worse happened. 
Some constructors were calling other methods... 
And since no expectations were set (of course! The mock doesn't exist yet!), mock creation was failing.

Partial mocking was born to solve that.

I made it possible to prevent some methods to be mocked so when the constructor would call them, they would behave as usual and I'll get my mock. TADA!

Yes, it was ugly, hacky and I wasn't really proud of it but that was the best I could do at that time (remember: 2004).

Not so much later, I found a way to bypass the constructor entirely the same way HotSpot was doing it during serialization. 
The main drawback was that EasyMock was now working only on HotSpot since the code was HotSpot specific.

The good news are that this code was already used by a bunch of other frameworks like [XStream](http://x-stream.github.io) for instance. 
So other JVMs were starting to be compliant. 
I remember asking the JRockit team about it and two minor versions later, it was there.

Still, that's was caused the creation of [Objenesis](http://objenesis.org/). 
The magical library that creates objects without calling the constructor on any JVM. 
In fact, Objenesis is not that useful anymore because we have `Unsafe.allocateInstance`. 
`Unsafe` also is OpenJDK specific but so many frameworks are using it that pretty much everyone has implemented it. 
However, I'm still using Objenesis for two reasons:

* You never know when a JVM won't be compatible with `Unsafe`
* My benchmarks have shown the using JVM specific code is way faster than using `Unsafe`

So I'm staying on Objenesis for now (and there is an instantiator using `Unsafe` so there's no drawback using it).

Anyway, back to partial mocking.

So, we are now able to bypass the constructor and partial mocking was created because we were not able to. 
Why is it still there?

There are two main usages. 
The first and most legitimate one is to test the [Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern). 
Let's say you have an abstract base class with abstract methods and concrete methods.

```java
public abstract class BaseClass {
  public boolean beTruthy() {
    // stuff
    boolean b = doSayTheTruth();      
    // other stuff
    return b;
  }   
 
  protected abstract boolean doSayTheTruth();
}
```

You want to test the concrete ones.

* You could create a fake implementation, but that's annoying.
* You could just use a real implementation but then it will make you test more than needed.
* Or you could create a partial mock.

In fact, when creating a partial mock, EasyMock now automatically considers that abstract methods will be mocked and concrete methods won't.

So you could do

```java
BaseClass myClass = createMockBuilder(BaseClass.class).createMock();
expect(myClass.doSayTheTruth()).andReturn(true);
replay(myClass);
assertTrue(myClass.beTruthy());
verify(myClass);
```

How sweet.

The other reason is a little bit less legitimate. 
Let's say you have a class with a bunch of methods calling each others.

You would like to test the class but testing everything at once is nearly impossible.

A good solution is to test the methods one after the other by using partial mocking.

1. You will test the first method by mocking everything it calls.
2. You will then test another method down the stack by mocking everything it calls.
3. And so on and so on.

Of course, that's bad code! 
But if there are no tests, you can't refactor! 
Step one, the tests. 
Step two, refactor. 
And yes, during the refactoring, the need for partial mocking should disappear. 
But that doesn't mean partial mocking isn't helpful.

That's all for today. 
Happy partial mocking. 
I hope you find this story interesting and/or useful.
