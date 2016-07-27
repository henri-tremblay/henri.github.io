---
layout: post
title: LiveReload
date: '2014-03-01T08:19:00.001-08:00'
author: Henri Tremblay
tags:
- What I learned today
modified_time: '2014-03-01T08:19:08.471-08:00'
blogger_id: tag:blogger.com,1999:blog-8282654404214414992.post-3292688260847820432
blogger_orig_url: http://blog.tremblay.pro/2014/03/livereload.html
---

I'm not originally a web developer. But I'm doing more and more of it. I've discovered [LiveReload](http://livereload.com) 
some time ago and became addicted to it.

By that I mean that I'm putting it on pretty much every web page I'm working on. Getting instant feedback is great.

I'm using Grunt to launch it. So I'm now having two files that I'm copying around. They are pretty basic but could be 
useful so I thought I could share.

## package.json

```json
{
  "name": "livereload-gruntjs",
  "version": "0.1.0",
  "devDependencies": {
    "grunt": "~0.4.2",
    "load-grunt-tasks": "~0.3.0",
    "requirejs": "~2.1.11",
    "grunt-contrib-connect": "~0.6.0",
    "grunt-contrib-watch": "~0.5.3"
  }
}
```

## Gruntfile.js

```javascript
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      options: {
        hostname: 'localhost',
        port: 9001,
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: 'app'
        }
      }
    },

    watch: {
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          'app/{,*/}*.*'
        ]
      }
    }

  });

  grunt.registerTask('serve', [
    'connect:livereload',
    'watch'
  ]);

};
```
