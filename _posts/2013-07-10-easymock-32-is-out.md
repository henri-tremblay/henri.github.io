---
layout: post
title: EasyMock 3.2 is out!
date: '2013-07-10T17:39:00.000-07:00'
author: Henri Tremblay
tags:
- Projects
modified_time: '2013-07-10T17:39:00.139-07:00'
blogger_id: tag:blogger.com,1999:blog-8282654404214414992.post-8852832850552688160
blogger_orig_url: http://blog.tremblay.pro/2013/07/easymock-32-is-out.html
---

EasyMock 3.2 was just released.

Two main features:

## Android support

Is it now possible to use EasyMock on Android. 
Thanks to [Jesse Wilson](https://plus.google.com/+JesseWilson) for his help on this topic.

## `@Mock` and `@TestSubject` annotations

A long awaited feature allowing to do code like this:

```java
@RunWith(EasyMockRunner.class)
public class AnnotatedMockTest extends EasyMockSupport {
  @TestSubject
  private final ClassTested classUnderTest = new ClassTested();

  @Mock
  private Collaborator collaborator;

  @Test
  public void addDocument() {
    collaborator.documentAdded("New Document");
    replayAll();
    classUnderTest.addDocument("New Document", new byte[0]);
    verifyAll();
  }
}
```

instead of

```java
public class AnnotatedMockTest extends EasyMockSupport {
  private final ClassTested classUnderTest = new ClassTested();
  private Collaborator collaborator = createMock(Collaborator.class);
  
  @Before
  public void before() {
    classUnderTest.setCollaborator(collaborator);
  }
  
  @Test
  public void addDocument() {
    collaborator.documentAdded("New Document");
    replayAll();
    classUnderTest.addDocument("New Document", new byte[0]);
    verifyAll();
  }
}
```

The complete release notes: [http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=12103&amp;version=17851](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=12103&amp;version=17851)
