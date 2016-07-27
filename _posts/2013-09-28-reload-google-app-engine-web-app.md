---
layout: post
title: Reload a Google App Engine web app
date: '2013-09-28T09:38:00.000-07:00'
author: Henri Tremblay
tags:
- What I learned today
modified_time: '2013-09-28T09:38:03.051-07:00'
thumbnail: http://1.bp.blogspot.com/-G79J-zeZCyQ/UkcFB6Cpz9I/AAAAAAAAARQ/VU4lKLgPv8Y/s72-c/external.png
blogger_id: tag:blogger.com,1999:blog-8282654404214414992.post-4936933201294929281
blogger_orig_url: http://blog.tremblay.pro/2013/09/reload-google-app-engine-web-app.html
---

Google provides a really nice plugin to work with Google App Engine in Eclipse.

Strangely, there is no obvious way to reload the web app when the code is modified. This is kind of odd because it's 
the kind of feature everyone would need.

The trick to allow a reload is to touch the `appengine-web.xml` file.

On Linux, you can, of course, use `touch`. 

On Windows, `touch` doesn't exist. However, there is a really obvious replacement for it: `copy appengine-web.xml +,,`. 
It needs to be called from the `WEB-INF` directory. Not path allowed here it seems.

The best way I've found so far to use it is to add an external tool.

<a href="{{site.baseurl}}public/images{{page.url}}external.png" style="margin-left: 1em; margin-right: 1em;">
  <img border="0" height="396" alt="External tools" src="{{site.baseurl}}public/images{{page.url}}external-small.png" width="400"/>
</a>

I would also suggest to go to the Common tab to add it to your favorite tools and to have it as a shared file so you 
can make it accessible to all your team.

I also tried to add the tool as a builder of the project to make it auto-reload. It didn't work.

If anybody has a better solution, [I'm listening]({{site.baseurl}}about).
