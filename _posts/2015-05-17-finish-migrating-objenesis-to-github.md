---
layout: post
title: Finish migrating Objenesis to GitHub
date: '2015-05-17T20:05:00.001-07:00'
author: Henri Tremblay
tags:
- What I learned today
- Projects
modified_time: '2015-05-18T12:58:03.949-07:00'
blogger_id: tag:blogger.com,1999:blog-8282654404214414992.post-8775453809402232693
blogger_orig_url: http://blog.tremblay.pro/2015/05/finish-migrating-objenesis-to-github.html
---

With [Codehaus](http://www.codehaus.org/) and [Google Code](http://google-opensource.blogspot.ca/2015/03/farewell-to-google-code.html) 
closing, I'm happily required to migrate [Objenesis](http://objenesis.org) and [EasyMock](http://easymock.org). 

Both projects have an hybrid hosting using different platforms. I've decided to start with Objenesis which is easier to 
migrate. I'll describe the process in this post. Hopefully, it will be helpful to someone but, in fact, I'm also looking 
forward to your feedback to see if I can improve my final setup.

So, Objenesis source code was originally on Google Code. I've moved it to GitHub some years ago mainly because pull 
requests are awesome. The website is also a GitHub page. Part of the documentation is on Google Code wiki, the binaries 
are on Google Code as well as the issue tracker.

Google being nice folks, they used to provide a nice way (https://code.google.com/export-to-github, now down) to migrate everything 
to GitHub. But I couldn't use that because

* I don't want the project to end up in `henri-tremblay/objenesis`. I want it where it is now, in the
 [EasyMock organisation](https://github.com/easymock)
* I only want to migrate the wiki and the issues since the sources are already there

So here's what I did instead.

## Issue tracker

The issue tracker was migrated using the [IssueExporterTool](https://github.com/google/support-tools/tree/master/googlecode-issues-exporter). 
It worked perfectly (but is a bit slow as advertised).

## Wiki pages

At first, I tried to export the entire Objenesis project to Github to be able to retrieve the wiki pages and then move them 
to the real source code. The result was quite bad because the tables are not rendered correctly. So I ended up manually 
migrating each page to markdown. There was only 3 pages so it wasn't too bad.

## Binaries

This was more complicated. Maven binaries are already deployed through the Sonatype Nexus. But I needed to migrate the 
standalone bundles. I've looked into three options:

* GitHub releases
* Bintray
* Both (GitHub releases exported to Bintray)

GitHub releases are created automatically when you tag in git. But you also seem to be able to add some release notes and 
binaries over that. I didn't want to dig too much into it. I knew I wanted to be in Bintray in the end. And I wanted easy 
automation. Bintray was easy to use so I went for Bintray only. Be aware, the way I did the migration is low-tech (but works).

1. Make a list of all the binaries to migrate
  * Get them with `wget https://objenesis.googlecode.com/files/objenesis-xxx.zip`
2. Create an [organisation](https://bintray.com/easymock), a [distribution repository](https://bintray.com/easymock/distributions) and 
  an [objenesis package])(https://bintray.com/easymock/distributions/objenesis) in Bintray
3. Add my GPG key to my Bintray account
4. Upload everything using REST (`curl -T objenesis-xxx.zip -H "X-GPG-PASSPHRASE: ${PASSPHRASE}" -uhenri-tremblay:${API_KEY} https://api.bintray.com/content/easymock/distributions/objenesis/xxx/objenesis-xxx-bin.zip?publish=1`)

It works, the only drawback is that no release notes are provided. They've always been on the [website](http://objenesis.org/notes.html)

## Project moved

Finally, I've set the "Project Moved" flag to target [GitHub](https://github.com/easymock/objenesis). This quite aggressively
redirects you to GitHub if you try to access https://code.google.com/p/objenesis.
