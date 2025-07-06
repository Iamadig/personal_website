---
layout: base.njk
title: Thoughts
description: Essays and reflections on technology, entrepreneurship, and personal growth.
---

<div class="thoughts-grid">
    {%- for post in collections.thoughts | reverse -%}
    <article class="thought-card">
        <div class="card-content">
            <time datetime="{{ post.data.date | dateFormat('YYYY-MM-DD') }}" class="card-date">{{ post.data.date | dateFormat('MMM DD, YYYY') }}</time>
            <h2 class="card-title"><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
            <p class="card-description">{{ post.data.description or (post.content | striptags | truncate(120)) }}</p>
            <div class="card-footer">
                <a href="{{ post.url }}" class="read-more">Read more →</a>
            </div>
        </div>
    </article>
    {%- endfor -%}
</div>