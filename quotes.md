---
layout: base.njk
title: Quotes
description: A collection of meaningful quotes that resonate with me.
---

<div class="quotes-list">
    {%- for quote in quotes -%}
    <article class="quote-item">
        <div class="quote-content">
            <div class="quote-header">
                <p class="quote-text">"{{ quote.quote }}"</p>
                <time datetime="{{ quote.date }}" class="quote-date">{{ quote.date | dateFormat('M/D/YYYY') if quote.date }}</time>
            </div>
            <cite class="quote-author">{{ quote.author }}</cite>
            {%- if quote.source -%}
            <span class="quote-source">{{ quote.source }}</span>
            {%- endif -%}
        </div>
    </article>
    {%- endfor -%}
</div>