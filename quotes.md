---
layout: base.njk
title: Quotes
description: A collection of meaningful quotes that resonate with me.
---

<div class="quotes-list">
  <blockquote class="quote">
    <p>"A healthy man wants a thousand things, a sick man only wants one."</p>
    <cite>- Confucius</cite>
  </blockquote>
</div>

<style>
.quotes-list {
  max-width: 700px;
  margin: 0 auto;
}

.quote {
  margin: 2rem 0;
  padding: 2rem;
  border-left: 4px solid var(--text-color);
  background-color: var(--background-color);
  border-radius: 4px;
}

.quote p {
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-style: italic;
}

.quote cite {
  display: block;
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.8;
}
</style>
