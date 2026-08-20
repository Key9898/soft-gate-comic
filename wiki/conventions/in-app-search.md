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
- Persist recent terms in `localStorage` key `softgate_recent_searches` (Clear on the empty Search page)
- Empty `/search` is a destination: visible `h1`, **Demo searches** (frozen chips, labeled not live trends), **Browse genres** (genre links, not search queries), Popular/New rails, guest Go here (`/categories`, `/ranking`, `?sort=new`)
- Do not fill Demo searches from `weeklyViewCount` or label them Trending Searches. Chips live in [`demoSearches.ts`](../../src/lib/search/demoSearches.ts) and run `?q=`
- Status / genre chips and sort dropdown only on the Webtoons tab
- `SearchAutocomplete` accepts `defaultQuery` for the Search page field
- Author tab hits and author suggestions go to `/author/:id` (not a new `?q=` search). See [author-profile.md](author-profile.md).

## Mock scope

Current catalog is client-side over `@softgate/shared` mock data. Do not invent unused filters (e.g. word-count) that mock fields cannot support.
