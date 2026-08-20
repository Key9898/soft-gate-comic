---
title: About Who we are — facts, product, timeline, team
type: note
date: 2026-08-18
tags: [about, i18n, honesty, a11y, info, softgate]
impl: 103
---

# Impl 103 — About: Who we are (facts, product, timeline, team)

Plan file said Impl 102; that number was already taken by Press kit / favicon. This ships as **103**.

## Why

About used a trophy stats grid (`Local` / `9` / `Myanmar` / `Demo`) that looked like scale proof, a generic mission, no product explanation, no timeline, no people, and a "Join Us" CTA that reads as careers. Footer stays **About Us**; page H1 is **Who we are**.

## What shipped

- H1 + SEO title `about.whoWeAre`. Breadcrumb last crumb remains `static.aboutTitle` (About Us). SEO description uses `info.deck.about`.
- Stats cards replaced with Press-style `<dl>` fact chips (product / demo stage / Myanmar / EN+MM). No hover-scale, no fake MAU.
- **How this portal works** — read / two languages / coins (local demo wallet, not a live payment network).
- **Our history** skim rail (2026 ×3 + Next), one sentence each. Studio photo `/about/team/studio-workspace.jpg` with `about.studioAlt`. StoryBook stays the long read.
- Mission copy is dual reader+creator+Myanmar. Values titles: Chosen catalog / One portal / Creator path / Built for here.
- Team grid of four stand-in portraits (`team-founder.jpg`, `team-editorial.jpg`, `team-product.jpg`, `team-creators.jpg`). Asset renamed from `team-creator.jpg`. Names/roles in i18n; honesty note; portraits **not** added to Organization JSON-LD.
- CTA heading **Get involved** (`/creators`, `/contact`) with focus-visible rings.

## Files

- `public/about/team/` (five JPGs)
- `src/features/info/AboutPage.tsx`
- `src/lib/i18n/locales/{en,mm}/translation.json`
- `src/test/AboutPage.test.tsx`

## Verify

`npm run check`
