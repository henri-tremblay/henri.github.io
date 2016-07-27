---
layout: post
title: EasyMock 3.4 is out!
date: '2015-09-06T19:52:00.001-07:00'
author: Henri Tremblay
tags:
- Projects
modified_time: '2015-09-06T19:54:00.625-07:00'
blogger_id: tag:blogger.com,1999:blog-8282654404214414992.post-4159574223203354466
blogger_orig_url: http://blog.tremblay.pro/2015/09/easymock-34-is-out.html
---

This version has finally removed the old (and ugly) partial mocking methods. You are now required to use the 
`partialMockBuilder`.

In exchange, you get really nice short methods to create your mocks: `mock`, `niceMock` and `strictMock`.

You also get a better stability since cglib and ASM are now embedded to remove a possible version mismatch with
your own dependencies. Note that Objenesis will stay as an explicit dependency.

## Change log

* [#163 Incomplete sentence in documentation bug website](https://github.com/easymock/easymock/issues/163)
* [#160 EasyMock should not depend on ASM but inline the code enhancement major](https://github.com/easymock/easymock/issues/160)
* [#159 Remove partial mocking deprecated methods enhancement fixed major](https://github.com/easymock/easymock/issues/159)
* [#158 Shorter mock methods core enhancement fixed major](https://github.com/easymock/easymock/issues/158)
* [#155 Disable jar indexing enhancement fixed minor](https://github.com/easymock/easymock/issues/155)
* [#11 User guide refers to methods not in latest release website](https://github.com/easymock/easymock/issues/11)
