---
layout: page
title: All posts
---

Here is the list of all my posts. To make my life easier when I'm looking for one.

{% for post in site.posts %}
<h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
<p><small><strong>{{ post.date | date: "%B %e, %Y" }}</strong></small></p>
{% endfor %}
