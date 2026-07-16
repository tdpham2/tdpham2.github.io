---
layout: page
permalink: /repositories/
title: repositories
description: GitHub profile and selected open-source repositories.
nav: true
nav_order: 4
---

I contribute scientific software for agentic workflows, molecular simulation, and materials discovery. See my complete activity on [GitHub](https://github.com/tdpham2).

## Selected repositories

<div class="row row-cols-1 row-cols-md-2 g-4">
  {% for repo in site.data.repositories.github_repos %}
    <div class="col mb-4">
      <article class="card h-100">
        <div class="card-body d-flex flex-column">
          <h3 class="card-title h5">
            <a href="{{ repo.url }}" rel="external nofollow noopener" target="_blank">{{ repo.owner }}/{{ repo.name }}</a>
          </h3>
          <p class="card-text flex-grow-1">{{ repo.description }}</p>
          <p class="card-text text-muted small mb-0">
            <i class="fa-solid fa-code" aria-hidden="true"></i>
            {{ repo.language }}
          </p>
        </div>
      </article>
    </div>
  {% endfor %}
</div>
