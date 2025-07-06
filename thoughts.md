---
layout: base.njk
title: Thoughts
description: Essays and reflections on technology, entrepreneurship, and personal growth.
---

<div class="blog-list">
    {%- for post in collections.thoughts | reverse -%}
    <article>
        <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
        <time datetime="{{ post.data.date | dateFormat('YYYY-MM-DD') }}" class="post-date">{{ post.data.date | dateFormat('MMMM DD, YYYY') }}</time>
        <p class="post-description">{{ post.data.description or (post.content | striptags | truncate(150)) }}</p>
    </article>
    {%- endfor -%}
</div>