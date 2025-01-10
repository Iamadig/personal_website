---
layout: base.njk
title: My thoughts
description: My thoughts and writings on various topics.
---

<div class="blog-container">
  <section class="most-read">
    <h2>Most Read Posts</h2>
    <ul class="post-list">
    {%- for post in collections.post | reverse -%}
      <li>
        <a href="{{ post.url }}">{{ post.data.title }}</a>
        <span class="post-views">{{ post.data.views if post.data.views else "0" }} views</span>
      </li>
    {%- endfor -%}
    </ul>
  </section>

  <section class="trending">
    <h2>Trending Posts</h2>
    <ul class="post-list">
    {%- for post in collections.post | reverse | limit(5) -%}
      <li>
        <a href="{{ post.url }}">{{ post.data.title }}</a>
        <span class="post-views">{{ post.data.views if post.data.views else "0" }} views</span>
      </li>
    {%- endfor -%}
    </ul>
  </section>
</div>