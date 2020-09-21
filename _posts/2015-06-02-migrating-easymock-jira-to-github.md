---
layout: post
title: Migrating EasyMock Jira to GitHub
date: '2015-06-02T19:44:00.001-07:00'
author: Henri Tremblay
tags:
- What I learned today
- Projects
modified_time: '2015-06-02T19:44:12.073-07:00'
blogger_id: tag:blogger.com,1999:blog-8282654404214414992.post-3054020877808895347
blogger_orig_url: http://blog.tremblay.pro/2015/06/migrating-easymock-jira-to-github.html
---

Following my [previous article]({% post_url 2015-05-17-finish-migrating-objenesis-to-github %}), 
I will now describe the Jira migration of EasyMock to [GitHub issue tracker](https://github.com/easymock/easymock/issues).

EasyMock Jira was on Codehaus. 
So I had to migrate it somewhere else. 
Instead of migrating to another Jira instance I've decided that EasyMock doesn't need all that complexity anymore and that going to Github would enough.

The migration was made in two steps:

1. Save everything on my disk
2. Import everything in GitHub
<!--more-->
The first step is important to keep all the original content in case it is needed.

The final result is nice but some things can't be done:

* Original authors of issues and comments are lost. They are now mentioned in the description but they are not the real authors anymore
* Creation dates, modification dates, etc are lost

The final code is [here](https://github.com/henri-tremblay/jiramigrate). 
If you need to do something similar it will be useful, however it can't be reused as is since it's not that clean. 
I also did some parts manually as you will see.

## Export (Export.java)

I used the Spring `RestTemplate`</span>` to retrieve my issues through the Jira API

* The EASYMOCK project
* All issues in the project
* All fields to keep the meaning of the custom fields
* All priorities to have the list
* The project components
* The project versions
* The description of all users that have created or fixed an issue

Then I've downloaded all attachments with `wget`</span>`. 
I've created the list of attachments using a basic shell command (`grep attachme issue*.json | grep content | cut -d: -f4`). 
Not pretty but it works.

Everything is on my disk. Now I'm safe.

## Import (Import.java)

The import was made in many steps. 
All could easily automated but it was quicker to just do them manually.

GitHub doesn't have all Jira functionalities. 
There are no resolution field, affected version, &nbsp;priority, attachments or custom fields. 
So things need to be adapted.

* Affected version is dropped
* A fixed version becomes a milestone
* A component is a label
* A resolution is a label
* Custom fields are dropped
* A priority is a label
* Attachments a pushed in a [dedicated repositor](https://github.com/henri-tremblay/easymock-issue-attachments)

### Labels

All labels were created manually. 
However you can look at `CreateLabels.java` to see how it could be automated.

### Milestones

Each Jira version became a milestone. 
This was done automatically using the Github API. 
The code is in `CreateMilestones.java`

### Attachments

GitHub only supports images in attachment. 
The classical way to do an attachment of something else is to do a gist. 
I had a look at that and that's why you will see some code to create a gist in `GitHubConnector.java`

However, I took another because I had TARs, ZIPs, JARs and other binaries in my attachment. 
So I've decided to push everything to a dedicated github repository and then reference the files in my issues.

### Issues

The final step was to migrate the issues themselves. 
I had a quick look at https://code.google.com/p/support-tools/source/browse/googlecode-issues-exporter/github_issue_converter.py code (doesn't exist anymore).
I used it to migrate from Google Code to GitHub. 
There are two importants tricks in there.

* You can't insert issues too quickly because you can go over the GitHub rate limit
* You need to put some time between two comments to keep them in order because GitHub sorts the comments according to the timestamps

As soon as you know that, it's basically a mapping from fields to fields. 
The only final trick is that GitHub issues only have two status: Open and Closed. 
A newly created issue is always in the Open status. So you then need to modify it to close it if needed.

## What is left to do

I'm pretty much done for now. 
The only thing that is still missing it the release notes. 
Jira provides a page giving the release notes for each version. 
I need to regenerate them from the issues on a milestone.

But I'll try to do some actual EasyMock code first... Cheers!
