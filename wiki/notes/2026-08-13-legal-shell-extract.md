---
title: Legal pages shared shell extract + chrome fixes
type: note
date: 2026-08-13
tags: [legal, privacy, terms, cookies, a11y, i18n, refactor, softgate]
impl: 59
---

# Impl 59 — Legal shared shell + chrome fixes

## Why

Privacy / Terms / Cookies were ~300-line clones with identical TOC sidebar, readability controls, scroll-spy, and size/theme maps. They shipped dead classes (`prose*` without the typography plugin, undefined `border-gray-150`, invalid `text-xs.5`), TOC clicks hid headings under the sticky nav, chrome strings were hardcoded English, and controls failed basic a11y (icon-only buttons without labels, 32px targets, no focus rings).

## What shipped

- **New shared components** (`src/features/info/components/`):
  - `LegalTocSidebar` — anchor links + `aria-current="location"` scroll-spy, `prefers-reduced-motion` respected, `history.replaceState` hash sync, mobile collapsible (chevron, `aria-expanded`)
  - `ReadabilityControls` — zoom buttons `min-h-11` + `aria-label` (`legal.zoomIn/Out`), size label i18n'd, contrast as `role="radiogroup"` + `aria-checked`, "System" renamed "Default"
  - `useLegalReadability` — fontSize/theme persisted to `softgate.legalReadability`; exports `LEGAL_SIZE_CLASSES` / `LEGAL_THEME_CLASSES`
  - `useScrollSpy` — IntersectionObserver hook
- **Page fixes ×3** — removed dead `prose*`, `border-gray-150` → `border-gray-200/60`, dropped `text-xs.5`; `scroll-mt-24` on all section headings; sidebar sticky `lg:top-6` → `lg:top-20` (below sticky nav); last-updated date localized via `Intl.DateTimeFormat` (`my` for MM)
- **i18n** — new `legal.*` chrome keys ×12 (toc, readability, textZoom, contrast, contrastDefault/Sepia, size×4, zoomIn/Out) EN + MM
- Net: ~200 duplicated lines removed per page

## Files

- `src/features/info/components/{LegalTocSidebar,ReadabilityControls}.tsx` (new)
- `src/features/info/components/{useLegalReadability,useScrollSpy}.ts` (new)
- `src/features/info/{PrivacyPage,TermsPage,CookiesPage}.tsx`
- `src/lib/i18n/locales/{en,mm}/translation.json`
- `wiki/conventions/legal-pages.md` (new)

## Verify

`npm run check`

## Next

Impl **60** — legal content rewrite (webtoon-standard + storage honesty)
