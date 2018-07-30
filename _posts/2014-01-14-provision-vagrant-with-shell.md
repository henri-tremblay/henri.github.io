---
layout: post
title: Provision Vagrant with a shell
date: '2014-01-14T12:00:00.000-08:00'
author: Henri Tremblay
tags:
- What I learned today
modified_time: '2014-01-14T12:00:07.048-08:00'
blogger_id: tag:blogger.com,1999:blog-8282654404214414992.post-5728584605976104530
blogger_orig_url: http://blog.tremblay.pro/2014/01/provision-vagrant-with-shell.html
---

To allow everyone to be able to replicate the [benchmark](https://github.com/henri-tremblay/couch-bench)
from my [previous post]({{ site.baseurl }}{% post_url 2014-01-07-the-art-of-benchmarking %}), I've played with [Vagrant](http://www.vagrantup.com)
to be able to provide correctly configured virtual machines.

I ended up provisioning two virtual machines in a single Vagrant file using shell provisioning.

I learned loads of unexpected things doing so that you will see in the [shell](https://github.com/henri-tremblay/couch-bench/blob/master/vm/injector.sh)
[files](https://github.com/henri-tremblay/couch-bench/blob/master/vm/server.sh)
and the [Vagrant file](https://github.com/henri-tremblay/couch-bench/blob/master/vm/Vagrantfile)

* How to do a dist-upgrade bypassing the interactive questions about grub
* How to install the latest NodeJS
* How to provision using the vagrant user instead of the root user (:privileged => false)
* How to specify the number of CPUs used by the VM
* How to setup a private network with Vagrant

And that provisioning a Vagrant VM takes quite a long time (especially the dist-upgrade). My two VMs are 75% the same. 
It would be nice to be able to create a base VM that forks into the two final VMs.

Is there a way to do that apart from scripting to create a new box?
