---
layout: post
title: Manage emails in git
date: '2016-02-16T01:00:00.000-08:00'
author: Henri Tremblay
tags:
- What I learned today
modified_time: '2016-02-16T23:12:53.093-08:00'
blogger_id: tag:blogger.com,1999:blog-8282654404214414992.post-8471363796484285172
blogger_orig_url: http://blog.tremblay.pro/2016/02/manage-emails-in-git.html
---

If you are like me, you tend to work on open source using your personal email and at YP using your enterprise email. But
git doesn't handle that well so you need to never forget to do 

```bash
git config user.email henri.tremblay@somewhere.com
``` 

after each `git init` or `git clone`.

I finally had the time for work on an almost satisfying solution.
<!--more-->

First, there is a concept of git template. It means that your `.git` directory will be initialized with files coming from
a template. By default, it uses the default template `$GIT_INSTALL_DIR/share/git-core/templates`.

However, you can define your own. That's [what I did](https://github.com/henri-tremblay/git_template).

If you clone (and fork) this repository, you can then set it as the default template

```bash
git config --global init.templatedir "$PWD/template"
```

Why do I need that? Because I want a standard pre-commit hook that will make sure my personal email is not used when
committing to my corporate git repositories and that my work email is never used on GitHub.

Look at the [code of the hook](https://github.com/henri-tremblay/git_template/blob/master/template/hooks/pre-commit). I'm
pretty sure that is a lot of room for improvement. But it's a good start. Of course, you will need to modify the `enterprise_email`
variable to fit yours. If you find a way to improve, please do a pull request.

Some details about what it does

1. It checks that a remote origin is configured and fails if not. I might found that annoying soon. We'll see. I need a
remote origin because I need to know if it will commit to my enterprise git or somewhere else
2. It checks is the remote origin is my enterprise and then if the email set is my enterprise email
3. If not, it sets it and fail. I would have love to commit right away but it seems git keeps committing with the old value.
4. If I am committing on a repo outside my company, it makes sure I'm not using the enterprise email and fails if I do
