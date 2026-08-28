---
title: Project Wiki Index
type: reference
date: 2026-08-10
tags: [wiki, index]
---

# Project Wiki

AI assistants and developers knowledge base for **SoftGate Comic**.
When the user asks to remember something (decision, snippet, note, ref), the wiki skill saves under this folder.

## Structure

| Folder                         | Purpose                               |
| ------------------------------ | ------------------------------------- |
| [architecture/](architecture/) | System design, implementation phases  |
| [decisions/](decisions/)       | Architecture Decision Records (ADR)   |
| [conventions/](conventions/)   | Coding standards, naming, UI patterns |
| [snippets/](snippets/)         | Reusable code snippets                |
| [notes/](notes/)               | Dated session mirrors / loose notes   |
| [references/](references/)     | External links, PM tracker, contracts |

## Index

### Core

- [00-overview.md](00-overview.md) — project overview, stack, scripts
- [01-stack.md](01-stack.md) — tech stack details & versions
- [02-workflow.md](02-workflow.md) — git workflow, hooks, documentation dual-track
- [03-folder-map.md](03-folder-map.md) — codebase folder responsibilities

### Architecture & references

- [architecture/implementation-phases.md](architecture/implementation-phases.md) — SoftGate Comic Impl master (**next: 185**)
- [architecture/implementation-phases-legacy.md](architecture/implementation-phases-legacy.md) — legacy immersive archive
- [references/pm-tracker-airtable.md](references/pm-tracker-airtable.md) — Airtable PM tracker (legacy-era rows)
- [references/api-contract.md](references/api-contract.md) — legacy EDC frontend ↔ backend API contract
- [references/softgate-api.md](references/softgate-api.md) — SoftGate `apps/api` health + catalog + settings + reader auth + wallet + named slots (Impl 171–176)
- Pre-backend Admin catalog/settings contract (list lives in Admin wiki; do not invent conflicting portal fields): [`../soft-gate-comic-admin-dashboard/wiki/references/website-integration.md`](../../soft-gate-comic-admin-dashboard/wiki/references/website-integration.md)
- [references/admin-coin-packages.md](references/admin-coin-packages.md) — Admin Impl 24 blob → consumed on `/coins` (Impl 168)
- [references/avatar-manifest.md](references/avatar-manifest.md) — (legacy/reference; not SoftGate portal runtime)

### Conventions (SoftGate portal)

