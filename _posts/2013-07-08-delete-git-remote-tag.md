---
layout: post
title: Delete a Git remote tag
date: '2013-07-08T15:05:00.000-07:00'
author: Henri Tremblay
tags:
- What I learned today
modified_time: '2013-07-09T15:08:07.038-07:00'
blogger_id: tag:blogger.com,1999:blog-8282654404214414992.post-3126969377318502729
blogger_orig_url: http://blog.tremblay.pro/2013/07/delete-git-remote-tag.html
---

Easy when you know it. 
But almost impossible to guess.

```shell
git tag -d my_tag_name
git push origin :refs/tags/my_tag_name
```

Thanks to [Nathan Hoad](http://nathanhoad.net) for this tip.
