---
title: `/ranking` is the Popular catalog path
type: decision
date: 2026-08-19
tags: [ranking, categories, seo, softgate]
impl: 141
---

# `/ranking` is the Popular catalog path

## Status

Accepted

## Context

Nav Popular used `/categories?sort=popular`. WEBTOON-style ranking is a first-class path. A silent alias (`/ranking` → query, nav still query) would be a second door with no product gain.

## Decision

`/ranking` **is** the all-genre numbered catalog (same `CategoriesPage`, ranks on). Nav, Home View all, 404/Search/Author recovery, sitemap, and canonical use `/ranking`. `/categories?sort=popular` (no genre) replace-navigates there. Genre charts stay `/categories/:slug?sort=popular`. New Releases stay `?sort=new`. No `/new` route.

## Consequences

- Host must list `/ranking` in `SPA_REWRITE_SOURCES` and `vercel.json` or production 404s the page.
- `/ranking` must not carry `sort=popular` (redirect loop).
- Dropdown Popular on all-genre browse goes to `/ranking`; with a genre slug it keeps the genre chart URL.

## Alternatives considered

- Query-only Popular — weaker URL grammar than peers.
- Alias-only `/ranking` — extra rewrite, nav still query, no UX win.
- Separate ranking page with Daily/gender/24h — dishonest with current mock data.
