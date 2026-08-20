---
title: Search destination empty landing
type: note
date: 2026-08-19
tags: [search, discovery, softgate]
impl: 131
---

# Impl 131 — Search destination

Empty `/search` is a discovery page: visible Search h1, Browse genres (not Trending Searches), recent + Clear, 404-class Go here, Popular and New `HomeCatalogRail`s. Results use Categories-style chips only on the Webtoons tab. No-results includes autocomplete, Go here, and Popular tiles. Author hits show an avatar or letter; episode hits show a Demo thumb and lock.

## Verify

`npx vitest run src/test/SearchDestination.test.tsx src/test/SearchAutocomplete.test.tsx src/test/A11yStructure.test.tsx src/test/searchLib.test.ts`

## Next

Impl **132** (Categories polish).
