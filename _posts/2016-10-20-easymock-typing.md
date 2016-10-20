---
layout: post
title: EasyMock generic typing
date: '2016-10-20T01:00:00.000-08:00'
author: Henri Tremblay
tags:
- Projects
---

These days, I'm a bit annoyed about Java generics. Because it seems that when you want to be clean, you pretty
much always get in troubles.

I'll give you an example. The method to create a mock with [EasyMock](http://easymock.org/) is currently typed like this:

```java
public static <T> T mock(Class<T> toMock)
```

This seems quite straightforward.

But it is also quite annoying to use. For example, let's try to mock a generic type:

```java
List<String> list = mock(List.class);
```

It looks like something we would like to easily do but you get this nice warning:

    Warning:(51, 33) java: unchecked conversion
      required: java.util.List<java.lang.String>
      found:    java.util.List
      
And there's no way to get around it. Here are some attempts:

```java
List<String> list = mock(List<String>.class); // no allowed (won't compile)
List<String> list = EasyMock.<String>mock(List.class); // won't compile either because the parameter type doesn't match)
List<String> list = (List<String>) mock(List.class); // still get a warning
```

*So what's the way out?*

To be less accurate.

Yes. I can't see any other way out. (Do you?)

So my plan is to change EasyMock typing with this:

```java
public static <T> T mock(Class<?> toMock)
```

No relation anymore between the parameter and the returned type. WAT!!! Are you crazy?!?

So yes, this will compile without complaints :-( (but I can check the type coherence at runtime)

```java
String list = mock(Integer.class);
```

But this will now work without any warning :-)

```java
List<String> list = mock(List.class);
```

_You can't have your cake and eat it_ it seems. But as usual, I will be happy to be proved wrong.
