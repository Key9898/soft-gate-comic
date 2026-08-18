---
title: Legal pages (document shell + storage honesty)
type: convention
date: 2026-08-13
tags: [legal, privacy, terms, cookies, a11y, i18n, softgate, impl-59]
---

# Legal pages

Applies to `/privacy`, `/terms`, `/cookies` under `src/features/info/`.

## Document shell (Impl 59)

All three pages share one shell — do not re-inline it:

- `src/features/info/components/LegalTocSidebar.tsx` — TOC card; anchor links (`<a href="#id">`), scroll-spy highlight (`aria-current="location"`), reduced-motion-aware scrolling, collapsible on mobile (chevron toggle below `lg`)
- `src/features/info/components/ReadabilityControls.tsx` — text zoom (44px buttons with `aria-label`) + contrast radiogroup ("Default" / "Sepia")
- `src/features/info/components/useLegalReadability.ts` — fontSize/theme state persisted in localStorage (`softgate.legalReadability`), exports `LEGAL_SIZE_CLASSES` / `LEGAL_THEME_CLASSES`
- `src/features/info/components/useScrollSpy.ts` — IntersectionObserver active-section hook

Page rules:

- Section headings need `scroll-mt-24` (sticky nav is `top-0`, sidebar sticks at `lg:top-20`)
- No `prose*` classes (typography plugin is not installed); heading dividers use `border-gray-200/60`
- Last-updated date via `Intl.DateTimeFormat` keyed to `i18n.language` into `legal.lastUpdated`
- All chrome strings come from `legal.*` i18n keys (en + mm) — never hardcode

## Required content (Impl 60)

- **Terms** must keep the webtoon-specific sections: Eligibility & Age (13+), Your Comments (user-owned + display license), Coins & Virtual Items (no ownership / no real value / non-transferable / demo top-up simulated), anti-piracy item in Prohibited Uses
- **Privacy** leads with the localStorage honesty callout (`static.privacyLocalNote`); includes Reading Activity and Children's Privacy sections
- **Cookies** leads with the no-tracking-cookies callout (`static.noCookiesNote`); Analytics/Marketing sections stay "None"; the storage `dl` grid (`static.storage*`) must list every real localStorage category — update it when a new storage key ships
- Each page uses its own SEO description (`static.{privacy,terms,cookies}SeoDesc`), not `footer.description`

## Banned

- Declaring cookies/analytics/marketing trackers that the app does not use — the portal is localStorage-only (see [discovery-honesty.md](discovery-honesty.md))
- Fake legal boilerplate about payment processors, jurisdictions, or data sharing that does not match the demo reality

## Related

- Impl notes: [2026-08-13-legal-shell-extract.md](../notes/2026-08-13-legal-shell-extract.md), [2026-08-13-legal-content-honesty.md](../notes/2026-08-13-legal-content-honesty.md)
- Info chrome: [info-page-chrome.md](info-page-chrome.md)
