---
title: Favicon, OG PNG, Press kit IA
type: note
date: 2026-08-18
tags: [press, favicon, seo, og, contact, honesty, softgate]
impl: 102
---

# Impl 102 — Favicon, OG PNG, Press kit IA

## Why

Site still pointed at Vite default `/vite.svg` and deleted `logo.jpg` for OG. Press kit listed those JPGs and buried the no-releases line in the contact card. Need an honest international press-kit layout on `/press` plus real HQ/legal facts.

## What shipped

- Favicon: `favicon.svg` + `favicon-32.png` + `apple-touch-icon.png` in `index.html`. Client may replace `favicon.svg` in place later.
- OG / Twitter / JSON-LD default image: `/logo/logo.png` (2000×1524). Organization JSON-LD: `legalName` SoftGate, `foundingDate` 2026, Insein / Yangon / MM. Press SEO uses the same builder.
- Contact address i18n: Insein, Yangon / အင်းစိန်၊ ရန်ကုန်မြို့.
- Press IA: boilerplate + Copy; fact sheet (legal name, HQ, founded, platforms, https URL); News empty; assets SVG/PNG/icon-512; Do/Don’t; screenshot and spokesperson honest empty; media `press@` with Yangon time, no SLA; last updated 18 August 2026. No JPG, coverage, ZIP, or Canva SVG as a press download.

## Files

- `index.html`, `src/components/SEO/jsonLd.ts`
- `src/features/info/PressPage.tsx`, `ContactPage.tsx`
- `src/lib/i18n/locales/en/translation.json`, `mm/translation.json`
- `src/test/PressPage.test.tsx`, `src/test/ContactPage.test.tsx`

## Verify

`npm run check`

## Next

Impl **103**
