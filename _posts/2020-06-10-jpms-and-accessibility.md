---
layout: post 
title: "JPMS impact on accessibility"
date: '2020-06-10T00:00:00.000-05:00' 
author: Henri Tremblay 
tags:
- What I learned today 
---

About a month about, I had a mysterious `IllegalAccessException` under Java 11.

A framework was trying to perform reflection on a generated proxy (from `Proxy.newProxyInstance`).

I was surprised because, so far, my understanding was that when I'm not using the module system, all classes are in the unnamed module.
When they try to do reflection on something that was set accessible, it should always work although it will give you a warning on the console.

It’s quite a deep feature of JPMS that caused it. 

Let's get started.
 
When you are not using the Java 9 module system (aka JPMS aka Java Platform Module System aka Jigsaw), it means you are on the classpath like always.
When you are on the classpath you are in a special module called “UNNAMED”.
This module has special rights. One is that everything is open to it. Open means it can do reflection on anything.
By default, you get a warning telling you are a bad citizen, but it works.
 
There is one pitfall.
 
If you try to access a class that is in a module and private to the module (not exported), it still fails.
 
“Why would something be in a module if I don’t use modules?”
 
I will if it’s a JDK class. Because JDK classes are always in a module.
For example, many `com.sun` classes won’t be accessible.
 
In this case, you can add an `–add-open` flag to fix it.
 
But there is another pitfall.
 
You can create a module dynamically.
 
That’s what the `Proxy` class is doing. When you create a proxy, it creates a dynamic module for it.
Even worst, it creates it in a layer above the boot layer.
 
Because modules are layered. A bit like class loaders. A class loader has a parent class loader and it goes down to the bootstrap class loader (which is stacked over an infinite number of turtles).
With modules, you have the boot layer that contains all the modules loaded at startup and then child layers that are dynamically created. OSGi is using that to correctly work in a JPMS world.
 
Of course, you can dynamically open a module to another.
But you can’t list all the modules (because the boot layer doesn’t have access to its children, just like a class loader).
And one can be created at any moment to you can’t open everything upfront.
 
"Why would I want to perform reflection on some random unknown class?"

It is sometimes useful. For example, when trying to get the size (in bytes) of stash of objects.
You have know idea what you will encounter but you still want to size them.
It’s a genuinely useful thing to do.

The only solution here is to use a self-registering JVM agent that will open any new module to the UNNAMED module.
You can use ByteBuddy for that.

In conclusion, let me thank the knowledgeable friends who help me figure this out: 

* [Heinz Kabutz](https://www.javaspecialists.eu/)
* [Rafael Winterhalter](https://rafael.codes/) (ByteBuddy lead)
* [Gunnar Morling](https://www.morling.dev/)

Thank you.
