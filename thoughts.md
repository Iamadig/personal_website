---
layout: base.njk
title: Thoughts
description: Essays and reflections on technology, entrepreneurship, and personal growth.
---

<div class="thoughts-list">
    {%- for post in collections.thoughts | reverse -%}
    <article class="thought-item">
        <a href="{{ post.url }}" class="thought-link">
            <div class="thought-header">
                <h2 class="thought-title">{{ post.data.title }}</h2>
                <time datetime="{{ post.data.date | dateFormat('YYYY-MM-DD') }}" class="thought-date">{{ post.data.date | dateFormat('M/D/YYYY') }}</time>
            </div>
            <p class="thought-description">{{ post.data.description or (post.content | striptags | truncate(100)) }}</p>
        </a>
    </article>
    {%- endfor -%}
</div>