- [conventions/brand-color-tokens.md](conventions/brand-color-tokens.md) — logo-aligned primary/accent
- [conventions/portal-light-and-i18n-defaults.md](conventions/portal-light-and-i18n-defaults.md) — light-only + default EN
- [conventions/portal-scroll-chrome.md](conventions/portal-scroll-chrome.md) — hide doc scrollbar + ScrollToTop (Impl 47); legal TOC thin bar (Impl 128); sticky-below-nav (Impl 143)
- [conventions/hero-spotlight.md](conventions/hero-spotlight.md) — Home Spotlight rotator (Impl 49, jobs Impl 104); Home skeleton same banner chrome (Impl 159)
- [conventions/forced-product-motion.md](conventions/forced-product-motion.md) — product animations we add are forced (Impl 90); auth photo curtain (Impl 149)
- [conventions/prelaunch-quality-bar.md](conventions/prelaunch-quality-bar.md) — international standard; beat peers on layout/info/UI (Impl 105)
- [conventions/portal-seo.md](conventions/portal-seo.md) — per-route Helmet SEO + robots/sitemap; Vercel unknown-path HTTP 404 (Impl 123)
- [conventions/in-app-search.md](conventions/in-app-search.md) — search lib + autocomplete + SearchPage; Demo searches chips (Impl 145)
- [conventions/border-radius.md](conventions/border-radius.md) — Soft-Expressive radius map (Impl 10) + book-media exception
- [conventions/book-cover-presentation.md](conventions/book-cover-presentation.md) — BookCard + HeroBook3D (Impl 16–18)
- [conventions/catalog-tiles.md](conventions/catalog-tiles.md) — discovery tile fields + New badge (Impl 96); Daily board (Impl 150); Premium top-left (Impl 152); Daily drops not catalog tiles (Impl 153); Demo Updated/New dates (Impl 154)
- [conventions/portal-catalog-read.md](conventions/portal-catalog-read.md) — mock localStorage vs `GET /api/catalog` published read model (Impl 172)
- [conventions/portal-settings-read.md](conventions/portal-settings-read.md) — mock vs `GET /api/settings` (Impl 173)
- [conventions/portal-auth-http.md](conventions/portal-auth-http.md) — mock localStorage vs reader cookie API (Impl 174)
- [conventions/portal-wallet-http.md](conventions/portal-wallet-http.md) — mock `softgate_wallet_v1` vs stub ledger + catalog strip (Impl 175)
- [conventions/named-integrations.md](conventions/named-integrations.md) — optional Prisma/R2/Brevo env slots; persist stays stub (Impl 176)
- [conventions/portal-seo-ssr.md](conventions/portal-seo-ssr.md) — Vite SSR/hybrid for public routes, hreflang `/mm`, dynamic sitemap, OG images (Impl 178–181)
- [conventions/about-story-book.md](conventions/about-story-book.md) — About Our Story episode reader (Impl 87–95)
- [conventions/categories-browse.md](conventions/categories-browse.md) — genre match + status URL (Impl 11); `/ranking` + Browse vs ranks (Impl 141); chart chrome (Impl 143); reserved chevron slot (Impl 169)
- [conventions/series-hub.md](conventions/series-hub.md) — webtoon detail Continue/Latest, tags, thumbs (Impl 130); author chip → profile (Impl 135); Subscribe + 18+ badge (Impl 140); series discussion (Impl 144); wait-for-free chips (Impl 151)
- [conventions/content-rating.md](conventions/content-rating.md) — per-title ratings + 18+ Reader gate (Impl 140)
- [conventions/author-profile.md](conventions/author-profile.md) — `/author/:id` catalog profile (Impl 135); Follow (Impl 148)
- [conventions/reader-chrome.md](conventions/reader-chrome.md) — episode sheet, prefs, keyboard, image fit, swipe/pinch (Impl 133, 138); Profile Preferences same key (Impl 142); first-panel fetchpriority + async decode (Impl 165); optional imageSizes consume (Impl 166)
- [conventions/library-bookmarks.md](conventions/library-bookmarks.md) — Subscribe → Library store (Impl 25, rename Impl 140); History Continue (Impl 142)
- [conventions/client-auth.md](conventions/client-auth.md) — local accounts + session (Impl 27); password min 8 (Impl 142); split-card (Impl 146); photo curtain (Impl 149); HTTP cookie SoT when mock off (Impl 174)
- [conventions/client-wallet.md](conventions/client-wallet.md) — Demo top-up + unlock (Impl 28–29); Coins honesty copy (Impl 142); wait-for-free (Impl 151); HTTP stub ledger (Impl 175)
- [conventions/discovery-honesty.md](conventions/discovery-honesty.md) — author→profile, related, LS version (Impl 13–15, 135); Search Demo chips not live trends (Impl 145); For You (Impl 147); Author Follow not public count (Impl 148); Daily `uploadDay` (Impl 150); Daily scheduled drops (Impl 153); Demo Updated/New dates + copy (Impl 154); trust stored catalog (Impl 167)
- [conventions/library-engagement.md](conventions/library-engagement.md) — history + likes (Impl 31–32)
- [conventions/continue-reading.md](conventions/continue-reading.md) — Home Continue + scroll resume (Impl 40–41)
- [conventions/client-comments-notifications.md](conventions/client-comments-notifications.md) — comments + notifs (Impl 34–35); empty-first inbox + prefs (Impl 142); series hub thread (Impl 144)
- [conventions/typography.md](conventions/typography.md) — Inter + Noto Sans Myanmar stack (Impl 12)
- [conventions/info-page-chrome.md](conventions/info-page-chrome.md) — breadcrumb + PageHeader tiers (Impl 17); Creators intake (Impl 107, polish 110); Support funnel (Impl 108, 111); Contact pitch fields (Impl 112); 404 recovery (Impl 118, polish 121); Help hub + Footer FAQ (Impl 120)
- [conventions/source-layering-and-imports.md](conventions/source-layering-and-imports.md) — layers + hybrid imports (Impl 19)
- [conventions/legal-pages.md](conventions/legal-pages.md) — legal document shell + storage honesty (Impl 59–60, layered 126); TOC scrollbar (Impl 128); notif prefs row (Impl 142)
- [conventions/guest-access.md](conventions/guest-access.md) — guest policy matrix + conversion nudges (Impl 67)
- [conventions/loading-states.md](conventions/loading-states.md) — skeleton system + UI state stack (Impl 68); 155a layout / 155b contract; pulse (Impl 156); docs truth (Impl 157); Daily skeleton cap (Impl 158); Home hero skeleton chrome (Impl 159); Home Continue / For You by session (Impl 160); account pages unhooked from catalog (Impl 161); Search landing live chrome + Reader chrome (Impl 162); Search query live chrome (Impl 163); Categories skeleton live chrome (Impl 164); reserved genre-rail chevron slot (Impl 169); HeroBook3D SSR `img.complete` reveal (Impl 182); BookCard / DailyDropCard SSR `img.complete` reveal (Impl 183)
- [conventions/responsive-chrome.md](conventions/responsive-chrome.md) — nav breakpoint ladder + width budget + overflow guard (Impl 77); skip overlay (Impl 101)

