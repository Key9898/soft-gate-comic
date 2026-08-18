---
title: Impl 8 — SoftGate Comic SEO + in-app search
type: note
date: 2026-08-10
tags: [seo, search, impl-8]
impl: 8
---

# Impl 8 — SoftGate Comic SEO + in-app search

## SEO

- Added `react-helmet-async` + `<SEO />` with WebSite / Book / Article helpers
- Public pages get indexable meta; auth/library/coins/profile/notifications use `noindex`
- `index.html` theme-color → SoftGate primary `#0e9494`
- Hardened `public/robots.txt` + public-only `public/sitemap.xml`

## In-app search

- `src/lib/search/*` — webtoons / authors / episodes / suggestions / recent searches
- Nav `SearchAutocomplete` (debounce + suggestions → `/search?q=`)
- SearchPage tabs + filters (status, genre, sort) + real recent searches

## Follow-up

Backend-backed dynamic sitemaps / share HTML / OG screenshots when SoftGate API exists.
