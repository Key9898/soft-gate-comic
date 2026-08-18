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

- [architecture/implementation-phases.md](architecture/implementation-phases.md) — SoftGate Comic Impl master (**next: 99**)
- [architecture/implementation-phases-legacy.md](architecture/implementation-phases-legacy.md) — legacy immersive archive
- [references/pm-tracker-airtable.md](references/pm-tracker-airtable.md) — Airtable PM tracker (legacy-era rows)
- [references/api-contract.md](references/api-contract.md) — frontend ↔ backend API contract
- [references/avatar-manifest.md](references/avatar-manifest.md) — (legacy/reference; not SoftGate portal runtime)

### Conventions (SoftGate portal)

- [conventions/brand-color-tokens.md](conventions/brand-color-tokens.md) — logo-aligned primary/accent
- [conventions/portal-light-and-i18n-defaults.md](conventions/portal-light-and-i18n-defaults.md) — light-only + default EN
- [conventions/portal-scroll-chrome.md](conventions/portal-scroll-chrome.md) — hide doc scrollbar + ScrollToTop (Impl 47)
- [conventions/hero-spotlight.md](conventions/hero-spotlight.md) — Home Trending-5 hero rotator (Impl 49)
- [conventions/forced-product-motion.md](conventions/forced-product-motion.md) — product animations we add are forced (Impl 90)
- [conventions/portal-seo.md](conventions/portal-seo.md) — per-route Helmet SEO + robots/sitemap
- [conventions/in-app-search.md](conventions/in-app-search.md) — search lib + autocomplete + SearchPage
- [conventions/border-radius.md](conventions/border-radius.md) — Soft-Expressive radius map (Impl 10) + book-media exception
- [conventions/book-cover-presentation.md](conventions/book-cover-presentation.md) — BookCard + HeroBook3D (Impl 16–18)
- [conventions/catalog-tiles.md](conventions/catalog-tiles.md) — discovery tile fields + New badge (Impl 96)
- [conventions/about-story-book.md](conventions/about-story-book.md) — About Our Story episode reader (Impl 87–95)
- [conventions/categories-browse.md](conventions/categories-browse.md) — genre match + status URL (Impl 11)
- [conventions/discovery-honesty.md](conventions/discovery-honesty.md) — author→search, related, LS version (Impl 13–15)
- [conventions/library-bookmarks.md](conventions/library-bookmarks.md) — Save → Library bookmarks store (Impl 25)
- [conventions/client-auth.md](conventions/client-auth.md) — local accounts + session (Impl 27)
- [conventions/client-wallet.md](conventions/client-wallet.md) — Demo top-up + unlock (Impl 28–29)
- [conventions/library-engagement.md](conventions/library-engagement.md) — history + likes (Impl 31–32)
- [conventions/continue-reading.md](conventions/continue-reading.md) — Home Continue + scroll resume (Impl 40–41)
- [conventions/client-comments-notifications.md](conventions/client-comments-notifications.md) — comments + notifs (Impl 34–35)
- [conventions/typography.md](conventions/typography.md) — Inter + Noto Sans Myanmar stack (Impl 12)
- [conventions/info-page-chrome.md](conventions/info-page-chrome.md) — breadcrumb + PageHeader tiers (Impl 17)
- [conventions/source-layering-and-imports.md](conventions/source-layering-and-imports.md) — layers + hybrid imports (Impl 19)
- [conventions/legal-pages.md](conventions/legal-pages.md) — legal document shell + storage honesty (Impl 59–60)
- [conventions/guest-access.md](conventions/guest-access.md) — guest policy matrix + conversion nudges (Impl 67)
- [conventions/loading-states.md](conventions/loading-states.md) — skeleton system + UI state stack (Impl 68)
- [conventions/responsive-chrome.md](conventions/responsive-chrome.md) — nav breakpoint ladder + width budget + overflow guard (Impl 77)

### Decisions

- [decisions/001-use-stripe.md](decisions/001-use-stripe.md)
- [decisions/002-soft-expressive-radius.md](decisions/002-soft-expressive-radius.md) — Soft-Expressive radius (Impl 10)
- [decisions/003-softgate-type-stack.md](decisions/003-softgate-type-stack.md) — type stack (Impl 12)
- [decisions/004-book-media-presentation.md](decisions/004-book-media-presentation.md) — book covers (Impl 16)
- [decisions/005-herobook3d-ux.md](decisions/005-herobook3d-ux.md) — HeroBook3D UX harden (Impl 18)

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
