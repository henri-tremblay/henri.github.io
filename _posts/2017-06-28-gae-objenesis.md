---
layout: post
title: Spring GAE Java 8 Objenesis
date: '2017-06-28T00:00:00.000-07:00'
author: Henri Tremblay
tags:
- What I learned today
---

[Objenesis went out]({% post_url 2017-06-20-objenesis-26-is-out %}) last week partly because Google App Engine is now supporting Java 8 in 
beta. And they are no security manager anymore preventing Objenesis to work. 

The problem was that Objenesis was checking if it was running on GAE to pick an instantiating strategy. So it was still running in degraded 
more on GAE Java 8. It is now fixed.

However, Spring uses an embedded version of Objenesis. So they need to upgrade. Luckily, they are super fast to do so. You can follow the 
[issue](https://jira.spring.io/browse/SPR-15600) but it will be in Spring 4.3.10 and Spring Boot 1.5.5.

Meanwhile, you might be eager to test your shiny new app on this new Google App Engine platform and would be really happy to make it work.

I have a solution for you. It isn't pretty but it works.

In Java, in case you don't know, you just need to put your class file in front of another one in the classpath to "shadow" it. It means your 
class will be used instead of the original implementation. In a war, everything in `WEB-INF/classes` goes before `WEB-INF/lib`. So you can 
easily shadow a class.

That's what I did. My [SpringObjenesis.java](https://github.com/henri-tremblay/gaeshade/blob/master/src/main/java/org/springframework/objenesis/SpringObjenesis.java) 
version shadows Spring one. It delegates to the real Objenesis implementation instead of the Spring embedded one. You only need to add the latest 
Objenesis (2.6) as a dependency to your project.

Voilà!
