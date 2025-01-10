---
layout: base.njk
title: My thoughts
description: My thoughts and writings on various topics.
---


<ul class="post-list">
{%- for post in collections.post | reverse -%}
  <li>
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    <span class="post-date">{{ post.date | dateFormat }}</span>
    <p>{{ post.data.description }}</p>
  </li>
{%- endfor -%}
</ul>