---
title: Careers → Creators (Publish with Us) pivot
type: note
date: 2026-08-13
impl: 56
tags: [creators, careers, info, i18n, seo, softgate]
---

# Careers → Creators ("Publish with Us") pivot

Careers page was an empty "not hiring" card — no value in a demo webtoon portal. Pivoted to a **creator acquisition** page following WEBTOON (Publish / Creators 101) and Tapas (Publish on Tapas) structure. Also fixed deep-scan findings: masthead variant violation, CTA missing hover/focus-visible, dead `careers.*` i18n keys.

## What shipped

- **New page** `src/features/info/CreatorsPage.tsx` at **`/creators`** (`CareersPage.tsx` deleted, no redirect — demo):
  1. Masthead hero — `Breadcrumb` + `PageHeader variant={page.header}` (data-driven `masthead`) + soft radial teal wash
  2. How it works — 3 step cards (Lucide `BookOpen` / `FileImage` / `Send`)
  3. Format checklist — vertical-scroll JPG/PNG episodes, portrait 3:4 cover, title+genre+synopsis, ≥3 launch episodes
  4. What we look for — catalog-genre fit, consistent art/schedule, original rights
  5. CTA card — single `Link to="/contact"` with `hover:bg-primary-700` + `focus-visible:ring-2`, plus legal note (no unsolicited files — Tapas pattern)
- **Layout standard**: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` shell + left-aligned `max-w-3xl` text columns (see [info-page-chrome.md](../conventions/info-page-chrome.md) container standard)
- **Wiring**: `src/features/info/index.ts`, `src/App.tsx` route, `src/lib/info/pageMeta.ts` (`careers` → `creators` key), `Footer` company link, `public/sitemap.xml`
- **i18n (EN/MM)**: deleted `careers.*` block; added `creators.*` (steps, specs, lookFor, CTA, legalNote); renamed `footer.careers` → `footer.creators` ("Publish with Us" / "ဇာတ်လမ်းတင်ရန်"), `static.careersTitle` → `static.creatorsTitle`, `info.eyebrow|deck.careers` → `.creators`, `about.viewOpenings` → `about.publishWithUs`
- **About CTA**: `to="/creators"` + `about.publishWithUs` label
- **Tests**: new `src/test/CreatorsPage.test.tsx` (6 tests: h1, 3 steps, panels, single contact CTA + legal note, breadcrumb, no raw keys); `AboutPage.test.tsx` CTA assertion updated

## Numbering

Plan drafted as "Impl 55" but 55 was taken by About Mission & Vision polish (same date, parallel session) — recorded as **Impl 56**.

## Verify

- `npm run check`
- Manual QA: `/creators` masthead + left-edge alignment with nav logo; `/careers` → 404; footer "Publish with Us"; About CTA
