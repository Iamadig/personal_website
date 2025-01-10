---
layout: base.njk
title: My thoughts
description: My thoughts and writings on various topics.
---

<ul class="post-list">
{%- for post in collections.post | reverse -%}
  <li>
    <a href="{{ post.url }}">{{ post.data.title }}</a>
  </li>
{%- endfor -%}
</ul>