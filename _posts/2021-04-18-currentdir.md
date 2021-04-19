---
layout: post
title: "Changing current directory"
date: '2021-04-18T00:00:00.000-05:00'
author: Henri Tremblay
tags:
- What I learned today
---

**Update (2021-04-19):** It's a JDK bug. It was [fixed](https://bugs.openjdk.java.net/browse/JDK-8194154) in Java 11.
You can't change `user.dir` anymore (see [this](https://bugs.openjdk.java.net/browse/JDK-8066709)).
But the behavior is consistent, `user.dir` is cached at the beginning. 

I was playing with system properties lately.
My goal was to change the current directory.
The theory would be that the following code should do it.

```java
System.setProperty("user.dir", Paths.get("build").toAbsolutePath().toString());
```

Surprisingly, it only half works.

If you use the good old `File` API, everything works well.
But it you use the new `Path` API, it does.

Here is the demonstration.

```java
// Initialize out two file/path
Path path = Paths.get("target");
File file = new File("target");

// Print the absolute path for them, all good so far
System.out.println("file = " + file.getAbsolutePath());
System.out.println("path = " + path.toAbsolutePath());

// Change the current directory to a sub-folder
System.setProperty("user.dir", Paths.get("build").toAbsolutePath().toString());

// Print the absolute path again
System.out.println("file = " + file.getAbsolutePath()); // current dir changed
System.out.println("path = " + path.toAbsolutePath()); // uh-oh!
```

When using `Path`, the current directory doesn't move.
Even if you create your `Path` after setting `user.dir` is doesn't move.

It's frightening because it's not consistent.

Why do we have this behavior?

Because the `java.nio.file.spi.FileSystemProvider` implementation, `UnixFileSystemProvider` in my case, loads and cache
the current directory. The same happens on Windows. It's not a Unix thing.

I must confess that I do not like the lack of consistency.
And I'm not sure I like not being able to fool around and change my system properties like I used to.
