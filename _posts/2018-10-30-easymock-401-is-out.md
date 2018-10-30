---
layout: post
title: EasyMock 4.0.1 is out!
date: '2018-10-30T00:00:00.000-05:00'
author: Henri Tremblay
tags:
- Projects
---

This release adds a support of Java 9, 10 and 11. It also drops support of Java 6 and 7. So it is now a Java 8+. This
brought easier maintenance and some performance improvement.

Modules are partly supported with an automatic module name.

If also changes the way EasyMock will determine the type of the returned mock. The idea is to solve a heavily annoying
problem most mocking frameworks have with generics.

To be clear, starting now `List<String> list = mock(List.class);` will compile perfectly without
any "unchecked" warning.

However, `String s = mock(List.class);` will also compile. 
But I'm expecting you not to be crazy enough to do such thing. 
It will do a `ClassCastException` at runtime anyway.

The only side effect is that in rare cases, the compiler might fail to infer the return type and give a compilation error.
If it ever happen, the solution is to use a type witness, e.g. `foo(EasyMock.<List<String>>mock(List.class)`.
It should solve the problem nicely, and, again, without a warning.

Change log for Version 4.0.1 (2018-10-30)
-----------------------------------------

* Upgrade to cglib 3.2.9 to support Java 11 ([#234](https://github.com/easymock/easymock/issues/234))
* Upgrade TestNG to version 7 ([#233](https://github.com/easymock/easymock/issues/233))
* Update to ASM 7.0 for full Java 11 support ([#232](https://github.com/easymock/easymock/pull/232))

Change log for Version 4.0 (2018-10-27)
-----------------------------------------

* Remove most long time deprecated methods ([#231](https://github.com/easymock/easymock/issues/231))
* Relax typing for the mocking result ([#229](https://github.com/easymock/easymock/issues/229))
* Upgrade Objenesis to 3.0.1 ([#228](https://github.com/easymock/easymock/issues/228))
* Update cglib to 3.2.8 and asm to 6.2.1 ([#225](https://github.com/easymock/easymock/pull/225))
* Java 11 Compatibility check: EasyMock ([#224](https://github.com/easymock/easymock/issues/224))
* easymock 3.6 can't work with JDK11 EA kit ([#218](https://github.com/easymock/easymock/issues/218))
* update testng to 6.14.3 ([#216](https://github.com/easymock/easymock/pull/216))
