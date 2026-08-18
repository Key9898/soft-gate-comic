---
title: About Mission & Vision + UI/UX polish
type: note
date: 2026-08-13
tags: [about, i18n, honesty, a11y, seo, softgate]
impl: 55
---

# Impl 55 — About Mission & Vision + UI/UX polish

## Why

About page had `ourMission`/`ourMissionDesc` locale keys never rendered, no Vision at all, five hardcoded English strings (broken MM locale), and values copy overclaiming unshipped features (tip gateways, dark theme, coin checkout).

## What shipped

- **Mission & Vision section** — two-card split after Our Story (Lucide `Target` / `Telescope`); new EN/MM keys `ourVision` / `ourVisionDesc` (mock-honest future statement)
- **i18n fixes** — `value*Desc` ×4 (honesty rewrite), `valuesDeck`, `viewOpenings`, `getInTouch`; removed orphan `about.mission`
- **UI/UX polish** — `useReducedMotion` guards on all Framer animation; values `<h4>`→`<h3>`, Join CTA `<footer>`→`<section>`; story img `width/height` + `loading="lazy"`; values deck normal-case readable; body paragraphs `font-bold`→`font-medium` + `text-sm`; headings `text-balance`
- **Color consolidation** — stats + values + story icon wells all uniform `bg-primary-50 text-primary-600` (shared `ICON_WELL` const); rainbow (emerald/blue/amber/red) removed per brand-color-tokens
- **SEO** — `buildOrganizationJsonLd()` in `jsonLd.ts`, wired via `<SEO jsonLd>` on About
- **Shell width alignment** — About container `max-w-5xl` → `max-w-7xl` to match Navigation / Footer / Home / Categories / Legal shell (section left edges now align with nav logo). Careers/Press (`3xl`) and Help/FAQ (`4xl`) stay narrow on purpose — single-column reading measure.
- **Test infra fix** — `setup.ts` IntersectionObserver mock rewritten as class (Vitest 4 rejects `vi.fn().mockReturnValue` constructed with `new`; needed for `whileInView`)
- **New test** — `src/test/AboutPage.test.tsx` (5 cases: mission/vision render, story, no raw keys, CTA links, honest values)

## Files

- `src/features/info/AboutPage.tsx`
- `src/lib/i18n/locales/en/translation.json`, `mm/translation.json`
- `src/components/SEO/jsonLd.ts`
- `src/test/AboutPage.test.tsx` (new), `src/test/setup.ts`

## Verify

`npm run check`

## Next

Impl **56**
