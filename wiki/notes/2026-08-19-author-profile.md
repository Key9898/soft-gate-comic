---
title: Author profile page
type: note
date: 2026-08-19
tags: [author, profile, search, hub, softgate]
impl: 135
---

# Impl 135 — Author profile

`/author/:id` is a catalog creator profile (not Publish with Us). Hub chip, Search authors tab, and autocomplete author hits go to the profile. Series count is published catalog titles. Hub episode stat uses published episode length. Schema stays **8**; no author JPEGs.

## Verify

`npx vitest run src/test/AuthorPage.test.tsx src/test/WebtoonDetailHub.test.tsx src/test/SearchDestination.test.tsx src/test/searchLib.test.ts src/test/SearchAutocomplete.test.tsx src/test/spaHost404.test.ts src/test/NotFoundPage.test.tsx`

## Next

Impl **138** (reader swipe + pinch).
