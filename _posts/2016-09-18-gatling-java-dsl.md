---
layout: post
title: Gatling Java DSL
date: '2016-09-18T01:00:00.000-08:00'
author: Henri Tremblay
tags:
- Stories
---

My favorite stress tool has been [Gatling](http://gatling.io) for many years now.

Scenarios are

* Easy to construct, It's just code
* Easy to version. It's just code
* Easy to run. It's a simple command line that you launch in remote if needed
* Having great result graphs
* Easy to datamine. There is a `simulation.log` file that let's you do some more digging when needed

My only complaints are

* You can't change the running scenario
* **It's in Scala**

The first one might be addressed by [Gatling Frontline](http://gatling.io/#/services/frontline). I haven't tried.

The second one is a bit more complicated to solve :-)

In fact, I don't care that's in Scala. But I would love to be able to core my scenario in Java.
 
So just for fun, [I did a thought experiment](https://github.com/henri-tremblay/javagatling). I've coded the Gatling API in Java and then coded the [`BasicScenario` 
example](https://github.com/henri-tremblay/javagatling/blob/master/src/test/java/computerdatabase/BasicSimulation.java) using this API.

**It's not working for real**

The API is just an emply shell. To know how different it would be from the Scala DSL.

The answer is: Not much.

My expectations were that I would need to rely on plenty of Java 8 features to get something close 
to the Scala DSl. But in fact, not even.

The main differences are:

* Variables are typed
* I've added a `build` method. But it's just for style. I can get rid of it
* A bunch of semi-colons
* No syntactic sugar to create a map
* I'm using `Duration` is used to time units
* I need a `run` method where the `setUp` method is

That's quite joyful and probably can be improved.

I'm now wondering if I could have used the Scala classes directly. I'm not good at making Java and Scala 
interacting. 

**So if someone is and want to try, please do so.**
