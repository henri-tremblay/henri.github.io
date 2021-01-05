---
layout: post
title: Mac UI
date: '2018-04-22T00:00:00.000-05:00'
author: Henri Tremblay
tags:
- Stories
---

**Edited 2021-01-04:** I do not use this trick anymore. 
It was freezing my computer once in a while. 
I haven't retried for a while.
If you are successful using it, please tell me.

In a [previous post]({% post_url 2017-06-02-mac-ui %}), I wrote about the UI using I had on a Mac. A Mac lover was fairly
confident he could save me (sadly, no).

Today, thanks to [BetterTouchTool](https://folivora.ai/) and its developers,
I can strike one item on my list.

* `Cmd+ù` should behave as ``Cmd+` ``  when using a ca-fr keyboard.

The solution is to add in BTT a shortcut to `Cmd+ù`. Then bind it to a predefined action "Run Apple Script".

```
tell application "System Events"
	keystroke "`" using command down
end tell
``` 

Voilà!
