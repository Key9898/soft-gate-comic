---
title: Press kit page + chrome alignment
type: note
date: 2026-08-13
tags: [press, info, chrome, a11y, i18n, honesty, softgate]
impl: 57
---

# Impl 57 — Press kit page + chrome alignment

## Why

- Press violated the Company-tier convention: `compact` header instead of the declared `masthead` (`pageMeta.ts` + info-page-chrome), no radial wash, centered `max-w-3xl` wrapper breaking left-edge alignment with the `max-w-7xl` Navigation/Footer shell (Container standard, Impl 56).
- Press was an honest but empty state; industry standard is a press-kit hub (boilerplate, logo pack, fact sheet, media contact).
- CTA lacked hover/focus/transition states and a 44px target; decorative icon lacked `aria-hidden`; secondary About link had no interaction states.

## What shipped

- **PressPage rebuild** — masthead + radial wash + `max-w-7xl` shell; four sections:
  - **Boilerplate** (`press.boilerplateTitle` / `press.boilerplate`) — honest demo-portal copy, `max-w-3xl` reading measure
  - **Brand Assets** — real downloads only (`/logo/logo.svg`, `/logo/logo.jpg`, `/logo/logo-v2.jpg`) with `download` attr + inline previews; no fake ZIP/PDF (discovery-honesty)
  - **Fact Sheet** — `dl` grid of honest facts (product, stage, market, languages, website)
  - **Media Contact** — `mailto:press@softgatecomic.com` CTA (Button-primary states, `min-h-11`, email wrapped `translate="no"`), honest `press.noReleases` line, About link via `.link` utility
- **i18n** — new `press.*` keys (boilerplate, assets, facts, contact) EN + MM; removed dead `press.articles/interviews/mentions/recentNews/unavailableTitle/unavailableDesc`
- **New test** — `src/test/PressPage.test.tsx` (5 cases: masthead + boilerplate, real download hrefs + `download` attr, honest facts, mailto CTA, no raw keys)

## Coordination note

Planned as "Impl 56 — Press + Careers chrome", but a parallel session took Impl 56 for the Careers → Creators pivot (Careers page deleted). The Careers chrome fixes from the original plan are void; this work renumbered to **57**, Press-only.

## Files

- `src/features/info/PressPage.tsx` (rebuilt)
- `src/lib/i18n/locales/en/translation.json`, `mm/translation.json`
- `src/test/PressPage.test.tsx` (new)
- `wiki/conventions/info-page-chrome.md` (press-kit hub section; Press added to container migration list)

## Verify

`npm run check`

## Next

Impl **58**
