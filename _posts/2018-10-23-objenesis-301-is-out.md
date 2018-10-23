---
layout: post
title: Objenesis 3.0.1 is out!
date: '2018-10-23T00:00:00.000-05:00'
author: Henri Tremblay
tags:
- Projects
---

This release adds a support of Java 9, 10 and 11. It also drops support of Java 6 and 7. So it is now a Java 8+. This
brought easier maintenance and some performance improvement.

Modules are partly supported with an automatic module name.

Change log for Version 3.0.1 (2018-10-18)
-----------------------------------------

* No Automatic-Module-Name in objenesis (#66)

Change log for Version 3.0 (2018-10-07)
-----------------------------------------

* Drop JRockit support (#64)
* Move lower support to Java 1.8 (#63)
* Replace findbugs by spotbugs (#62)
* ClassDefinitionUtils doesn't compile with Java 11 (#61)
* update pom.xml for maven plugins (#60)
* Test errors with Java 10 (#59)
* Please remove the hidden .mvn directory from the source tarball (#57)
* Move Android TCK API 26 because objenesis now requires it (#65)
