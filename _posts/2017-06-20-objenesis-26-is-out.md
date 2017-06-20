---
layout: post
title: Objenesis 2.6 is out!
date: '2017-06-20T00:00:00.000-07:00'
author: Henri Tremblay
tags:
- Projects
---

An all new shiny [Objenesis](http://objenesis.org/) is out. The framework everybody uses without even knowing it.
 
It had fun playing with the brand new Google App Engine platform supporting Java 8. They dropped the terrible security manager they used to 
have to know Objenesis is working perfectly on it. This was brought to my attention by GAE developers. They are now testing mainstream frameworks 
on their platform to make sure it works. This should make GAE adoption easier.

Java 9 was pretty much already working but I got rid of all the "Illegal accesses". Not that obvious since in Objenesis, this is how we roll.

Finally, a bit of cleanup in the serialization specification was done. So now a serializing instantiator should instantiate a class by calling 
the no-arg constructor of the first non-serializable class in the hierarchy. And do nothing else. See the [documentation](http://objenesis.org/details.html) 
for details.

## Change log

* [App Engine Java 8 Runtime support](https://github.com/easymock/easymock/issues/51)
* [Improve Java 9 support](https://github.com/easymock/easymock/issues/53)
* [Clarify serialization strategy behavior enhancement](https://github.com/easymock/easymock/issues/54)
* [SunReflectionFactoryInstantiator not working if parent class constructor isn't public](https://github.com/easymock/easymock/issues/33)
* [Validate Android O](https://github.com/easymock/easymock/issues/52)
* [Drop Java 5 support](https://github.com/easymock/easymock/issues/55)
