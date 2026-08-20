---
title: Legal pages (document shell + storage honesty)
type: convention
date: 2026-08-13
tags: [legal, privacy, terms, cookies, a11y, i18n, softgate, impl-59, impl-126]
---

# Legal pages

Applies to `/privacy`, `/terms`, `/cookies` under `src/features/info/`.

## Document shell (Impl 59, layered Impl 126)

All three pages share one shell — do not re-inline it:

- `src/features/info/components/LegalPageShell.tsx` — wash, 7xl, related-policy strip (top + bottom of the card), glance, TOC grid, document card, mailto contact
- `src/lib/info/legalEffectiveDate.ts` — `LEGAL_EFFECTIVE_DATE` + `formatLegalEffectiveDate`. Bump the constant when policy copy changes.
- `src/features/info/components/LegalTocSidebar.tsx` — TOC card; anchor links (`<a href="#id">`), scroll-spy highlight (`aria-current="location"`), reduced-motion-aware scrolling, collapsible on mobile (chevron toggle below `lg`). Nested list uses `scrollbar-thin-primary` (Impl 128) — overflow stays real; do **not** `scrollbar-hide` this pane
- `src/features/info/components/ReadabilityControls.tsx` — text zoom (44px buttons with `aria-label`) + contrast radiogroup ("Default" / "Sepia")
- `src/features/info/components/useLegalReadability.ts` — fontSize/theme state persisted in localStorage (`softgate.legalReadability`), exports `LEGAL_SIZE_CLASSES` / `LEGAL_THEME_CLASSES`
- `src/features/info/components/useScrollSpy.ts` — IntersectionObserver active-section hook

Page rules:

- Section headings need `scroll-mt-24` (sticky nav is `top-0`, sidebar sticks at `lg:top-20`)
- No `prose*` classes (typography plugin is not installed); heading dividers use `border-gray-200/60`
- Last-updated date via `formatLegalEffectiveDate` into `legal.lastUpdated` — never a per-page `new Date(2026, 0, 1)`
- First TOC item is `#glance` (`legal.glance`). Privacy/Cookies honesty is glance item 1 — do not add a second teal box that repeats it
- Related strip (`legal.relatedPolicies`): Privacy | Terms | Cookies. Current page is `<span aria-current="page">`; others are `Link`. Not a TOC item
- Contact is owned by the shell: `mailto:support@softgatecomic.com` (`translate="no"`, `min-h-11`) + `Link` to `/contact`. Do not put the address in MM strings
- Chrome strings come from `legal.*` (en + mm) — never hardcode
- Legal pages use Help-identical `radial-wash-primary` (`h-[450px]`). No page-root `overflow-hidden`

## Required content (Impl 60, honesty 126)

- **Terms** must keep the webtoon-specific sections: Eligibility & Age (13+), Your Comments (user-owned + display license), Coins & Virtual Items (no ownership / no real value / non-transferable / demo top-up simulated), anti-piracy item in Prohibited Uses, **Changes to These Terms** (`#changes` before governing law), guest vs signed-in in User Accounts. Governing law is Myanmar. Do not invent US arbitration, class waiver, or payment processors
- **Privacy** includes Reading Activity (history, scroll, likes, **series ratings**) and Children's Privacy. Rights must link `/profile?tab=security` (signed-in delete) and explain Clear site data + guests have no account
- **Cookies** Analytics/Marketing stay "None"; the storage `dl` grid must list every real localStorage category — update it when a new storage key ships:

| Category                | Key                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| Language                | `i18nextLng`                                                                                  |
| Session                 | `softgate_user`                                                                               |
| Demo accounts           | `softgate_accounts_v1`                                                                        |
| Wallet                  | `softgate_wallet_v1`                                                                          |
| Library                 | `softgate_library_v1`                                                                         |
| Author follows          | `softgate_follows_v1`                                                                         |
| History, likes, ratings | `softgate_engage_v1`                                                                          |
| Comments                | `softgate_comments_v1` (episode `id:N` + series `id:series`)                                  |
| Notifications           | `softgate_notifications_v1`                                                                   |
| Notification prefs      | `softgate_notif_prefs_v1`                                                                     |
| Recent searches         | `softgate_recent_searches`                                                                    |
| Legal readability       | `softgate.legalReadability`                                                                   |
| Reader display          | `softgate_reader_prefs_v1`                                                                    |
| 18+ age confirm         | `softgate_age_confirm_v1` (signed-in) + `softgate_age_confirm_session` (guest sessionStorage) |
| Demo catalog            | `softgate-shared-data`                                                                        |

Do not list a separate "Reading progress" row — history and `scrollRatio` live in `softgate_engage_v1`.

- Each page uses its own SEO description (`static.{privacy,terms,cookies}SeoDesc`), not `footer.description`

## Profile tab landing (Impl 126)

`/profile?tab=security` opens the Security tab (`ProfilePage` + `useSearchParams`). Valid `tab` values: `profile` | `settings` | `preferences` | `security`. Guests still hit ProtectedRoute → login (`from.pathname` + `from.search` preserved).

## Banned

- Declaring cookies/analytics/marketing trackers that the app does not use — the portal is localStorage-only (see [discovery-honesty.md](discovery-honesty.md))
- Cookie banners, preference centers, GPC, Do Not Sell
- Fake legal boilerplate about payment processors, US jurisdictions, or data sharing that does not match the demo reality

## Related

- Impl notes: [2026-08-13-legal-shell-extract.md](../notes/2026-08-13-legal-shell-extract.md), [2026-08-13-legal-content-honesty.md](../notes/2026-08-13-legal-content-honesty.md), [2026-08-19-legal-layered-notice.md](../notes/2026-08-19-legal-layered-notice.md)
- Info chrome: [info-page-chrome.md](info-page-chrome.md)
