---
title: In-app search (SoftGate Comic)
type: convention
date: 2026-08-10
tags: [search, softgate]
---

# In-app search

SoftGate Comic product search lives under [`src/lib/search/`](../../src/lib/search/) and is consumed by:

- [`SearchAutocomplete`](../../src/components/SearchAutocomplete/SearchAutocomplete.tsx) in Navigation
- [`SearchPage`](../../src/features/search/SearchPage.tsx)

## Rules

- Escape user query regex specials (`escapeRegExp`)
- Debounce autocomplete (~300ms); min query length 2 for suggestions
- Tabs: Webtoons / Authors / Episodes
- Persist recent terms in `localStorage` key `softgate_recent_searches`
- Keep modules swappable for a future HTTP search API without rewriting UI

## Mock scope

Current catalog is client-side over `@softgate/shared` mock data. Do not invent unused filters (e.g. word-count) that mock fields cannot support.