### Decisions

- [decisions/001-use-stripe.md](decisions/001-use-stripe.md)
- [decisions/002-soft-expressive-radius.md](decisions/002-soft-expressive-radius.md) — Soft-Expressive radius (Impl 10)
- [decisions/003-softgate-type-stack.md](decisions/003-softgate-type-stack.md) — type stack (Impl 12)
- [decisions/004-book-media-presentation.md](decisions/004-book-media-presentation.md) — book covers (Impl 16)
- [decisions/005-herobook3d-ux.md](decisions/005-herobook3d-ux.md) — HeroBook3D UX harden (Impl 18)
- [decisions/006-ranking-path.md](decisions/006-ranking-path.md) — `/ranking` is Popular (Impl 141)
- [decisions/007-backend-integrations.md](decisions/007-backend-integrations.md) — Hono API + named Postgres/Prisma, R2, Brevo (Impl 171); catalog GET in 172 (persist still stub)

### Recent SoftGate notes

- [notes/2026-07-13-project-restructure.md](notes/2026-07-13-project-restructure.md) — Impl 1
- [notes/2026-07-15-softgate-rebrand-handover.md](notes/2026-07-15-softgate-rebrand-handover.md) — Impl 2
- [notes/2026-07-17-hero-banner-overlay-readability.md](notes/2026-07-17-hero-banner-overlay-readability.md) — Impl 3
- [notes/2026-07-20-brand-theme-color-palette.md](notes/2026-07-20-brand-theme-color-palette.md) — Impl 4
- [notes/2026-07-20-default-en-force-light.md](notes/2026-07-20-default-en-force-light.md) — Impl 5
- [notes/2026-08-10-company-structure-alignment.md](notes/2026-08-10-company-structure-alignment.md) — Impl 6
- [notes/2026-08-10-softgate-brand-rename-svg-logo.md](notes/2026-08-10-softgate-brand-rename-svg-logo.md) — Impl 7
- [notes/2026-08-10-seo-and-in-app-search.md](notes/2026-08-10-seo-and-in-app-search.md) — Impl 8
- [notes/2026-08-11-logo-theme-token-polish.md](notes/2026-08-11-logo-theme-token-polish.md) — Impl 9
- [notes/2026-08-11-soft-expressive-radius.md](notes/2026-08-11-soft-expressive-radius.md) — Impl 10
- [notes/2026-08-11-categories-phase-a.md](notes/2026-08-11-categories-phase-a.md) — Impl 11
- [notes/2026-08-11-typography-stabilize.md](notes/2026-08-11-typography-stabilize.md) — Impl 12
- [notes/2026-08-11-discovery-ui-truth.md](notes/2026-08-11-discovery-ui-truth.md) — Impl 13
- [notes/2026-08-11-discovery-data-integrity.md](notes/2026-08-11-discovery-data-integrity.md) — Impl 14
- [notes/2026-08-11-discovery-cta-honesty.md](notes/2026-08-11-discovery-cta-honesty.md) — Impl 15
- [notes/2026-08-11-book-cover-presentation.md](notes/2026-08-11-book-cover-presentation.md) — Impl 16
- [notes/2026-08-11-info-page-headers.md](notes/2026-08-11-info-page-headers.md) — Impl 17
- [notes/2026-08-11-herobook3d-ux-harden.md](notes/2026-08-11-herobook3d-ux-harden.md) — Impl 18
- [notes/2026-08-11-structure-hygiene.md](notes/2026-08-11-structure-hygiene.md) — Impl 19
- [notes/2026-08-11-profile-components-extract.md](notes/2026-08-11-profile-components-extract.md) — Impl 20
- [notes/2026-08-11-library-components-extract.md](notes/2026-08-11-library-components-extract.md) — Impl 21
- [notes/2026-08-11-coins-components-extract.md](notes/2026-08-11-coins-components-extract.md) — Impl 22
- [notes/2026-08-11-reader-comments-extract.md](notes/2026-08-11-reader-comments-extract.md) — Impl 23
- [notes/2026-08-11-categories-genre-scroll.md](notes/2026-08-11-categories-genre-scroll.md) — Impl 24
- [notes/2026-08-11-library-bookmark-wiring.md](notes/2026-08-11-library-bookmark-wiring.md) — Impl 25
- [notes/2026-08-11-categories-genre-rail-slot.md](notes/2026-08-11-categories-genre-rail-slot.md) — Impl 26
- [notes/2026-08-11-client-auth-honesty.md](notes/2026-08-11-client-auth-honesty.md) — Impl 27
- [notes/2026-08-11-client-wallet-demo-topup.md](notes/2026-08-11-client-wallet-demo-topup.md) — Impl 28
- [notes/2026-08-11-premium-unlock-wallet.md](notes/2026-08-11-premium-unlock-wallet.md) — Impl 29
- [notes/2026-08-11-episode-media-reader.md](notes/2026-08-11-episode-media-reader.md) — Impl 30
- [notes/2026-08-11-reading-history-badges.md](notes/2026-08-11-reading-history-badges.md) — Impl 31
- [notes/2026-08-11-likes-store-library.md](notes/2026-08-11-likes-store-library.md) — Impl 32
- [notes/2026-08-11-profile-auth-derived-stats.md](notes/2026-08-11-profile-auth-derived-stats.md) — Impl 33
- [notes/2026-08-11-share-comments-client-wire.md](notes/2026-08-11-share-comments-client-wire.md) — Impl 34
- [notes/2026-08-11-notifications-honesty.md](notes/2026-08-11-notifications-honesty.md) — Impl 35
- [notes/2026-08-11-dead-chrome-reader-polish.md](notes/2026-08-11-dead-chrome-reader-polish.md) — Impl 36
- [notes/2026-08-11-marketing-home-honesty.md](notes/2026-08-11-marketing-home-honesty.md) — Impl 37
- [notes/2026-08-11-mock-honest-roadmap-close.md](notes/2026-08-11-mock-honest-roadmap-close.md) — Impl 38
- [notes/2026-08-11-home-ui-polish.md](notes/2026-08-11-home-ui-polish.md) — Impl 39
- [notes/2026-08-11-home-continue-episode-rail.md](notes/2026-08-11-home-continue-episode-rail.md) — Impl 40
- [notes/2026-08-11-reading-scroll-resume.md](notes/2026-08-11-reading-scroll-resume.md) — Impl 41
- [notes/2026-08-11-herobook3d-tilt-fix.md](notes/2026-08-11-herobook3d-tilt-fix.md) — Impl 42
- [notes/2026-08-11-home-genres-chevron.md](notes/2026-08-11-home-genres-chevron.md) — Impl 43
- [notes/2026-08-11-herobook3d-open-fix.md](notes/2026-08-11-herobook3d-open-fix.md) — Impl 44
- [notes/2026-08-11-herobook3d-hinge-size.md](notes/2026-08-11-herobook3d-hinge-size.md) — Impl 45
- [notes/2026-08-11-herobook3d-static-mid-align.md](notes/2026-08-11-herobook3d-static-mid-align.md) — Impl 46
- [notes/2026-08-11-scroll-chrome-scroll-to-top.md](notes/2026-08-11-scroll-chrome-scroll-to-top.md) — Impl 47
- [notes/2026-08-11-hero-optical-vertical-center.md](notes/2026-08-11-hero-optical-vertical-center.md) — Impl 48
- [notes/2026-08-11-hero-spotlight-carousel.md](notes/2026-08-11-hero-spotlight-carousel.md) — Impl 49
- [notes/2026-08-11-about-i18n-missing-keys.md](notes/2026-08-11-about-i18n-missing-keys.md) — Impl 50
- [notes/2026-08-11-herobook3d-fore-edge-pose.md](notes/2026-08-11-herobook3d-fore-edge-pose.md) — Impl 51
- [notes/2026-08-11-herobook3d-unflatten-fore-edge.md](notes/2026-08-11-herobook3d-unflatten-fore-edge.md) — Impl 52
- [notes/2026-08-13-about-mission-vision-polish.md](notes/2026-08-13-about-mission-vision-polish.md) — Impl 55
- [notes/2026-08-13-creators-page-pivot.md](notes/2026-08-13-creators-page-pivot.md) — Impl 56
- [notes/2026-08-13-press-kit-chrome-align.md](notes/2026-08-13-press-kit-chrome-align.md) — Impl 57
- [notes/2026-08-13-legal-shell-extract.md](notes/2026-08-13-legal-shell-extract.md) — Impl 59
- [notes/2026-08-13-legal-content-honesty.md](notes/2026-08-13-legal-content-honesty.md) — Impl 60
- [notes/2026-08-13-support-pages-revamp.md](notes/2026-08-13-support-pages-revamp.md) — Impl 58
- [notes/2026-08-11-herobook3d-static-pose-always-on.md](notes/2026-08-11-herobook3d-static-pose-always-on.md) — Impl 54
- [notes/2026-08-11-about-story-split-narrative.md](notes/2026-08-11-about-story-split-narrative.md) — Impl 53
- [notes/2026-08-13-app-shell-alignment.md](notes/2026-08-13-app-shell-alignment.md) — Impl 61
- [notes/2026-08-13-broken-flows-fix.md](notes/2026-08-13-broken-flows-fix.md) — Impl 62
- [notes/2026-08-13-read-tracking-unlock-likes.md](notes/2026-08-13-read-tracking-unlock-likes.md) — Impl 63
- [notes/2026-08-13-polish-sweep.md](notes/2026-08-13-polish-sweep.md) — Impl 64
- [notes/2026-08-13-cross-tab-sync.md](notes/2026-08-13-cross-tab-sync.md) — Impl 65
- [notes/2026-08-13-account-data-migration.md](notes/2026-08-13-account-data-migration.md) — Impl 66
- [notes/2026-08-13-reader-guest-nudges.md](notes/2026-08-13-reader-guest-nudges.md) — Impl 67
- [notes/2026-08-13-skeleton-loading-states.md](notes/2026-08-13-skeleton-loading-states.md) — Impl 68
- [notes/2026-08-13-reader-celebration-truth.md](notes/2026-08-13-reader-celebration-truth.md) — Impl 69
- [notes/2026-08-13-dialog-a11y-system.md](notes/2026-08-13-dialog-a11y-system.md) — Impl 70
- [notes/2026-08-13-coins-honesty-i18n.md](notes/2026-08-13-coins-honesty-i18n.md) — Impl 71
- [notes/2026-08-13-coins-wizard-shell.md](notes/2026-08-13-coins-wizard-shell.md) — Impl 72
- [notes/2026-08-13-chrome-polish-safe-area.md](notes/2026-08-13-chrome-polish-safe-area.md) — Impl 73
- [notes/2026-08-13-theme-mechanical-sweep.md](notes/2026-08-13-theme-mechanical-sweep.md) — Impl 74
- [notes/2026-08-13-i18n-sweep.md](notes/2026-08-13-i18n-sweep.md) — Impl 75
- [notes/2026-08-13-a11y-structural.md](notes/2026-08-13-a11y-structural.md) — Impl 76
- [notes/2026-08-19-auth-split-card.md](notes/2026-08-19-auth-split-card.md) — Impl 146
- [notes/2026-08-19-for-you.md](notes/2026-08-19-for-you.md) — Impl 147
- [notes/2026-08-19-author-follow.md](notes/2026-08-19-author-follow.md) — Impl 148
- [notes/2026-08-19-wait-for-free.md](notes/2026-08-19-wait-for-free.md) — Impl 151
- [notes/2026-08-19-daily-drops.md](notes/2026-08-19-daily-drops.md) — Impl 153
- [notes/2026-08-19-discovery-time-family.md](notes/2026-08-19-discovery-time-family.md) — Impl 154
- [notes/2026-08-21-page-skeletons-match-live.md](notes/2026-08-21-page-skeletons-match-live.md) — Impl 155a layout pass
- [notes/2026-08-21-skeleton-production-contract.md](notes/2026-08-21-skeleton-production-contract.md) — Impl 155b production contract (sheen superseded by 156)
- [notes/2026-08-21-skeleton-pulse-restore.md](notes/2026-08-21-skeleton-pulse-restore.md) — Impl 156 restore pulse, remove sheen
- [notes/2026-08-21-skeleton-docs-truth.md](notes/2026-08-21-skeleton-docs-truth.md) — Impl 157 lock skeleton docs to pulse + current contract
- [notes/2026-08-21-daily-skeleton-cap.md](notes/2026-08-21-daily-skeleton-cap.md) — Impl 158 lock Daily skeleton cap
- [notes/2026-08-21-hero-skeleton-chrome.md](notes/2026-08-21-hero-skeleton-chrome.md) — Impl 159 match Home hero skeleton chrome
- [notes/2026-08-21-home-skeleton-auth-rails.md](notes/2026-08-21-home-skeleton-auth-rails.md) — Impl 160 Home skeleton Continue / For You by session
- [notes/2026-08-21-account-skeleton-triggers.md](notes/2026-08-21-account-skeleton-triggers.md) — Impl 161 unhook account pages from catalog loading
- [notes/2026-08-22-search-reader-skeleton-chrome.md](notes/2026-08-22-search-reader-skeleton-chrome.md) — Impl 162 Search landing live chrome + Reader chrome
- [notes/2026-08-22-search-query-skeleton-chrome.md](notes/2026-08-22-search-query-skeleton-chrome.md) — Impl 163 Search query live chrome
- [notes/2026-08-22-categories-skeleton-chrome.md](notes/2026-08-22-categories-skeleton-chrome.md) — Impl 164 Categories skeleton live chrome
- [notes/2026-08-23-reader-panel-priority.md](notes/2026-08-23-reader-panel-priority.md) — Impl 165 Reader first-panel fetchpriority + async decode
- [notes/2026-08-23-reader-panel-sizes.md](notes/2026-08-23-reader-panel-sizes.md) — Impl 166 Reader imageSizes consume; Admin persist later Impl 27; CLS not claimed
- [notes/2026-08-23-trust-stored-catalog.md](notes/2026-08-23-trust-stored-catalog.md) — Impl 167 Trust stored catalog (stop seed wipe); CLS not claimed
- [notes/2026-08-23-portal-coin-packages.md](notes/2026-08-23-portal-coin-packages.md) — Impl 168 Consume Admin coinPackages on /coins
- [notes/2026-08-23-genre-rail-chevron-slot.md](notes/2026-08-23-genre-rail-chevron-slot.md) — Impl 169 reserved genre-rail chevron slot
- [notes/2026-08-24-monorepo-workspace.md](notes/2026-08-24-monorepo-workspace.md) — Impl 170 portal pnpm + Turbo monorepo
- [notes/2026-08-24-api-skeleton.md](notes/2026-08-24-api-skeleton.md) — Impl 171 API skeleton
- [notes/2026-08-24-catalog-http-read.md](notes/2026-08-24-catalog-http-read.md) — Impl 172 portal catalog HTTP read
- [notes/2026-08-24-settings-http-read.md](notes/2026-08-24-settings-http-read.md) — Impl 173 portal settings HTTP read
- [notes/2026-08-24-reader-auth-cookie.md](notes/2026-08-24-reader-auth-cookie.md) — Impl 174 reader auth httpOnly cookie
- [notes/2026-08-24-wallet-paywall-strip.md](notes/2026-08-24-wallet-paywall-strip.md) — Impl 175 wallet authority + paywall strip
- [notes/2026-08-25-named-integration-slots.md](notes/2026-08-25-named-integration-slots.md) — Impl 176 named integration slots
- [notes/2026-08-25-love-in-seoul-mm-title.md](notes/2026-08-25-love-in-seoul-mm-title.md) — Impl 177 Love in Seoul MM title + schema 14
- [notes/2026-08-25-perfect-seo-ssr-hybrid.md](notes/2026-08-25-perfect-seo-ssr-hybrid.md) — Impl 178–181 Vite SSR/hybrid + JSON-LD + dynamic sitemap + /mm hreflang + OG images
- [notes/2026-08-26-hero-cover-ssr-onload.md](notes/2026-08-26-hero-cover-ssr-onload.md) — Impl 182 HeroBook3D cover after SSR onLoad miss
- [notes/2026-08-26-catalog-cover-ssr-onload.md](notes/2026-08-26-catalog-cover-ssr-onload.md) — Impl 183 catalog cover after SSR onLoad miss
- [notes/2026-08-27-dev-spa-default.md](notes/2026-08-27-dev-spa-default.md) — Impl 184 local pnpm dev back to Vite SPA
- [notes/2026-08-19-catalog-premium-left.md](notes/2026-08-19-catalog-premium-left.md) — Impl 152
- [notes/2026-08-19-daily.md](notes/2026-08-19-daily.md) — Impl 150
- [notes/2026-08-19-auth-split-curtain.md](notes/2026-08-19-auth-split-curtain.md) — Impl 149
- [notes/2026-08-19-hub-comments.md](notes/2026-08-19-hub-comments.md) — Impl 144
- [notes/2026-08-19-search-demo-trending.md](notes/2026-08-19-search-demo-trending.md) — Impl 145
- [notes/2026-08-19-categories-chart-chrome.md](notes/2026-08-19-categories-chart-chrome.md) — Impl 143
- [notes/2026-08-19-account-hub.md](notes/2026-08-19-account-hub.md) — Impl 142
- [notes/2026-08-19-categories-ranking-browse.md](notes/2026-08-19-categories-ranking-browse.md) — Impl 141
- [notes/2026-08-19-subscribe-age-gate.md](notes/2026-08-19-subscribe-age-gate.md) — Impl 140
- [notes/2026-08-19-nav-login-return.md](notes/2026-08-19-nav-login-return.md) — Impl 139
- [notes/2026-08-19-reader-gestures.md](notes/2026-08-19-reader-gestures.md) — Impl 138
- [notes/2026-08-19-hero-heading-cta.md](notes/2026-08-19-hero-heading-cta.md) — Impl 137
- [notes/2026-08-19-auth-reading-room.md](notes/2026-08-19-auth-reading-room.md) — Impl 136
- [notes/2026-08-19-author-profile.md](notes/2026-08-19-author-profile.md) — Impl 135
- [notes/2026-08-19-guest-start-here.md](notes/2026-08-19-guest-start-here.md) — Impl 134
- [notes/2026-08-19-reader-chrome.md](notes/2026-08-19-reader-chrome.md) — Impl 133
- [notes/2026-08-19-categories-polish.md](notes/2026-08-19-categories-polish.md) — Impl 132
- [notes/2026-08-19-search-destination.md](notes/2026-08-19-search-destination.md) — Impl 131
- [notes/2026-08-19-series-hub.md](notes/2026-08-19-series-hub.md) — Impl 130
- [notes/2026-08-19-updated-new-split.md](notes/2026-08-19-updated-new-split.md) — Impl 129
- [notes/2026-08-19-legal-toc-scrollbar.md](notes/2026-08-19-legal-toc-scrollbar.md) — Impl 128
- [notes/2026-08-19-popular-rank-glyph-lip.md](notes/2026-08-19-popular-rank-glyph-lip.md) — Impl 127
- [notes/2026-08-19-legal-layered-notice.md](notes/2026-08-19-legal-layered-notice.md) — Impl 126
- [notes/2026-08-19-popular-rank-glyph-kick.md](notes/2026-08-19-popular-rank-glyph-kick.md) — Impl 125 (superseded by 127)
- [notes/2026-08-19-popular-rank-glyph.md](notes/2026-08-19-popular-rank-glyph.md) — Impl 124
- [notes/2026-08-19-host-http-404.md](notes/2026-08-19-host-http-404.md) — Impl 123
- [notes/2026-08-19-popular-rank-pocket.md](notes/2026-08-19-popular-rank-pocket.md) — Impl 122 (superseded by 124)
- [notes/2026-08-19-404-recovery-polish.md](notes/2026-08-19-404-recovery-polish.md) — Impl 121
- [notes/2026-08-19-help-hub-footer-faq.md](notes/2026-08-19-help-hub-footer-faq.md) — Impl 120
- [notes/2026-08-19-popular-rank-on-cover.md](notes/2026-08-19-popular-rank-on-cover.md) — Impl 119
- [notes/2026-08-19-404-recovery.md](notes/2026-08-19-404-recovery.md) — Impl 118
- [notes/2026-08-19-popular-rank-overlap.md](notes/2026-08-19-popular-rank-overlap.md) — Impl 117
- [notes/2026-08-19-creators-pitch-align.md](notes/2026-08-19-creators-pitch-align.md) — Impl 116
- [notes/2026-08-19-series-rating-hit-target.md](notes/2026-08-19-series-rating-hit-target.md) — Impl 115
- [notes/2026-08-19-series-ratings.md](notes/2026-08-19-series-ratings.md) — Impl 114
- [notes/2026-08-19-support-hours-faq-fill.md](notes/2026-08-19-support-hours-faq-fill.md) — Impl 113
- [notes/2026-08-19-contact-pitch-fields.md](notes/2026-08-19-contact-pitch-fields.md) — Impl 112
- [notes/2026-08-19-support-pages-perfect.md](notes/2026-08-19-support-pages-perfect.md) — Impl 111
- [notes/2026-08-18-creators-intake-polish.md](notes/2026-08-18-creators-intake-polish.md) — Impl 110
- [notes/2026-08-18-categories-sort-labels.md](notes/2026-08-18-categories-sort-labels.md) — Impl 109
- [notes/2026-08-18-support-funnel.md](notes/2026-08-18-support-funnel.md) — Impl 108
- [notes/2026-08-18-creators-intake.md](notes/2026-08-18-creators-intake.md) — Impl 107
- [notes/2026-08-18-ranking-chart.md](notes/2026-08-18-ranking-chart.md) — Impl 106
- [notes/2026-08-18-prelaunch-quality-bar.md](notes/2026-08-18-prelaunch-quality-bar.md) — Impl 105
- [notes/2026-08-18-home-discovery-jobs.md](notes/2026-08-18-home-discovery-jobs.md) — Impl 104
- [notes/2026-08-18-about-who-we-are.md](notes/2026-08-18-about-who-we-are.md) — Impl 103
- [notes/2026-08-18-press-kit-favicon.md](notes/2026-08-18-press-kit-favicon.md) — Impl 102
- [notes/2026-08-18-skip-link-header-align.md](notes/2026-08-18-skip-link-header-align.md) — Impl 101
- [notes/2026-08-18-skip-link-hero-pause.md](notes/2026-08-18-skip-link-hero-pause.md) — Impl 100
- [notes/2026-08-18-hero-hover-come-forward-prod.md](notes/2026-08-18-hero-hover-come-forward-prod.md) — Impl 99
- [notes/2026-08-17-stale-catalog-localstorage.md](notes/2026-08-17-stale-catalog-localstorage.md) — Impl 98
- [notes/2026-08-17-mock-calendar-2026.md](notes/2026-08-17-mock-calendar-2026.md) — Impl 97
- [notes/2026-08-17-catalog-tile-honesty.md](notes/2026-08-17-catalog-tile-honesty.md) — Impl 96
- [notes/2026-08-17-about-story-reader-white-pane.md](notes/2026-08-17-about-story-reader-white-pane.md) — Impl 95
- [notes/2026-08-17-about-story-episode-reader.md](notes/2026-08-17-about-story-episode-reader.md) — Impl 94
- [notes/2026-08-17-about-story-page-turn.md](notes/2026-08-17-about-story-page-turn.md) — Impl 93
- [notes/2026-08-17-herobook-hover-come-forward.md](notes/2026-08-17-herobook-hover-come-forward.md) — Impl 92
- [notes/2026-08-17-about-story-shell-fix.md](notes/2026-08-17-about-story-shell-fix.md) — Impl 91
- [notes/2026-08-17-hero-book-hover-forced.md](notes/2026-08-17-hero-book-hover-forced.md) — Impl 90
- [notes/2026-08-17-about-story-open-shell.md](notes/2026-08-17-about-story-open-shell.md) — Impl 89
- [notes/2026-08-17-herobook-hover-straighten-lift.md](notes/2026-08-17-herobook-hover-straighten-lift.md) — Impl 88
- [notes/2026-08-17-about-story-book.md](notes/2026-08-17-about-story-book.md) — Impl 87
- [notes/2026-08-17-hero-book-enter-from-copy.md](notes/2026-08-17-hero-book-enter-from-copy.md) — Impl 86
- [notes/2026-08-17-about-story-herobook3d.md](notes/2026-08-17-about-story-herobook3d.md) — Impl 85
- [notes/2026-08-17-hero-book-enter-forced.md](notes/2026-08-17-hero-book-enter-forced.md) — Impl 84
- [notes/2026-08-17-hero-book-enter.md](notes/2026-08-17-hero-book-enter.md) — Impl 83
- [notes/2026-08-17-hero-copy-line-rules.md](notes/2026-08-17-hero-copy-line-rules.md) — Impl 82
- [notes/2026-08-14-hero-row-mt12-book-mt4.md](notes/2026-08-14-hero-row-mt12-book-mt4.md) — Impl 81
- [notes/2026-08-14-hero-pair-mt-nudge.md](notes/2026-08-14-hero-pair-mt-nudge.md) — Impl 80
- [notes/2026-08-14-herobook3d-fore-edge-vertical.md](notes/2026-08-14-herobook3d-fore-edge-vertical.md) — Impl 79
- [notes/2026-08-14-herobook3d-home-size-thickness.md](notes/2026-08-14-herobook3d-home-size-thickness.md) — Impl 78
- [notes/2026-08-13-responsive-header-hardening.md](notes/2026-08-13-responsive-header-hardening.md) — Impl 77

> Older `notes/2026-07-*lobby*` / immersive entries are **legacy history** — they do not describe current SoftGate `src/`.

## How to add an entry

Say something like “remember this convention” / “wiki ထဲ save”. The wiki skill classifies and writes the right section with frontmatter.

After implementation work, agents also update wiki + `docs/sessions/` per rule `06-documentation-hygiene` and root [`AGENTS.md`](../AGENTS.md) (user need not ask).
