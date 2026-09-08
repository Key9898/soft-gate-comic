---
title: SoftGate Comic — Implementation Phases
type: architecture
date: 2026-08-10
tags: [phases, softgate, comic, frontend]
---

# SoftGate Comic — Implementation Phases

Master Impl index for the **SoftGate Comic** webtoon reader portal (`apps/portal` as it ships today).

**Next Impl number to use: `194`.**

Legacy immersive / EDC-era phase log (not SoftGate Comic runtime): [implementation-phases-legacy.md](implementation-phases-legacy.md).

## Who reads this

| Audience  | Use                                                    |
| --------- | ------------------------------------------------------ |
| Teammates | What shipped, in what order, which notes               |
| QA        | What to verify per Impl                                |
| AI agents | Append the next Impl here; do not reuse legacy numbers |

## Status legend

- **Done** — implemented in SoftGate Comic codebase
- **Partial** — shipped with known follow-ups

## Quick index

| Impl | Date       | Title                                                        | Note                                                                                                                                                          |
| ---- | ---------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | 2026-07-13 | Project restructure & Tailwind v4 layout                     | [2026-07-13-project-restructure.md](../notes/2026-07-13-project-restructure.md)                                                                               |
| 2    | 2026-07-15 | SoftGate Comic rebrand & git/Vercel handover                 | [2026-07-15-softgate-rebrand-handover.md](../notes/2026-07-15-softgate-rebrand-handover.md)                                                                   |
| 3    | 2026-07-17 | Hero banner overlay readability                              | [2026-07-17-hero-banner-overlay-readability.md](../notes/2026-07-17-hero-banner-overlay-readability.md)                                                       |
| 4    | 2026-07-20 | Brand theme (tokens → accent → cleanup → QA)                 | [2026-07-20-brand-theme-color-palette.md](../notes/2026-07-20-brand-theme-color-palette.md)                                                                   |
| 5    | 2026-07-20 | Default EN + force light theme                               | [2026-07-20-default-en-force-light.md](../notes/2026-07-20-default-en-force-light.md)                                                                         |
| 6    | 2026-08-10 | Company scaffolding standards                                | [2026-08-10-company-structure-alignment.md](../notes/2026-08-10-company-structure-alignment.md)                                                               |
| 7    | 2026-08-10 | SoftGate Comic brand rename + SVG logo                       | [2026-08-10-softgate-brand-rename-svg-logo.md](../notes/2026-08-10-softgate-brand-rename-svg-logo.md)                                                         |
| 8    | 2026-08-10 | Portal SEO + in-app search                                   | [2026-08-10-seo-and-in-app-search.md](../notes/2026-08-10-seo-and-in-app-search.md)                                                                           |
| 9    | 2026-08-11 | Logo theme token polish                                      | [2026-08-11-logo-theme-token-polish.md](../notes/2026-08-11-logo-theme-token-polish.md)                                                                       |
| 10   | 2026-08-11 | Soft-Expressive border radius normalize                      | [2026-08-11-soft-expressive-radius.md](../notes/2026-08-11-soft-expressive-radius.md)                                                                         |
| 11   | 2026-08-11 | Categories Phase A (filter + genres + status)                | [2026-08-11-categories-phase-a.md](../notes/2026-08-11-categories-phase-a.md)                                                                                 |
| 12   | 2026-08-11 | Typography stack + bold-flicker stabilize                    | [2026-08-11-typography-stabilize.md](../notes/2026-08-11-typography-stabilize.md)                                                                             |
| 13   | 2026-08-11 | Discovery pipelines — UI truth                               | [2026-08-11-discovery-ui-truth.md](../notes/2026-08-11-discovery-ui-truth.md)                                                                                 |
| 14   | 2026-08-11 | Discovery pipelines — data integrity                         | [2026-08-11-discovery-data-integrity.md](../notes/2026-08-11-discovery-data-integrity.md)                                                                     |
| 15   | 2026-08-11 | Discovery pipelines — CTA honesty                            | [2026-08-11-discovery-cta-honesty.md](../notes/2026-08-11-discovery-cta-honesty.md)                                                                           |
| 16   | 2026-08-11 | Book covers — Hero 3D + Apple spine                          | [2026-08-11-book-cover-presentation.md](../notes/2026-08-11-book-cover-presentation.md)                                                                       |
| 17   | 2026-08-11 | Info page headers + breadcrumbs                              | [2026-08-11-info-page-headers.md](../notes/2026-08-11-info-page-headers.md)                                                                                   |
| 18   | 2026-08-11 | HeroBook3D UX harden                                         | [2026-08-11-herobook3d-ux-harden.md](../notes/2026-08-11-herobook3d-ux-harden.md)                                                                             |
| 19   | 2026-08-11 | Structure hygiene (layers, AuthContext)                      | [2026-08-11-structure-hygiene.md](../notes/2026-08-11-structure-hygiene.md)                                                                                   |
| 20   | 2026-08-11 | Profile feature components extract                           | [2026-08-11-profile-components-extract.md](../notes/2026-08-11-profile-components-extract.md)                                                                 |
| 21   | 2026-08-11 | Library feature components extract                           | [2026-08-11-library-components-extract.md](../notes/2026-08-11-library-components-extract.md)                                                                 |
| 22   | 2026-08-11 | Coins presentational extract                                 | [2026-08-11-coins-components-extract.md](../notes/2026-08-11-coins-components-extract.md)                                                                     |
| 23   | 2026-08-11 | Reader comments panel extract                                | [2026-08-11-reader-comments-extract.md](../notes/2026-08-11-reader-comments-extract.md)                                                                       |
| 24   | 2026-08-11 | Categories genre strip scroll affordance                     | [2026-08-11-categories-genre-scroll.md](../notes/2026-08-11-categories-genre-scroll.md)                                                                       |
| 25   | 2026-08-11 | Library bookmark wiring + Home Save CTA                      | [2026-08-11-library-bookmark-wiring.md](../notes/2026-08-11-library-bookmark-wiring.md)                                                                       |
| 26   | 2026-08-11 | Categories genre reserved chevron + status                   | [2026-08-11-categories-genre-rail-slot.md](../notes/2026-08-11-categories-genre-rail-slot.md)                                                                 |
| 27   | 2026-08-11 | Client auth honesty (Register/Profile/Logout)                | [2026-08-11-client-auth-honesty.md](../notes/2026-08-11-client-auth-honesty.md)                                                                               |
| 28   | 2026-08-11 | Wallet + Demo top-up                                         | [2026-08-11-client-wallet-demo-topup.md](../notes/2026-08-11-client-wallet-demo-topup.md)                                                                     |
| 29   | 2026-08-11 | Premium unlock debit + persist                               | [2026-08-11-premium-unlock-wallet.md](../notes/2026-08-11-premium-unlock-wallet.md)                                                                           |
| 30   | 2026-08-11 | Episode images + Reader render                               | [2026-08-11-episode-media-reader.md](../notes/2026-08-11-episode-media-reader.md)                                                                             |
| 31   | 2026-08-11 | Reading history + Detail read badges                         | [2026-08-11-reading-history-badges.md](../notes/2026-08-11-reading-history-badges.md)                                                                         |
| 32   | 2026-08-11 | Likes store ↔ Library Likes                                  | [2026-08-11-likes-store-library.md](../notes/2026-08-11-likes-store-library.md)                                                                               |
| 33   | 2026-08-11 | Profile Auth + derived stats                                 | [2026-08-11-profile-auth-derived-stats.md](../notes/2026-08-11-profile-auth-derived-stats.md)                                                                 |
| 34   | 2026-08-11 | Share + Comments client-wire                                 | [2026-08-11-share-comments-client-wire.md](../notes/2026-08-11-share-comments-client-wire.md)                                                                 |
| 35   | 2026-08-11 | Notifications store + nav honesty                            | [2026-08-11-notifications-honesty.md](../notes/2026-08-11-notifications-honesty.md)                                                                           |
| 36   | 2026-08-11 | Dead chrome + Reader polish + 404                            | [2026-08-11-dead-chrome-reader-polish.md](../notes/2026-08-11-dead-chrome-reader-polish.md)                                                                   |
| 37   | 2026-08-11 | Marketing / Home honesty                                     | [2026-08-11-marketing-home-honesty.md](../notes/2026-08-11-marketing-home-honesty.md)                                                                         |
| 38   | 2026-08-11 | Mock-honest roadmap close                                    | [2026-08-11-mock-honest-roadmap-close.md](../notes/2026-08-11-mock-honest-roadmap-close.md)                                                                   |
| 39   | 2026-08-11 | Home UI polish (calm hero + rhythm)                          | [2026-08-11-home-ui-polish.md](../notes/2026-08-11-home-ui-polish.md)                                                                                         |
| 40   | 2026-08-11 | Home Continue Reading episode rail                           | [2026-08-11-home-continue-episode-rail.md](../notes/2026-08-11-home-continue-episode-rail.md)                                                                 |
| 41   | 2026-08-11 | Reading scroll-depth resume                                  | [2026-08-11-reading-scroll-resume.md](../notes/2026-08-11-reading-scroll-resume.md)                                                                           |
| 42   | 2026-08-11 | HeroBook3D reliable 3D + reference tilt                      | [2026-08-11-herobook3d-tilt-fix.md](../notes/2026-08-11-herobook3d-tilt-fix.md)                                                                               |
| 43   | 2026-08-11 | Home Genres reserved chevron                                 | [2026-08-11-home-genres-chevron.md](../notes/2026-08-11-home-genres-chevron.md)                                                                               |
| 44   | 2026-08-11 | HeroBook3D open fix (flatten + reduced)                      | [2026-08-11-herobook3d-open-fix.md](../notes/2026-08-11-herobook3d-open-fix.md)                                                                               |
| 45   | 2026-08-11 | HeroBook3D real hinge + size + reduced fade                  | [2026-08-11-herobook3d-hinge-size.md](../notes/2026-08-11-herobook3d-hinge-size.md)                                                                           |
| 46   | 2026-08-11 | static HeroBook + hero mid-align                             | [2026-08-11-herobook3d-static-mid-align.md](../notes/2026-08-11-herobook3d-static-mid-align.md)                                                               |
| 47   | 2026-08-11 | Hide page scrollbar + ScrollToTop                            | [2026-08-11-scroll-chrome-scroll-to-top.md](../notes/2026-08-11-scroll-chrome-scroll-to-top.md)                                                               |
| 48   | 2026-08-11 | Home hero optical vertical center                            | [2026-08-11-hero-optical-vertical-center.md](../notes/2026-08-11-hero-optical-vertical-center.md)                                                             |
| 49   | 2026-08-11 | Hero Spotlight carousel (Trending 5)                         | [2026-08-11-hero-spotlight-carousel.md](../notes/2026-08-11-hero-spotlight-carousel.md)                                                                       |
| 50   | 2026-08-11 | About i18n missing keys fix                                  | [2026-08-11-about-i18n-missing-keys.md](../notes/2026-08-11-about-i18n-missing-keys.md)                                                                       |
| 51   | 2026-08-11 | HeroBook3D fore-edge pose tune                               | [2026-08-11-herobook3d-fore-edge-pose.md](../notes/2026-08-11-herobook3d-fore-edge-pose.md)                                                                   |
| 52   | 2026-08-11 | HeroBook3D unflatten + thick fore-edge                       | [2026-08-11-herobook3d-unflatten-fore-edge.md](../notes/2026-08-11-herobook3d-unflatten-fore-edge.md)                                                         |
| 53   | 2026-08-11 | About Our Story split + book visual                          | [2026-08-11-about-story-split-narrative.md](../notes/2026-08-11-about-story-split-narrative.md)                                                               |
| 54   | 2026-08-11 | HeroBook3D static pose always-on                             | [2026-08-11-herobook3d-static-pose-always-on.md](../notes/2026-08-11-herobook3d-static-pose-always-on.md)                                                     |
| 55   | 2026-08-13 | About Mission & Vision + UI/UX polish                        | [2026-08-13-about-mission-vision-polish.md](../notes/2026-08-13-about-mission-vision-polish.md)                                                               |
| 56   | 2026-08-13 | Careers → Creators (Publish with Us) pivot                   | [2026-08-13-creators-page-pivot.md](../notes/2026-08-13-creators-page-pivot.md)                                                                               |
| 57   | 2026-08-13 | Press kit page + chrome alignment                            | [2026-08-13-press-kit-chrome-align.md](../notes/2026-08-13-press-kit-chrome-align.md)                                                                         |
| 58   | 2026-08-13 | Support & recovery pages (FAQ/Help/404/Contact)              | [2026-08-13-support-pages-revamp.md](../notes/2026-08-13-support-pages-revamp.md)                                                                             |
| 59   | 2026-08-13 | Legal shared shell + chrome fixes                            | [2026-08-13-legal-shell-extract.md](../notes/2026-08-13-legal-shell-extract.md)                                                                               |
| 60   | 2026-08-13 | Legal content honesty (webtoon-standard)                     | [2026-08-13-legal-content-honesty.md](../notes/2026-08-13-legal-content-honesty.md)                                                                           |
| 61   | 2026-08-13 | App pages shell alignment (Profile/Notif/Coins)              | [2026-08-13-app-shell-alignment.md](../notes/2026-08-13-app-shell-alignment.md)                                                                               |
| 62   | 2026-08-13 | Broken flows fix (i18n/Comments/Auth chrome)                 | [2026-08-13-broken-flows-fix.md](../notes/2026-08-13-broken-flows-fix.md)                                                                                     |
| 63   | 2026-08-13 | Data correctness (read set/unlock/likes)                     | [2026-08-13-read-tracking-unlock-likes.md](../notes/2026-08-13-read-tracking-unlock-likes.md)                                                                 |
| 64   | 2026-08-13 | Polish sweep (tokens/a11y/honesty/dead code)                 | [2026-08-13-polish-sweep.md](../notes/2026-08-13-polish-sweep.md)                                                                                             |
| 65   | 2026-08-13 | Cross-tab sync (storage events)                              | [2026-08-13-cross-tab-sync.md](../notes/2026-08-13-cross-tab-sync.md)                                                                                         |
| 66   | 2026-08-13 | Account data migration + delete cascade                      | [2026-08-13-account-data-migration.md](../notes/2026-08-13-account-data-migration.md)                                                                         |
| 67   | 2026-08-13 | Reader guest conversion nudges                               | [2026-08-13-reader-guest-nudges.md](../notes/2026-08-13-reader-guest-nudges.md)                                                                               |
| 68   | 2026-08-13 | Skeleton loading states + Home empty state                   | [2026-08-13-skeleton-loading-states.md](../notes/2026-08-13-skeleton-loading-states.md)                                                                       |
| 69   | 2026-08-13 | Reader celebration truth (title/time/i18n)                   | [2026-08-13-reader-celebration-truth.md](../notes/2026-08-13-reader-celebration-truth.md)                                                                     |
| 70   | 2026-08-13 | Dialog a11y system (APG + lock + trap)                       | [2026-08-13-dialog-a11y-system.md](../notes/2026-08-13-dialog-a11y-system.md)                                                                                 |
| 71   | 2026-08-13 | Coins checkout honesty + i18n copy                           | [2026-08-13-coins-honesty-i18n.md](../notes/2026-08-13-coins-honesty-i18n.md)                                                                                 |
| 72   | 2026-08-13 | Coins wizard shell (scroll/dialog/dark strip)                | [2026-08-13-coins-wizard-shell.md](../notes/2026-08-13-coins-wizard-shell.md)                                                                                 |
| 73   | 2026-08-13 | Chrome polish (safe-area/targets/nav/CTA)                    | [2026-08-13-chrome-polish-safe-area.md](../notes/2026-08-13-chrome-polish-safe-area.md)                                                                       |
| 74   | 2026-08-13 | Mechanical theme sweep (dark/2xs/sepia/wash)                 | [2026-08-13-theme-mechanical-sweep.md](../notes/2026-08-13-theme-mechanical-sweep.md)                                                                         |
| 75   | 2026-08-13 | i18n sweep (dates/chart honesty/strings)                     | [2026-08-13-i18n-sweep.md](../notes/2026-08-13-i18n-sweep.md)                                                                                                 |
| 76   | 2026-08-13 | A11y structural (h1/keyboard/live/labels)                    | [2026-08-13-a11y-structural.md](../notes/2026-08-13-a11y-structural.md)                                                                                       |
| 77   | 2026-08-13 | Responsive header + overflow hardening                       | [2026-08-13-responsive-header-hardening.md](../notes/2026-08-13-responsive-header-hardening.md)                                                               |
| 78   | 2026-08-14 | HeroBook3D Home size + thickness + top poke                  | [2026-08-14-herobook3d-home-size-thickness.md](../notes/2026-08-14-herobook3d-home-size-thickness.md)                                                         |
| 79   | 2026-08-14 | HeroBook3D fore-edge vertical page lines                     | [2026-08-14-herobook3d-fore-edge-vertical.md](../notes/2026-08-14-herobook3d-fore-edge-vertical.md)                                                           |
| 80   | 2026-08-14 | Home hero pair lg:mt-10 nudge                                | [2026-08-14-hero-pair-mt-nudge.md](../notes/2026-08-14-hero-pair-mt-nudge.md)                                                                                 |
| 81   | 2026-08-14 | Home hero row mt-12 + book mt-4                              | [2026-08-14-hero-row-mt12-book-mt4.md](../notes/2026-08-14-hero-row-mt12-book-mt4.md)                                                                         |
| 82   | 2026-08-17 | Hero title/deck line rules + overflow                        | [2026-08-17-hero-copy-line-rules.md](../notes/2026-08-17-hero-copy-line-rules.md)                                                                             |
| 83   | 2026-08-17 | Home hero book enter from under copy                         | [2026-08-17-hero-book-enter.md](../notes/2026-08-17-hero-book-enter.md)                                                                                       |
| 84   | 2026-08-17 | Force Home book enter for all visitors                       | [2026-08-17-hero-book-enter-forced.md](../notes/2026-08-17-hero-book-enter-forced.md)                                                                         |
| 85   | 2026-08-17 | About Our Story uses Home HeroBook3D                         | [2026-08-17-about-story-herobook3d.md](../notes/2026-08-17-about-story-herobook3d.md)                                                                         |
| 86   | 2026-08-17 | Hero book enter from under copy                              | [2026-08-17-hero-book-enter-from-copy.md](../notes/2026-08-17-hero-book-enter-from-copy.md)                                                                   |
| 87   | 2026-08-17 | Our Story readable book                                      | [2026-08-17-about-story-book.md](../notes/2026-08-17-about-story-book.md)                                                                                     |
| 88   | 2026-08-17 | Hero book hover straighten then lift                         | [2026-08-17-herobook-hover-straighten-lift.md](../notes/2026-08-17-herobook-hover-straighten-lift.md)                                                         |
| 89   | 2026-08-17 | Our Story open-book shell                                    | [2026-08-17-about-story-open-shell.md](../notes/2026-08-17-about-story-open-shell.md)                                                                         |
| 90   | 2026-08-17 | Force hero book hover for all visitors                       | [2026-08-17-hero-book-hover-forced.md](../notes/2026-08-17-hero-book-hover-forced.md)                                                                         |
| 91   | 2026-08-17 | Our Story shell + cover + on-page turns                      | [2026-08-17-about-story-shell-fix.md](../notes/2026-08-17-about-story-shell-fix.md)                                                                           |
| 92   | 2026-08-17 | Hero book hover come-forward not lift                        | [2026-08-17-herobook-hover-come-forward.md](../notes/2026-08-17-herobook-hover-come-forward.md)                                                               |
| 93   | 2026-08-17 | Our Story 3D valley + page turn                              | [2026-08-17-about-story-page-turn.md](../notes/2026-08-17-about-story-page-turn.md)                                                                           |
| 94   | 2026-08-17 | Our Story episode reader                                     | [2026-08-17-about-story-episode-reader.md](../notes/2026-08-17-about-story-episode-reader.md)                                                                 |
| 95   | 2026-08-17 | Our Story reader pane is white                               | [2026-08-17-about-story-reader-white-pane.md](../notes/2026-08-17-about-story-reader-white-pane.md)                                                           |
| 96   | 2026-08-17 | Catalog tile honesty                                         | [2026-08-17-catalog-tile-honesty.md](../notes/2026-08-17-catalog-tile-honesty.md)                                                                             |
| 97   | 2026-08-17 | Mock calendar stays in 2026                                  | [2026-08-17-mock-calendar-2026.md](../notes/2026-08-17-mock-calendar-2026.md)                                                                                 |
| 98   | 2026-08-17 | Stale catalog localStorage froze 2023 dates                  | [2026-08-17-stale-catalog-localstorage.md](../notes/2026-08-17-stale-catalog-localstorage.md)                                                                 |
| 99   | 2026-08-18 | Hero hover come-forward survives production                  | [2026-08-18-hero-hover-come-forward-prod.md](../notes/2026-08-18-hero-hover-come-forward-prod.md)                                                             |
| 100  | 2026-08-18 | Skip link + sticky Hero Pause                                | [2026-08-18-skip-link-hero-pause.md](../notes/2026-08-18-skip-link-hero-pause.md)                                                                             |
| 101  | 2026-08-18 | Skip link vertically centers in the nav bar                  | [2026-08-18-skip-link-header-align.md](../notes/2026-08-18-skip-link-header-align.md)                                                                         |
| 102  | 2026-08-18 | Favicon, OG PNG, Press kit IA                                | [2026-08-18-press-kit-favicon.md](../notes/2026-08-18-press-kit-favicon.md)                                                                                   |
| 103  | 2026-08-18 | About Who we are (facts / product / team)                    | [2026-08-18-about-who-we-are.md](../notes/2026-08-18-about-who-we-are.md)                                                                                     |
| 104  | 2026-08-18 | Home discovery jobs (spotlight, ranking, trend)              | [2026-08-18-home-discovery-jobs.md](../notes/2026-08-18-home-discovery-jobs.md)                                                                               |
| 105  | 2026-08-18 | Prelaunch quality bar (always-on agent rule)                 | [2026-08-18-prelaunch-quality-bar.md](../notes/2026-08-18-prelaunch-quality-bar.md)                                                                           |
| 106  | 2026-08-18 | Ranking chart + honest Popular destination                   | [2026-08-18-ranking-chart.md](../notes/2026-08-18-ranking-chart.md)                                                                                           |
| 107  | 2026-08-18 | Publish with Us complete creator intake                      | [2026-08-18-creators-intake.md](../notes/2026-08-18-creators-intake.md)                                                                                       |
| 108  | 2026-08-18 | Help / FAQ / Contact support funnel                          | [2026-08-18-support-funnel.md](../notes/2026-08-18-support-funnel.md)                                                                                         |
| 109  | 2026-08-18 | Categories sort labels match Home                            | [2026-08-18-categories-sort-labels.md](../notes/2026-08-18-categories-sort-labels.md)                                                                         |
| 110  | 2026-08-18 | Publish with Us intake polish                                | [2026-08-18-creators-intake-polish.md](../notes/2026-08-18-creators-intake-polish.md)                                                                         |
| 111  | 2026-08-19 | Help, FAQ, Contact support pages perfect                     | [2026-08-19-support-pages-perfect.md](../notes/2026-08-19-support-pages-perfect.md)                                                                           |
| 112  | 2026-08-19 | Contact pitch fields for Publish with Us                     | [2026-08-19-contact-pitch-fields.md](../notes/2026-08-19-contact-pitch-fields.md)                                                                             |
| 113  | 2026-08-19 | Contact Demo inbox hours + FAQ a6 a10 a11                    | [2026-08-19-support-hours-faq-fill.md](../notes/2026-08-19-support-hours-faq-fill.md)                                                                         |
| 114  | 2026-08-19 | Series ratings on catalog + Highest Rated                    | [2026-08-19-series-ratings.md](../notes/2026-08-19-series-ratings.md)                                                                                         |
| 115  | 2026-08-19 | Series rating star hit cells 44 by 24                        | [2026-08-19-series-rating-hit-target.md](../notes/2026-08-19-series-rating-hit-target.md)                                                                     |
| 116  | 2026-08-19 | Pitch funnel four-point align                                | [2026-08-19-creators-pitch-align.md](../notes/2026-08-19-creators-pitch-align.md)                                                                             |
| 117  | 2026-08-19 | Popular rank hang-overlap                                    | [2026-08-19-popular-rank-overlap.md](../notes/2026-08-19-popular-rank-overlap.md)                                                                             |
| 118  | 2026-08-19 | 404 recovery to hand-off bar                                 | [2026-08-19-404-recovery.md](../notes/2026-08-19-404-recovery.md)                                                                                             |
| 119  | 2026-08-19 | Popular ranks inside the cover                               | [2026-08-19-popular-rank-on-cover.md](../notes/2026-08-19-popular-rank-on-cover.md)                                                                           |
| 120  | 2026-08-19 | Help hub layout + Footer FAQ                                 | [2026-08-19-help-hub-footer-faq.md](../notes/2026-08-19-help-hub-footer-faq.md)                                                                               |
| 121  | 2026-08-19 | 404 recovery page polish                                     | [2026-08-19-404-recovery-polish.md](../notes/2026-08-19-404-recovery-polish.md)                                                                               |
| 122  | 2026-08-19 | Popular rank bottom-left cover pocket                        | [2026-08-19-popular-rank-pocket.md](../notes/2026-08-19-popular-rank-pocket.md)                                                                               |
| 123  | 2026-08-19 | Host HTTP 404 for unknown SPA paths                          | [2026-08-19-host-http-404.md](../notes/2026-08-19-host-http-404.md)                                                                                           |
| 124  | 2026-08-19 | Popular rank white glyph on the cover                        | [2026-08-19-popular-rank-glyph.md](../notes/2026-08-19-popular-rank-glyph.md)                                                                                 |
| 125  | 2026-08-19 | Popular rank white offset kick                               | [2026-08-19-popular-rank-glyph-kick.md](../notes/2026-08-19-popular-rank-glyph-kick.md)                                                                       |
| 126  | 2026-08-19 | Legal pages layered notice + honesty                         | [2026-08-19-legal-layered-notice.md](../notes/2026-08-19-legal-layered-notice.md)                                                                             |
| 127  | 2026-08-19 | Popular rank white lip follows digit geometry                | [2026-08-19-popular-rank-glyph-lip.md](../notes/2026-08-19-popular-rank-glyph-lip.md)                                                                         |
| 128  | 2026-08-19 | Legal TOC thin primary scrollbar                             | [2026-08-19-legal-toc-scrollbar.md](../notes/2026-08-19-legal-toc-scrollbar.md)                                                                               |
| 129  | 2026-08-19 | Home Updated vs New split                                    | [2026-08-19-updated-new-split.md](../notes/2026-08-19-updated-new-split.md)                                                                                   |
| 130  | 2026-08-19 | Series hub Continue, tags, thumbs, related                   | [2026-08-19-series-hub.md](../notes/2026-08-19-series-hub.md)                                                                                                 |
| 131  | 2026-08-19 | Search destination empty landing                             | [2026-08-19-search-destination.md](../notes/2026-08-19-search-destination.md)                                                                                 |
| 132  | 2026-08-19 | Categories polish search SEO empty recovery                  | [2026-08-19-categories-polish.md](../notes/2026-08-19-categories-polish.md)                                                                                   |
| 133  | 2026-08-19 | Reader chrome episode sheet prefs keyboard                   | [2026-08-19-reader-chrome.md](../notes/2026-08-19-reader-chrome.md)                                                                                           |
| 134  | 2026-08-19 | Guest Start here rail                                        | [2026-08-19-guest-start-here.md](../notes/2026-08-19-guest-start-here.md)                                                                                     |
| 135  | 2026-08-19 | Author profile `/author/:id`                                 | [2026-08-19-author-profile.md](../notes/2026-08-19-author-profile.md)                                                                                         |
| 136  | 2026-08-19 | Auth reading room                                            | [2026-08-19-auth-reading-room.md](../notes/2026-08-19-auth-reading-room.md)                                                                                   |
| 137  | 2026-08-19 | Hero heading and duplicate CTA                               | [2026-08-19-hero-heading-cta.md](../notes/2026-08-19-hero-heading-cta.md)                                                                                     |
| 138  | 2026-08-19 | Reader swipe + pinch                                         | [2026-08-19-reader-gestures.md](../notes/2026-08-19-reader-gestures.md)                                                                                       |
| 139  | 2026-08-19 | Nav Login carries return `from`                              | [2026-08-19-nav-login-return.md](../notes/2026-08-19-nav-login-return.md)                                                                                     |
| 140  | 2026-08-19 | Subscribe + 18+ content rating                               | [2026-08-19-subscribe-age-gate.md](../notes/2026-08-19-subscribe-age-gate.md)                                                                                 |
| 141  | 2026-08-19 | Categories browse + `/ranking` path                          | [2026-08-19-categories-ranking-browse.md](../notes/2026-08-19-categories-ranking-browse.md)                                                                   |
| 142  | 2026-08-19 | Account hub to hand-off bar                                  | [2026-08-19-account-hub.md](../notes/2026-08-19-account-hub.md)                                                                                               |
| 143  | 2026-08-19 | Categories chart chrome (no podium)                          | [2026-08-19-categories-chart-chrome.md](../notes/2026-08-19-categories-chart-chrome.md)                                                                       |
| 144  | 2026-08-19 | Hub series comments                                          | [2026-08-19-hub-comments.md](../notes/2026-08-19-hub-comments.md)                                                                                             |
| 145  | 2026-08-19 | Search Demo searches chips                                   | [2026-08-19-search-demo-trending.md](../notes/2026-08-19-search-demo-trending.md)                                                                             |
| 146  | 2026-08-19 | Auth portal split-card                                       | [2026-08-19-auth-split-card.md](../notes/2026-08-19-auth-split-card.md)                                                                                       |
| 147  | 2026-08-19 | Home For You rail                                            | [2026-08-19-for-you.md](../notes/2026-08-19-for-you.md)                                                                                                       |
| 148  | 2026-08-19 | Author Follow on catalog profiles                            | [2026-08-19-author-follow.md](../notes/2026-08-19-author-follow.md)                                                                                           |
| 149  | 2026-08-19 | Auth split-card photo curtain                                | [2026-08-19-auth-split-curtain.md](../notes/2026-08-19-auth-split-curtain.md)                                                                                 |
| 150  | 2026-08-19 | Home Daily weekday board                                     | [2026-08-19-daily.md](../notes/2026-08-19-daily.md)                                                                                                           |
| 151  | 2026-08-19 | Wait-for-free on premium episodes                            | [2026-08-19-wait-for-free.md](../notes/2026-08-19-wait-for-free.md)                                                                                           |
| 152  | 2026-08-19 | Catalog Premium chip to top-left                             | [2026-08-19-catalog-premium-left.md](../notes/2026-08-19-catalog-premium-left.md)                                                                             |
| 153  | 2026-08-19 | Home Daily upcoming episode drops                            | [2026-08-19-daily-drops.md](../notes/2026-08-19-daily-drops.md)                                                                                               |
| 154  | 2026-08-19 | Daily / Updated / New Demo honesty                           | [2026-08-19-discovery-time-family.md](../notes/2026-08-19-discovery-time-family.md)                                                                           |
| 155  | 2026-08-21 | Skeleton layout (155a) + contract (155b; sheen reverted 156) | [2026-08-21-skeleton-production-contract.md](../notes/2026-08-21-skeleton-production-contract.md); [layout](../notes/2026-08-21-page-skeletons-match-live.md) |
| 156  | 2026-08-21 | Restore skeleton pulse, remove sheen                         | [2026-08-21-skeleton-pulse-restore.md](../notes/2026-08-21-skeleton-pulse-restore.md)                                                                         |
| 157  | 2026-08-21 | Lock skeleton docs to pulse + current contract               | [2026-08-21-skeleton-docs-truth.md](../notes/2026-08-21-skeleton-docs-truth.md)                                                                               |
| 158  | 2026-08-21 | Lock Daily skeleton cap                                      | [2026-08-21-daily-skeleton-cap.md](../notes/2026-08-21-daily-skeleton-cap.md)                                                                                 |
| 159  | 2026-08-21 | Match Home hero skeleton chrome                              | [2026-08-21-hero-skeleton-chrome.md](../notes/2026-08-21-hero-skeleton-chrome.md)                                                                             |
| 160  | 2026-08-21 | Home skeleton Continue / For You by session                  | [2026-08-21-home-skeleton-auth-rails.md](../notes/2026-08-21-home-skeleton-auth-rails.md)                                                                     |
| 161  | 2026-08-21 | Unhook account pages from catalog loading                    | [2026-08-21-account-skeleton-triggers.md](../notes/2026-08-21-account-skeleton-triggers.md)                                                                   |
| 162  | 2026-08-22 | Search landing live chrome + Reader chrome                   | [2026-08-22-search-reader-skeleton-chrome.md](../notes/2026-08-22-search-reader-skeleton-chrome.md)                                                           |
| 163  | 2026-08-22 | Search query live chrome                                     | [2026-08-22-search-query-skeleton-chrome.md](../notes/2026-08-22-search-query-skeleton-chrome.md)                                                             |
| 164  | 2026-08-22 | Categories skeleton live chrome                              | [2026-08-22-categories-skeleton-chrome.md](../notes/2026-08-22-categories-skeleton-chrome.md)                                                                 |
| 165  | 2026-08-23 | Reader first-panel fetchpriority + async decode              | [2026-08-23-reader-panel-priority.md](../notes/2026-08-23-reader-panel-priority.md)                                                                           |
| 166  | 2026-08-23 | Reader imageSizes consume + Admin wiki item 21               | [2026-08-23-reader-panel-sizes.md](../notes/2026-08-23-reader-panel-sizes.md)                                                                                 |
| 167  | 2026-08-23 | Trust stored catalog (stop seed wipe)                        | [2026-08-23-trust-stored-catalog.md](../notes/2026-08-23-trust-stored-catalog.md)                                                                             |
| 168  | 2026-08-23 | Consume Admin coinPackages on /coins                         | [2026-08-23-portal-coin-packages.md](../notes/2026-08-23-portal-coin-packages.md)                                                                             |
| 169  | 2026-08-23 | Reserved genre-rail chevron slot                             | [2026-08-23-genre-rail-chevron-slot.md](../notes/2026-08-23-genre-rail-chevron-slot.md)                                                                       |
| 170  | 2026-08-24 | Portal pnpm + Turbo monorepo plumbing                        | [2026-08-24-monorepo-workspace.md](../notes/2026-08-24-monorepo-workspace.md)                                                                                 |
| 171  | 2026-08-24 | API skeleton (`apps/api`)                                    | [2026-08-24-api-skeleton.md](../notes/2026-08-24-api-skeleton.md)                                                                                             |
| 172  | 2026-08-24 | Portal catalog HTTP read (`GET /api/catalog`)                | [2026-08-24-catalog-http-read.md](../notes/2026-08-24-catalog-http-read.md)                                                                                   |
| 173  | 2026-08-24 | Portal settings HTTP read (`GET /api/settings`)              | [2026-08-24-settings-http-read.md](../notes/2026-08-24-settings-http-read.md)                                                                                 |
| 174  | 2026-08-24 | Reader auth httpOnly cookie                                  | [2026-08-24-reader-auth-cookie.md](../notes/2026-08-24-reader-auth-cookie.md)                                                                                 |
| 175  | 2026-08-24 | Wallet authority + paywall strip                             | [2026-08-24-wallet-paywall-strip.md](../notes/2026-08-24-wallet-paywall-strip.md)                                                                             |
| 176  | 2026-08-25 | Named integration slots (schema + honesty)                   | [2026-08-25-named-integration-slots.md](../notes/2026-08-25-named-integration-slots.md)                                                                       |
| 177  | 2026-08-25 | Love in Seoul MM title + schema 14                           | [2026-08-25-love-in-seoul-mm-title.md](../notes/2026-08-25-love-in-seoul-mm-title.md)                                                                         |
| 178  | 2026-08-25 | Vite SSR/hybrid infrastructure (public routes)               | [2026-08-25-perfect-seo-ssr-hybrid.md](../notes/2026-08-25-perfect-seo-ssr-hybrid.md)                                                                         |
| 179  | 2026-08-25 | Server meta + ComicSeries JSON-LD + dynamic sitemap          | [2026-08-25-perfect-seo-ssr-hybrid.md](../notes/2026-08-25-perfect-seo-ssr-hybrid.md)                                                                         |
| 180  | 2026-08-25 | /mm locale URLs + hreflang en/my/x-default                   | [2026-08-25-perfect-seo-ssr-hybrid.md](../notes/2026-08-25-perfect-seo-ssr-hybrid.md)                                                                         |
| 181  | 2026-08-25 | Series OG image generation (1200x630)                        | [2026-08-25-perfect-seo-ssr-hybrid.md](../notes/2026-08-25-perfect-seo-ssr-hybrid.md)                                                                         |
| 182  | 2026-08-26 | HeroBook3D cover after SSR onLoad miss                       | [2026-08-26-hero-cover-ssr-onload.md](../notes/2026-08-26-hero-cover-ssr-onload.md)                                                                           |
| 183  | 2026-08-26 | Catalog cover after SSR onLoad miss                          | [2026-08-26-catalog-cover-ssr-onload.md](../notes/2026-08-26-catalog-cover-ssr-onload.md)                                                                     |
| 184  | 2026-08-27 | Local pnpm dev back to Vite SPA                              | [2026-08-27-dev-spa-default.md](../notes/2026-08-27-dev-spa-default.md)                                                                                       |
| 185  | 2026-09-08 | Prisma persist for reader auth and wallet                    | [2026-09-08-prisma-persist.md](../notes/2026-09-08-prisma-persist.md)                                                                                         |
| 186  | 2026-09-08 | R2 helper with portal/ prefix                                | [2026-09-08-r2-object-store.md](../notes/2026-09-08-r2-object-store.md)                                                                                       |
| 187  | 2026-09-08 | Brevo HTML forgot/reset + token API                          | [2026-09-08-brevo-forgot-reset.md](../notes/2026-09-08-brevo-forgot-reset.md)                                                                                 |
| 188  | 2026-09-08 | Local portal HTTP + profile writers                          | [2026-09-08-portal-http-local.md](../notes/2026-09-08-portal-http-local.md)                                                                                   |
| 189  | 2026-09-08 | Cap profile avatars at 512 KB jpeg/png/webp                  | [2026-09-08-avatar-byte-cap.md](../notes/2026-09-08-avatar-byte-cap.md)                                                                                       |
| 190  | 2026-09-08 | Library Subscribe/History/Likes HTTP persist                 | [2026-09-08-library-http-persist.md](../notes/2026-09-08-library-http-persist.md)                                                                             |
| 191  | 2026-09-08 | Notifications inbox HTTP persist                             | [2026-09-08-notifications-http-persist.md](../notes/2026-09-08-notifications-http-persist.md)                                                                 |
| 192  | 2026-09-08 | Notif toggles + reader prefs HTTP persist                    | [2026-09-08-prefs-http-persist.md](../notes/2026-09-08-prefs-http-persist.md)                                                                                 |
| 193  | 2026-09-08 | Leader dev env mapping (no runtime change)                   | [2026-09-08-leader-dev-env-mapping.md](../notes/2026-09-08-leader-dev-env-mapping.md)                                                                         |

---

## Impl Phase 1 — Project restructure & Tailwind v4 (2026-07-13)

**Status:** Done

Company frontend scaffolding alignment for SoftGate Comic: Tailwind v4 `@theme`, feature folders under `src/features/`, tests under `src/test/`, Cursor rules + wiki.

---

## Impl Phase 2 — SoftGate Comic rebrand & git/Vercel handover (2026-07-15)

**Status:** Done

Human-facing / platform branding migration and repo remotes/handover for SoftGate Comic (display name later tightened in Impl 7).

---

## Impl Phase 3 — Hero banner overlay readability (2026-07-17)

**Status:** Done

Homepage hero overlay lightened; nav logo sizing; redundant text label removed next to logo.

---

## Impl Phase 4 — Brand theme (2026-07-20)

**Status:** Done

Same-day sub-steps (not separate master Impls):

1. Token-only primary/accent calibration to logo hex
2. Selective accent on badges / notification dots / promo
3. Leftover indigo/purple → primary/accent
4. Visual QA + `npm run check`

---

## Impl Phase 5 — Default EN + force light theme (2026-07-20)

**Status:** Done

Default language English; portal light-only via `@custom-variant dark` (no OS auto-dark).

---

## Impl Phase 6 — Company scaffolding standards (2026-08-10)

**Status:** Done

`docs/` gitignore, `.gitattributes` LF, root `AGENTS.md`, `lint:fix` / `test:ui`, wiki folder-map/README refresh.

---

## Impl Phase 7 — SoftGate Comic brand rename + SVG logo (2026-08-10)

**Status:** Done

Display brand **SoftGate Comic** / **SoftGate Pay**; in-app `/logo/logo.svg` + `object-contain`; OG still JPG.

---

## Impl Phase 8 — Portal SEO + in-app search (2026-08-10)

**Status:** Done

Client SEO via `react-helmet-async` + `<SEO />`; hardened static `robots.txt` / `sitemap.xml`; mock search library; Nav autocomplete; SearchPage tabs/filters/recent searches.

Conventions: [portal-seo.md](../conventions/portal-seo.md), [in-app-search.md](../conventions/in-app-search.md).

---

## Impl Phase 9 — Logo theme token polish (2026-08-11)

**Status:** Done

Live SVG anchors (`#69c9ca` / `#ee3968` / `#ef4124`) + CTA `#0e9494`; new `spark-*`; Coins Best Value heat; brand convention Do/Don't.

---

## Impl Phase 10 — Soft-Expressive border radius normalize (2026-08-11)

**Status:** Done

Banned `rounded-full` and subtle `sm`/`md`/`lg`/`xl` on SoftGate controls. Controls + cards + search + CTAs → `rounded-2xl` (16px); modals / marketing shells → `rounded-3xl` (24px); circular geometry → `.shape-circle`.

Convention: [border-radius.md](../conventions/border-radius.md). ADR: [002-soft-expressive-radius.md](../decisions/002-soft-expressive-radius.md).

---

## Impl Phase 11 — Categories Phase A (2026-08-11)

**Status:** Done

Bilingual/slug genre match (EN empty bug fix); six WEBTOON-gap genres; status chips; `/categories/:slug` sync.

Convention: [categories-browse.md](../conventions/categories-browse.md).

---

## Impl Phase 12 — Typography stack + bold-flicker stabilize (2026-08-11)

**Status:** Done

Wired Inter + Noto Sans Myanmar; banned `font-black` / `font-extrabold`; selection states keep constant weight; removed unloaded serif toggles on Privacy/Terms/Cookies.

Convention: [typography.md](../conventions/typography.md). ADR: [003-softgate-type-stack.md](../decisions/003-softgate-type-stack.md).

---

## Impl Phase 13 — Discovery pipelines — UI truth (2026-08-11)

**Status:** Done

Reader resource not-found (no wrong-content fallback); EN genre labels via `resolveGenreLabel`; Categories bilingual search; Search trending → `/categories/:slug`; Search status/genre/sort URL sync.

Note: plan batches labeled 12/13/14 mapped to SoftGate Impl **13/14/15** because Impl 12 was already used for typography.

---

## Impl Phase 14 — Discovery pipelines — data integrity (2026-08-11)

**Status:** Done

Mock episodes for all titles; derived genre counts; localStorage schemaVersion; related-by-genre.

Convention: [discovery-honesty.md](../conventions/discovery-honesty.md).

---

## Impl Phase 15 — Discovery pipelines — CTA honesty (2026-08-11)

**Status:** Done

Author → search works-by-author; hide dead Library CTA; social `#` retained.

---

## Impl Phase 16 — Book covers — Hero 3D + Apple spine (2026-08-11)

**Status:** Done

`BookCard` hardcover grids + `HeroBook3D` (open + page leaf). Soft-Expressive radius exception for `.book-media`.

Convention: [book-cover-presentation.md](../conventions/book-cover-presentation.md). ADR: [004-book-media-presentation.md](../decisions/004-book-media-presentation.md).

---

## Impl Phase 17 — Info page headers + breadcrumbs (2026-08-11)

**Status:** Done

Removed fake Back→Home on all nine info pages. Shared `Breadcrumb` + `PageHeader` with Company / Support / Legal tiers; `src/lib/info/pageMeta.ts` as route map.

Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 18 — HeroBook3D UX harden (2026-08-11)

**Status:** Done

Backdrop-only overflow clip; cover Link CTA; focus-within close; touch sticky open.

Convention: [book-cover-presentation.md](../conventions/book-cover-presentation.md). ADR: [005-herobook3d-ux.md](../decisions/005-herobook3d-ux.md).

---

## Impl Phase 19 — Structure hygiene (2026-08-11)

**Status:** Done

Deleted dead `constants/` + `types/`; removed orphan Card/Comments; SEO + SearchAutocomplete barrels; auth → `context/AuthContext` with `features/auth/useAuth` re-export stub.

Convention: [source-layering-and-imports.md](../conventions/source-layering-and-imports.md).

---

## Impl Phase 20 — Profile feature components extract (2026-08-11)

**Status:** Done

Moved `FloatingInput`, `WeeklyReadingChart`, `AchievementsBadgeCenter` to `features/profile/components/` (presentational only).

---

## Impl Phase 21 — Library feature components extract (2026-08-11)

**Status:** Done

Extracted `LibraryEmptyState` + `LibraryDeleteConfirmDialog` under `features/library/components/`.

---

## Impl Phase 22 — Coins presentational extract (2026-08-11)

**Status:** Done

Moved package/transaction data + `CoinPackageCard` + `TransactionHistoryRow`. Payment wizard left in page.

---

## Impl Phase 23 — Reader comments panel extract (2026-08-11)

**Status:** Done

`ReaderCommentsPanel` under `features/reader/components/`; Modal chrome stays on `ReaderPage`.

---

## Impl Phase 24 — Categories genre strip scroll affordance (2026-08-11)

**Status:** Done

Categories genre pills: single-row `overflow-x-auto` with hidden scrollbar (`scrollbar-hide`) and scroll-aware right chevron + fade via `useOverflowScrollX`. No genre data changes; Home/status out of scope.

Convention: [categories-browse.md](../conventions/categories-browse.md).

---

## Impl Phase 25 — Library bookmark wiring + Home Save CTA (2026-08-11)

**Status:** Done

Client-persisted bookmarks (`softgate_library_v1` per user id) via `src/lib/library` + `LibraryContext`. Home / Detail / Reader Save share one store; Library bookmarks tab is honest. History/likes later wired via engagement (Impl 31–32+); Continue + scroll resume Impl 40–41. Guest Save → login with return `from`.

Convention: [library-bookmarks.md](../conventions/library-bookmarks.md).

---

## Impl Phase 26 — Categories genre reserved chevron + status size (2026-08-11)

**Status:** Done

Genre strip chevron moved from absolute overlay to a reserved right flex slot; status chips share genre `min-h`/`padding` (`rounded-2xl` unchanged).

Convention: [categories-browse.md](../conventions/categories-browse.md).

---

## Impl Phase 27 — Client auth honesty (2026-08-11)

**Status:** Done

Browser-local accounts (`softgate_accounts_v1`) + session; Register creates session; Login validates password; Profile uses Auth; OAuth removed; Forgot/Reset unavailable-honest.

Convention: [client-auth.md](../conventions/client-auth.md).

---

## Impl Phase 28 — Wallet + Demo top-up (2026-08-11)

**Status:** Done

`softgate_wallet_v1` + `WalletContext`; Coins Buy = Demo top-up (seed 150). Convention: [client-wallet.md](../conventions/client-wallet.md).

---

## Impl Phase 29 — Premium unlock debit + persist (2026-08-11)

**Status:** Done

Reader unlock debits wallet, persists `unlockedEpisodeKeys`, guest → login `from`.

---

## Impl Phase 30 — Episode images + Reader render (2026-08-11)

**Status:** Done

Shared episode `images` filled; schema v4; Reader honest empty when missing.

---

## Impl Phase 31 — Reading history + Detail read badges (2026-08-11)

**Status:** Done

`softgate_engage_v1` history; Library History + Detail read marks. Convention: [library-engagement.md](../conventions/library-engagement.md).

---

## Impl Phase 32 — Likes store ↔ Library Likes (2026-08-11)

**Status:** Done

Reader heart ↔ Library Likes via engagement `likedWebtoonIds`.

---

## Impl Phase 33 — Profile Auth + derived stats (2026-08-11)

**Status:** Done

Profile stats from Auth + Library + engagement + wallet; avatar dataURL.

---

## Impl Phase 34 — Share + Comments client-wire (2026-08-11)

**Status:** Done

Web Share + clipboard; `softgate_comments_v1` into shared `Comments`. Convention: [client-comments-notifications.md](../conventions/client-comments-notifications.md).

---

## Impl Phase 35 — Notifications store + nav honesty (2026-08-11)

**Status:** Done

Client notifications + mark-read; nav unread dot; CTAs to real routes.

---

## Impl Phase 36 — Dead chrome + Reader polish + 404 (2026-08-11)

**Status:** Done

Hide dead Library Filter/Sort + remember-me; Reader fontSize; invalid id not-found.

---

## Impl Phase 37 — Marketing / Home honesty (2026-08-11)

**Status:** Done

Info/Footer/Home discovery copy and sorts aligned to mock catalog honesty.

---

## Impl Phase 38 — Mock-honest roadmap close (2026-08-11)

**Status:** Done

Forgot/Reset unavailable confirmed; client mock-honest wiring (27–38) complete. Backend next (out of scope).

---

## Impl Phase 39 — Home UI polish (2026-08-11)

**Status:** Done

Calm hero (title + deck + Start Reading + Save); roomier hero / tighter shelf rhythm. No Continue logic.

---

## Impl Phase 40 — Home Continue episode rail (2026-08-11)

**Status:** Done

Auth Continue Reading rail from engagement history; shared progress helpers; `primary-600` under-cover bar; reserved chevron.

---

## Impl Phase 41 — Reading scroll-depth resume (2026-08-11)

**Status:** Done

`HistoryRecord.scrollRatio` schema v2; Reader throttled persist + restore; blended progress on Home/Library shelves.

---

## Impl Phase 42 — HeroBook3D reliable 3D + reference tilt (2026-08-11)

**Status:** Done

Unflattened Home/Detail wrappers (no Framer transform ancestors). Cover/leaf/shell = CSS class-driven 3D; floating three-quarter tilt + separate float shadow; no `:hover` shell fight.

Convention: [book-cover-presentation.md](../conventions/book-cover-presentation.md). ADR: [005-herobook3d-ux.md](../decisions/005-herobook3d-ux.md).

---

## Impl Phase 43 — Home Genres reserved chevron (2026-08-11)

**Status:** Done

Home `Genres:` strip matches Categories Impl 26: `useOverflowScrollX` + reserved right chevron (not overlay). Separate hook instance from Continue rail.

---

## Impl Phase 44 — HeroBook3D open fix (flatten + reduced) (2026-08-11)

**Status:** Done

Killed `.hero-book-spread { overflow: hidden }` flatten; single DOM tree; reduced motion = 2D cover `translateX` slide (no flat `book-media` lift-only path).

Convention: [book-cover-presentation.md](../conventions/book-cover-presentation.md). ADR: [005-herobook3d-ux.md](../decisions/005-herobook3d-ux.md).

---

## Impl Phase 45 — HeroBook3D real hinge + size + reduced fade (2026-08-11)

**Status:** Done

Full motion gated under `prefers-reduced-motion: no-preference` with hardcover `rotateY(-155deg)` hinge. Reduced = opacity cross-fade (no `translateX` fake-open). Hero wrappers bumped (`w-56` → `xl:w-96`); scene padding tightened.

Convention: [book-cover-presentation.md](../conventions/book-cover-presentation.md). ADR: [005-herobook3d-ux.md](../decisions/005-herobook3d-ux.md).

---

## Impl Phase 46 — static HeroBook + hero mid-align (2026-08-11)

**Status:** Done

Retired open/hinge/fade interaction. HeroBook3D is a static three-quarter hardcover Link with CSS hover lift only. Home hero row uses `lg:items-center`. Size wrappers unchanged.

Convention: [book-cover-presentation.md](../conventions/book-cover-presentation.md). ADR: [005-herobook3d-ux.md](../decisions/005-herobook3d-ux.md).

---

## Impl Phase 47 — Hide page scrollbar + ScrollToTop (2026-08-11)

**Status:** Done

Document scrollbar hidden on `html` (scroll kept). `ScrollToTop` FAB in MainLayout only; Reader/Auth excluded. Convention: [portal-scroll-chrome.md](../conventions/portal-scroll-chrome.md).

---

## Impl Phase 48 — Home hero optical vertical center (2026-08-11)

**Status:** Done

Home hero mid-band: `min-h` + `flex justify-center` shell; sibling `lg:items-center` kept; equal `.hero-book-scene` padding; Home book `lg:translate-y-2` optical nudge. Not 100vh (SoftGate logo clash). Detail unchanged.

Convention: [book-cover-presentation.md](../conventions/book-cover-presentation.md). ADR: [005-herobook3d-ux.md](../decisions/005-herobook3d-ux.md).

---

## Impl Phase 49 — Hero Spotlight carousel (Trending 5) (2026-08-11)

**Status:** Done

Home hero Trending-top-5 rotator: static banner; CTA-aligned dots + right-only next; 5s autoplay loop; pause hover/focus; reduced-motion off autoplay. Convention: [hero-spotlight.md](../conventions/hero-spotlight.md).

---

## Impl Phase 50 — About i18n missing keys fix (2026-08-11)

**Status:** Done

Filled missing `about.*` stats/milestone keys (and related Careers/Press/Help keys) in EN/MM with mock-honest copy. About stats no longer render raw i18n keys.

---

## Impl Phase 51 — HeroBook3D fore-edge pose tune (2026-08-11)

**Status:** Done

Static closed hardcover CSS tune: milder three-quarter pose + visible right fore-edge page stack (22px, `left: 100%` + `rotateY(90deg)`, horizontal paper lines). No open/hinge. Convention: [book-cover-presentation.md](../conventions/book-cover-presentation.md). ADR: [005-herobook3d-ux.md](../decisions/005-herobook3d-ux.md).

---

## Impl Phase 52 — HeroBook3D unflatten + thick fore-edge (2026-08-11)

**Status:** Done

Removed Framer `motion.div` around Home `HeroBook3D` (title/CTA fade only). Thickened fore-edge via `--hero-book-thickness: 48px`, yaw `-42deg`, `perspective: 1000px`. Conventions: [book-cover-presentation.md](../conventions/book-cover-presentation.md), [hero-spotlight.md](../conventions/hero-spotlight.md). ADR: [005-herobook3d-ux.md](../decisions/005-herobook3d-ux.md).

---

## Impl Phase 53 — About Our Story split + book visual (2026-08-11)

**Status:** Done

Replaced fake 2024–2026 timeline with 2026-honest three-paragraph Our Story (`Flag` / `Users` / `Beaker` Lucide rows) + decorative SoftGate hardcover SVG. Note: [2026-08-11-about-story-split-narrative.md](../notes/2026-08-11-about-story-split-narrative.md).

---

## Impl Phase 54 — HeroBook3D static pose always-on (2026-08-11)

**Status:** Done

Static hardcover pose + fore-edge always applied (not gated by reduced-motion). Reduced-motion only disables hover lift. Home optical nudge `lg:mt-2` (no transform ancestor). Convention: [book-cover-presentation.md](../conventions/book-cover-presentation.md). ADR: [005-herobook3d-ux.md](../decisions/005-herobook3d-ux.md).

---

## Impl Phase 55 — About Mission & Vision + UI/UX polish (2026-08-13)

**Status:** Done

Rendered Mission + new honest Vision as a two-card split (`Target` / `Telescope`); fixed five hardcoded English strings; honesty rewrite of values copy; reduced-motion guards, semantic heading/section fixes, uniform primary icon wells; Organization JSON-LD; new AboutPage smoke test + IntersectionObserver class mock in test setup. Note: [2026-08-13-about-mission-vision-polish.md](../notes/2026-08-13-about-mission-vision-polish.md).

---

## Impl Phase 56 — Careers → Creators (Publish with Us) pivot (2026-08-13)

**Status:** Done

Careers page (empty "not hiring" card) replaced by creator-acquisition page `CreatorsPage.tsx` at `/creators`: masthead hero, 3-step How it works, format checklist, What we look for, single Contact CTA (hover + focus-visible) with legal note. `max-w-7xl` shell + left-aligned `max-w-3xl` text columns. Route/pageMeta/Footer/sitemap renamed; `careers.*` i18n deleted, `creators.*` added (EN/MM); About CTA → `/creators`. Note: [2026-08-13-creators-page-pivot.md](../notes/2026-08-13-creators-page-pivot.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 57 — Press kit page + chrome alignment (2026-08-13)

**Status:** Done

Press rebuilt from empty state to press-kit hub: boilerplate, real logo downloads (`/logo/*` only, no fake ZIP/PDF), honest fact sheet `dl` grid, media contact CTA (Button-primary states, `min-h-11`, `translate="no"` email). Masthead + radial wash + `max-w-7xl` shell (Container standard). New `press.*` EN/MM keys, dead keys removed; new `PressPage.test.tsx` (5 cases). Note: [2026-08-13-press-kit-chrome-align.md](../notes/2026-08-13-press-kit-chrome-align.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 58 — Support & recovery pages (FAQ/Help/404/Contact) (2026-08-13)

**Status:** Done

FAQ: 7xl shell + `max-w-3xl` column, hardcoded strings → `faq.*` i18n (search, All FAQs, feedback widget, empty state + Contact link), `type="search"` + `aria-label`, honesty rewrite `a5`/`a8` (demo-only reset + top-up), new webtoon Q&A `q12–q14` (premium unlock, Continue Reading, publish → Creators). Help: 7xl shell, focus-visible topic cards, Popular Articles (FAQ question links) + Need More Help CTA using previously dead keys; leftover dead keys deleted. 404: new `NotFoundPage.tsx` inside MainLayout (nav/footer preserved), i18n `notFound.*`, SEO `noindex`, `Link` recovery actions (Home / Search / Categories / Library / Contact). Contact: 7xl shell, validation + form/success copy → `contact.errors.*` + honest mailto copy. 4 new test suites (19 cases). Note: [2026-08-13-support-pages-revamp.md](../notes/2026-08-13-support-pages-revamp.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 59 — Legal shared shell + chrome fixes (2026-08-13)

**Status:** Done

Privacy/Terms/Cookies de-cloned into shared `LegalTocSidebar` (anchor links + scroll-spy + reduced-motion + mobile collapse), `ReadabilityControls` (44px labeled buttons, contrast radiogroup), `useLegalReadability` (persisted), `useScrollSpy`. Dead classes removed (`prose*`, `border-gray-150`, `text-xs.5`), `scroll-mt-24` headings, sidebar `lg:top-20`, localized last-updated date, `legal.*` chrome keys EN/MM. Note: [2026-08-13-legal-shell-extract.md](../notes/2026-08-13-legal-shell-extract.md). Convention: [legal-pages.md](../conventions/legal-pages.md).

---

## Impl Phase 60 — Legal content honesty (webtoon-standard) (2026-08-13)

**Status:** Done

Terms gained webtoon-industry sections (eligibility 13+, coins no-ownership/no-real-value/demo-simulated, user comments license, anti-piracy prohibited items). Privacy rewritten around localStorage truth (nothing sent to servers; reading-activity + children sections). Cookies became honest Cookies & Local Storage policy (no tracking cookies; real storage table; analytics/marketing: none). Page-specific SEO descriptions; `LegalPages.test.tsx`. Note: [2026-08-13-legal-content-honesty.md](../notes/2026-08-13-legal-content-honesty.md).

---

## Impl Phase 61 — App pages shell alignment (Profile/Notif/Coins) (2026-08-13)

**Status:** Done

App task pages aligned to the `max-w-7xl` shell so left edges match the Navigation logo and Footer: Profile `max-w-6xl` → `max-w-7xl` (`lg:grid-cols-4` grid fills it), Notifications 7xl shell + left-aligned `max-w-3xl` inner column, Coins 7xl shell + left-aligned `max-w-4xl` inner column (fixed confetti/wizard modal/snackbar untouched). Fixed pre-existing raw i18n keys the new tests caught: `profilePage.localStatsNote` + `common.demo` added EN/MM. 3 new smoke suites (9 cases) assert shell + inner column classes; ProfilePage seeds `softgate_user` session. Reader + Auth documented as intentional exclusions. Note: [2026-08-13-app-shell-alignment.md](../notes/2026-08-13-app-shell-alignment.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 62 — Broken flows fix (i18n/Comments/Auth chrome) (2026-08-13)

**Status:** Done

Deep-scan breakage batch. (A) 2 wrong i18n keys re-pointed, 7 missing keys added EN/MM (`comments.loginToComment`, `profilePage.avatarFailed`, `readerPage.insufficientCoins`/`read`, `webtoonDetail.linkCopied`/`notFound`/`notFoundDesc`), dead "Open Wallet App Deep Link" button removed, `faq.a5` rewritten to match the no-email-reset reality, unused `auth.forgotPasswordDesc` deleted, Login ↔ Register links forward `state.from`. (B) Comments now persist reply/edit: `parentId?` on `StoredComment` (schema v1 kept) + `addReply`/`updateComment` + cascade delete; `Comments.tsx` rewritten controlled (module-scope `CommentItem` → focus-loss fixed, ghost comment gone, Report button removed, full i18n EN/MM, `.shape-circle`/`rounded-2xl`); `ReaderCommentsPanel` tree-groups storage and drops the `key` remount hack; 6-case test suite. (C) Auth double chrome removed: `AuthLayout` brand h1→p + `text-gray-550` fix; 4 auth pages lost their own full-screen wrapper + duplicate brand block. Note: [2026-08-13-broken-flows-fix.md](../notes/2026-08-13-broken-flows-fix.md). Convention: [client-comments-notifications.md](../conventions/client-comments-notifications.md).

---

## Impl Phase 63 — Data correctness (read set / unlock / likes) (2026-08-13)

**Status:** Done

Three latent data bugs fixed. (A) Read tracking: `HistoryRecord.readEpisodeNumbers?: number[]` additive (schema v2 kept), storage sanitize (finite/>0/dedupe/sort, legacy fallback `[episodeNumber]`), `recordHistory`/`updateReadingProgress` union the set, `EngagementContext.readEpisodeNumbers` returns the stored set instead of a 1..N loop, ProfilePage `episodesRead` counts the set — jumping into ep 3 no longer marks 1–2 read or inflates stats. (B) Detail unlock: `WebtoonDetailPage` episode rows compute `locked = isPremium && !isEpisodeUnlocked(...)` via `useWallet`, so purchased premium episodes stop showing the Lock icon; new `WebtoonDetailUnlock.test.tsx`. (C) Per-user comment likes: `StoredComment.isLiked` → `likedByUserIds?: string[]`, `toggleCommentLike(episodeKey, commentId, userId)` toggles membership with `likeCount = likedByUserIds.length` (legacy fake counts reset — accepted), panel derives viewer `isLiked`/count, like button disabled when logged out. Tests +7 (lib set semantics, unlock icon, per-user like remount, disabled state). Note: [2026-08-13-read-tracking-unlock-likes.md](../notes/2026-08-13-read-tracking-unlock-likes.md). Conventions: [continue-reading.md](../conventions/continue-reading.md), [client-comments-notifications.md](../conventions/client-comments-notifications.md).

---

## Impl Phase 64 — Polish sweep (tokens/a11y/honesty/dead code) (2026-08-13)

**Status:** Done

(A) `--text-2xs` (0.6875rem/1rem) defined in `@theme` so the 7 existing `text-2xs` usages render; `border-gray-150/60` → `border-gray-200/60` + `dark:text-gray-505` → `dark:text-gray-500` on Contact; NotFound `font-black` → `font-bold` (type stack ban). (B) a11y: `Button` defaults `type="button"` (override allowed, test added); focus-visible ring pattern (`focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none`, white ring on dark Footer) added across Navigation (logo, nav links, icon buttons, profile pill, mobile drawer), Footer links, LanguageSwitcher. (C) Honesty: `home.joinDescription` EN/MM and 4 `index.html` meta/JSON-LD spots dropped "thousands of readers" claims. (D) Dead exports removed after grep sweep: engagement `getEngagement`, `episodeProgressPercent`, `clamp01` (internal now), `readEpisodeNumbersForWebtoon`; comments `COMMENTS_SCHEMA_VERSION` re-export; unused `comments.replies` key EN/MM. Note: [2026-08-13-polish-sweep.md](../notes/2026-08-13-polish-sweep.md). Convention: [typography.md](../conventions/typography.md).

---

## Impl Phase 65 — Cross-tab sync (storage events) (2026-08-13)

**Status:** Done

New `src/hooks/useStorageSync.ts` (`useStorageSync(keys, onChange)` — matches `e.key === null` for `clear()` or listed keys; `storage` never fires in the writing tab, so no double updates). Wired: `AuthContext` → `softgate_user` (`setUser(readSession())`; downstream contexts reload via existing `userId` effects; `softgate_accounts_v1` deliberately unsubscribed since session key is always rewritten), `EngagementContext` → `softgate_engage_v1` + `softgate_notifications_v1`, `WalletContext` → `softgate_wallet_v1`, `LibraryContext` → `softgate_library_v1` (all three had their load effects extracted into `refresh` callbacks), `ReaderCommentsPanel` → `softgate_comments_v1`. New `CrossTabSync.test.tsx` (5 cases incl. unrelated-key negative; jsdom needs manual `StorageEvent` dispatch). Note: [2026-08-13-cross-tab-sync.md](../notes/2026-08-13-cross-tab-sync.md). Conventions: [client-auth.md](../conventions/client-auth.md), [client-wallet.md](../conventions/client-wallet.md), [client-comments-notifications.md](../conventions/client-comments-notifications.md).

---

## Impl Phase 66 — Account data migration + delete cascade (2026-08-13)

**Status:** Done

`user.id` is an email hash, so an email change mints a new id and previously orphaned all per-user data. New `src/lib/account/` (`migrate.ts` + barrel): `migrateUserData(oldId, newId)` moves the 4 `byUserId` stores (engagement/wallet/library/notifications — migrated data overwrites any stale entry under the new id, e.g. an auto-seeded wallet) and rewrites comment authorship (`userId` + `user.id`) plus `likedByUserIds` old→new with dedupe (likeCount preserved); `deleteUserData(userId)` clears the 4 stores and cascade-deletes the user's comments + replies to them (Impl 62 semantics), strips their likes elsewhere (`likeCount = length`), and drops empty episode keys. `AuthContext.updateProfile` calls `migrateUserData` in the email-change branch before `deleteAccountByEmail`; `deleteAccount` calls `deleteUserData` after password verify. Same-tab contexts reload via existing `userId` effects; cross-tab via Impl 65 listeners. New `accountDataMigration.test.ts` (6 cases: store move, comment rewrite, collision overwrite, delete cascade, no-op guards, AuthContext integration). Note: [2026-08-13-account-data-migration.md](../notes/2026-08-13-account-data-migration.md). Convention: [client-auth.md](../conventions/client-auth.md).

---

## Impl Phase 67 — Reader guest conversion nudges (2026-08-13)

**Status:** Done

WEBTOON-style guest conversion in the reader after a guest-access audit (industry research: WEBTOON/Naver/Tapas/Lezhin/Manta). Premium locked screen is guest-aware ("Log in to unlock" label, balance line hidden for guests); Chapter Complete portal gains a guest sign-up nudge (register Button + login Link, both carrying `state.from` back to the episode). 3 new `readerPage.*` keys EN/MM; `ReaderGuestNudge.test.tsx` (4 cases). New convention: [guest-access.md](../conventions/guest-access.md) (full guest policy matrix). Note: [2026-08-13-reader-guest-nudges.md](../notes/2026-08-13-reader-guest-nudges.md).

---

## Impl Phase 68 — Skeleton loading states + Home empty state (2026-08-13)

**Status:** Done

Replaced the 7 copy-pasted full-screen spinners with layout-mirroring skeletons (research-backed: skeletons for predictable content layouts, 200ms delay guard against mock-mode flash, `role="status"` + `aria-busy`). New `Skeleton` primitive (`src/components/Skeleton/`) + 6 feature skeletons; ProtectedRoute now renders a quiet shell (auth resolves in one frame — no loader per <100ms rule). HomePage's conflated `isLoading || webtoons.length === 0` split into skeleton vs `HomeEmptyState` (was an infinite spinner when data was legitimately empty). Reduced-motion CSS now disables pulse/spin. New convention: [loading-states.md](../conventions/loading-states.md). Note: [2026-08-13-skeleton-loading-states.md](../notes/2026-08-13-skeleton-loading-states.md).

---

## Impl Phase 69 — Reader celebration truth (2026-08-13)

**Status:** Done

Chapter Complete portal honesty fixes (Batch 1 of the six-batch audit overhaul). Real next-episode title via `nextEpisode` lookup replaces hardcoded "Chapter Continuation" (contrast bug fixed: fixed `text-gray-100` → darkMode ternary); reading time now computed from measured `scrollHeight` (`totalEstMinutes`, same 3000px/min model as the HUD) instead of hardcoded "3 mins"; hardcoded "Episode {n}", header "Ep. {n}" and the end-of-series line moved to i18n (`readerPage.episodeN/epShort/minutes/endOfSeries` EN+MM). New `ReaderCelebration.test.tsx` (3 cases). Note: [2026-08-13-reader-celebration-truth.md](../notes/2026-08-13-reader-celebration-truth.md).

---

## Impl Phase 70 — Dialog a11y system (2026-08-13)

**Status:** Done

ARIA APG modal-dialog pattern across all overlay surfaces via two new shared hooks: `useScrollLock` (iOS-proof `position: fixed` body lock storing/restoring `scrollY` — replaces `overflow: hidden`) and `useFocusTrap` (initial focus, Tab/Shift+Tab cycle, trigger-focus restore; capture-phase). `Modal.tsx` gains `role="dialog"`/`aria-modal`/`aria-labelledby` + internal content scroll (`max-h-[calc(85dvh-4rem)] overflow-y-auto overscroll-contain`); `LibraryDeleteConfirmDialog` gains dialog semantics + Escape + Cancel initial focus; Reader settings sheet gains Escape + scroll lock + labeled 44px-friendly close button. Native `<dialog>` migration stays parked. New `ModalA11y.test.tsx` (7 cases). Note: [2026-08-13-dialog-a11y-system.md](../notes/2026-08-13-dialog-a11y-system.md).

---

## Impl Phase 71 — Coins checkout honesty + i18n copy (2026-08-13)

**Status:** Done

Copy-only honesty pass on the Coins demo checkout: persistent `demoCheckoutNote` banner inside the wizard (visible on method + detail steps), fake "Transaction Merchant ID TXN-8472910-MM" → "Demo transaction ID DEMO-TXN-8472910" (copy button kept), 23 new `coinsPage.*` EN+MM keys (method descs, backToMethods, totalPrice, payAmount, perCoin, phone errors, card-art strings), `formatPrice` locale-aware (`my-MM` for mm). No flow changes. New `CoinsCheckout.test.tsx` (5 cases). Note: [2026-08-13-coins-honesty-i18n.md](../notes/2026-08-13-coins-honesty-i18n.md).

---

## Impl Phase 72 — Coins wizard shell + cleanup (2026-08-13)

**Status:** Done

Wizard panel becomes a real modal dialog: `flex max-h-[85dvh] flex-col` with `flex-1 overflow-y-auto overscroll-contain` content (mobile card/QR sheets no longer overflow), `role="dialog"` + `aria-modal` + `aria-labelledby`, `useScrollLock`/`useFocusTrap` (Impl 70 hooks), Escape-to-close guarded by `isProcessing`. Dead theme code deleted: 6 `.dark .metal-*` CSS rules + ~63 never-firing `dark:` utilities; `text-[10px]` ×8 → `text-2xs` (card-art `text-[8px]/[9px]` kept). `sr-only` h1 added. `CoinsCheckout.test.tsx` +3 cases. Note: [2026-08-13-coins-wizard-shell.md](../notes/2026-08-13-coins-wizard-shell.md).

---

## Impl Phase 73 — Chrome polish: safe areas, targets, nav, CTAs (2026-08-13)

**Status:** Done

`viewport-fit=cover` added (prerequisite for all `env(safe-area-inset-*)`); `safe-top` wired on Navigation + Reader header, `safe-bottom` on Reader footer + settings sheet, floating pills offset via `bottom-[calc(1.5rem+env(safe-area-inset-bottom))]`. 44px minimum targets on primary chrome (nav icon buttons, mobile menu rows, Modal close). LanguageSwitcher label `hidden sm:inline` (Globe-only on mobile). Authenticated nav gains Library + Coins shortcuts (desktop icons next to bell, mobile menu row). CTA honesty: Home banner is auth-aware (`browseNow` → /categories for members), Notifications row link label "Home" → "View". New `NavChrome.test.tsx` (8 cases). Note: [2026-08-13-chrome-polish-safe-area.md](../notes/2026-08-13-chrome-polish-safe-area.md).

---

## Impl Phase 74 — Mechanical theme sweep (2026-08-13)

**Status:** Done

Zero-visual-change cleanup: ~250 legacy `dark:` classes stripped from 22 portal files (grep-verified: only the Skeleton tone TS key remains); Reader brightness-slider track converted to a real `darkMode` ternary; `text-[10px]` → `text-2xs` repo-wide; radius drift fixed (WebtoonDetailSkeleton badge, SkeletonText, Press tag); legal sepia hexes → `--color-sepia-*` token classes; `.radial-wash-primary` utility replaces 4 hand-written masthead gradients; [brand-color-tokens.md](../conventions/brand-color-tokens.md) codifies the semantic palette (emerald/amber/sky/red + gamification rainbow + vendor hexes + sepia). 233/233 tests green with zero test edits. Note: [2026-08-13-theme-mechanical-sweep.md](../notes/2026-08-13-theme-mechanical-sweep.md).

---

## Impl Phase 75 — i18n sweep (2026-08-13)

**Status:** Done

Remaining hardcoded English routed through i18next en+mm: Home relative release dates, Profile achievements (5 badges) + weekly chart (now honest — real episodes-read counts instead of `× 5` fake minutes; localized `Intl` weekday names), Library view toggles / `Ep. n/total` / empty + delete-dialog strings, Auth tagline, Modal close, BookCard/HeroBook3D cover fallbacks, Reader font-size labels (fixed "Small" mis-wired to "All") + wallet unlock txn description (`title[lang]`), notification seed messages via `i18n.t()` at creation, locale-aware `toLocaleDateString` fallbacks (Comments/Notifications) and `formatDate` mm→my-MM mapping. Gotcha: legacy duplicate `profilePage.weeklyActivity` key shadowed the new value (JSON last-one-wins) — reused legacy keys instead; dupe scan clean. New `I18nSweep.test.tsx` (4 mm/en spot checks); suite 237. Note: [2026-08-13-i18n-sweep.md](../notes/2026-08-13-i18n-sweep.md).

---

## Impl Phase 76 — A11y structural (2026-08-13)

**Status:** Done

Structural accessibility across the portal: heading hierarchy fixed (Profile display-name h2→h1, Search sr-only h1, LibraryEmptyState h3→h2), Library card divs + Notifications rows keyboard-operable (`role="button"` + `tabIndex` + Enter/Space + focus-visible ring — nested interactive children rule out `<button>`), async feedback announced (`role="status"` on Library/Coins toasts + Profile save line; `role="alert"` on Reader unlock error + form field errors), FloatingInput/Contact fields get real `useId` label wiring + `aria-invalid`/`aria-describedby`, password eye toggles labeled via new `auth.showPassword`/`hidePassword` keys (en+mm), decorative lucide icons `aria-hidden` across 10 files. New `A11yStructure.test.tsx` (6 cases; jsdom gotcha: AnimatePresence `mode="wait"` delays Library card mount — tests must `waitFor`). Suite 243. Note: [2026-08-13-a11y-structural.md](../notes/2026-08-13-a11y-structural.md).

---

## Impl Phase 77 — Responsive header + overflow hardening (2026-08-13)

**Status:** Done

Tablet-band header crowding fixed with a measured breakpoint ladder: member cluster `sm:` → `lg:`, desktop search box → `xl:` (narrowed to `w-56`) with the 44px toggle below it, language label → `xl:inline`, hamburger conditional (`lg:hidden` members / `md:hidden` guests) with the menu panel sharing the conditional and its duplicated nav links `md:hidden`. Measuring the row (`clientWidth - leftGroup - rightGroup`, not `scrollWidth`) exposed two live defects: the nav logo had no `shrink-0` and was silently rendering at **35px instead of 58px on every `mm` desktop** because a replaced element absorbed the width deficit; and `scrollbar-none` on the Library tab rail was a no-op (no such utility in Tailwind v4 — it is `scrollbar-hide`). Budget recovered with `lg:gap-2`, `w-56`, and a `max-w-[10ch]` name cap → worst case +28px at 1024, +47px at 1280 (member + `mm`). Safety nets: `min-w-0` on the profile `Link` only (never the icon cluster — that would silently clip icons under the guard), `truncate`, `shrink-0`, `whitespace-nowrap`, `wrap-anywhere` on comment bodies. Disclosure semantics: `aria-expanded` + `aria-controls` on hamburger + search toggle, constant `nav.menu` key (en+mm) replacing the `viewAll`/`close` ternary. Page guard `html, body { overflow-x: clip }` (never `hidden` — it kills the sticky nav), verified live against sticky nav, ScrollToTop, Modal, Reader footer + settings sheet, and scroll-lock restore. New `ResponsiveChrome.test.tsx` (13 cases incl. an anti-regression guard for the `min-w-0` mistake). Suite 256. Note: [2026-08-13-responsive-header-hardening.md](../notes/2026-08-13-responsive-header-hardening.md).

---

## Impl Phase 78 — HeroBook3D Home size + thickness + top poke (2026-08-14)

**Status:** Done

Home `HeroBook3D` one step smaller (`xl:w-80`), shared thickness `32px`, milder `rotateX(6deg)`, extra scene top padding, hover lift `-3px`. No `overflow: hidden` (preserve-3d). Detail width unchanged. Note: [2026-08-14-herobook3d-home-size-thickness.md](../notes/2026-08-14-herobook3d-home-size-thickness.md). Convention: [book-cover-presentation.md](../conventions/book-cover-presentation.md). ADR: [005-herobook3d-ux.md](../decisions/005-herobook3d-ux.md).

---

## Impl Phase 79 — HeroBook3D fore-edge vertical page lines (2026-08-14)

**Status:** Done

`.hero-book-pages` grain `to bottom` → `to right` so stacked sheets read as vertical edges on the right fore-edge. Pose/thickness/overflow unchanged. Note: [2026-08-14-herobook3d-fore-edge-vertical.md](../notes/2026-08-14-herobook3d-fore-edge-vertical.md).

---

## Impl Phase 80 — Home hero pair lg:mt-10 nudge (2026-08-14)

**Status:** Done

Home title+book row `lg:mt-10`; book wrapper `lg:mt-2` removed so the pair drops together 40px. `lg:items-center` and hero `min-h` unchanged. Note: [2026-08-14-hero-pair-mt-nudge.md](../notes/2026-08-14-hero-pair-mt-nudge.md).

---

## Impl Phase 81 — Home hero row mt-12 + book mt-4 (2026-08-14)

**Status:** Done

Row `lg:mt-12` (text) + book wrapper `lg:mt-4` (book 64px total). `lg:items-center` kept. Note: [2026-08-14-hero-row-mt12-book-mt4.md](../notes/2026-08-14-hero-row-mt12-book-mt4.md).

---

## Impl Phase 82 — Hero title/deck line rules + overflow (2026-08-17)

**Status:** Done

Hero catalog title/deck display lock: title `line-clamp-2 lg:line-clamp-1`, deck `line-clamp-2` + `min-h-2lh`. Overflow ellipsizes; full copy on webtoon detail. Text column `min-w-0`. Note: [2026-08-17-hero-copy-line-rules.md](../notes/2026-08-17-hero-copy-line-rules.md).

---

## Impl Phase 83 — Home hero book enter from under copy (2026-08-17)

**Status:** Done

Home-only CSS `translate` enter on `.hero-book-enter` (book slides out from behind title/deck). Copy stays opacity fade. Detail unchanged. Note: [2026-08-17-hero-book-enter.md](../notes/2026-08-17-hero-book-enter.md).

---

## Impl Phase 84 — Force Home book enter for all visitors (2026-08-17)

**Status:** Done

Book enter animation is not gated on `prefers-reduced-motion`. Hover lift still is. Note: [2026-08-17-hero-book-enter-forced.md](../notes/2026-08-17-hero-book-enter-forced.md).

---

## Impl Phase 85 — About Our Story uses Home HeroBook3D (2026-08-17)

**Status:** Done

About Our Story decorative book replaced the flat `story-book.svg` shell with the same static `HeroBook3D` hardcover as Home (Home size ladder, no `hero-book-enter`). Cover face is wordless `public/about/story-cover.svg` (brand teal + abstract shapes; not a catalog cover). `HeroBook3D` `href`/`ctaLabel` are optional together so About is not a fake Link; Home/Detail CTAs unchanged. About page-root `overflow-hidden` moved to the masthead wash clipper so 3D is not flattened. Note: [2026-08-17-about-story-herobook3d.md](../notes/2026-08-17-about-story-herobook3d.md).

---

## Impl Phase 86 — Hero book enter from under copy (2026-08-17)

**Status:** Done

Home book enter starts under title/deck via layout-relative `translate` (`calc(100% - 100cqi)` at `lg+`; self-height + gap below). Copy is not faded. Note: [2026-08-17-hero-book-enter-from-copy.md](../notes/2026-08-17-hero-book-enter-from-copy.md).

---

## Impl Phase 87 — Our Story readable book (2026-08-17)

**Status:** Done

About Our Story is an open-spread `StoryBook` with a non-wrapping pager. Chapter copy lives in `@softgate/shared` `mockStoryChapters` (not `SharedData`; schema stays 4). Chapter 1 verso is a flat `story-cover.svg` plate — `HeroBook3D` removed from About. No 3D flip. Note: [2026-08-17-about-story-book.md](../notes/2026-08-17-about-story-book.md).

---

## Impl Phase 88 — Hero book hover straighten then lift (2026-08-17)

**Status:** Done

Home/Detail `HeroBook3D` hover is sequential: face-on identity rotate, then `translate: 0 -0.75rem`. Mouse-out reverses. Home enter blocks pointer-events for 0.8s. Note: [2026-08-17-herobook-hover-straighten-lift.md](../notes/2026-08-17-herobook-hover-straighten-lift.md).

---

## Impl Phase 89 — Our Story open-book shell (2026-08-17)

**Status:** Done

Replaced the Impl 87 white-card + footer pager with a CSS 3D always-open hardcover volume (feathered gutter, spine, fore-edge, page-edge turns). No 180° flip. Numbered **89** because 88 was Home/Detail hover straighten. Note: [2026-08-17-about-story-open-shell.md](../notes/2026-08-17-about-story-open-shell.md).

---

## Impl Phase 90 — Force hero book hover for all visitors (2026-08-17)

**Status:** Done

Ungated Impl 88 straighten-then-lift from `prefers-reduced-motion`; removed reduce `transition: none` on `.hero-book` / shadow; dropped `hero-book-enter-hit` so Home hover can fire. Standing rule: product motion we add is forced. Note: [2026-08-17-hero-book-hover-forced.md](../notes/2026-08-17-hero-book-hover-forced.md). Convention: [forced-product-motion.md](../conventions/forced-product-motion.md).

---

## Impl Phase 91 — Our Story shell + cover + on-page turns (2026-08-17)

**Status:** Done

Contained the chapter-1 cover plate (no intrinsic-size overflow, no leaf `rotateY`), redrew `story-cover.svg` as a webtoon cover, and moved Prev/Next onto visible circular chips on the recto. Note: [2026-08-17-about-story-shell-fix.md](../notes/2026-08-17-about-story-shell-fix.md).

---

## Impl Phase 92 — Hero book hover come-forward not lift (2026-08-17)

**Status:** Done

Second hover beat is camera-forward `translate: 0 0 2rem` on `.hero-book`, not screen-up `0 -0.75rem`. Straighten-then-move delays unchanged. Forced for every visitor. Note: [2026-08-17-herobook-hover-come-forward.md](../notes/2026-08-17-herobook-hover-come-forward.md).

---

## Impl Phase 93 — Our Story 3D valley + page turn (2026-08-17)

**Status:** Done

Restored desk-tilt + leaf `rotateY` valley (clip on inner paper, never on the 3D parent). Next/prev run a CSS 3D `rotateY(±180deg)` sheet hinged at the spine. No new libraries. Note: [2026-08-17-about-story-page-turn.md](../notes/2026-08-17-about-story-page-turn.md).

---

## Impl Phase 94 — Our Story episode reader (2026-08-17)

**Status:** Done

Replaced the 3D Our Story volume in place with a two-pane episode reader (rail + cream pane + optional splash). Deleted every `.story-book-*` rule. Chapter copy unchanged; optional `coverImage` on origin only. Note: [2026-08-17-about-story-episode-reader.md](../notes/2026-08-17-about-story-episode-reader.md).

---

## Impl Phase 95 — Our Story reader pane is white (2026-08-17)

**Status:** Done

Dropped cream `#f7f4ee` on `.story-reader-pane`. Rail and pane are one white panel; splash supplies color. Note: [2026-08-17-about-story-reader-white-pane.md](../notes/2026-08-17-about-story-reader-white-pane.md).

---

## Impl Phase 96 — Catalog tile honesty (2026-08-17)

**Status:** Done

Catalog titles follow cover lettering; discovery tiles share Title / Description / Category / Views / `createdAt` date; New = top 6 published by release date with `primary-600` badge on every catalog surface. Schema 5. Note: [2026-08-17-catalog-tile-honesty.md](../notes/2026-08-17-catalog-tile-honesty.md). Convention: [catalog-tiles.md](../conventions/catalog-tiles.md).

---

## Impl Phase 97 — Mock calendar stays in 2026 (2026-08-17)

**Status:** Done

Episode and mock-user dates moved into 2026 inside each series window. No published date after 2026-08-17. Schema 6. Note: [2026-08-17-mock-calendar-2026.md](../notes/2026-08-17-mock-calendar-2026.md).

---

## Impl Phase 98 — Stale catalog localStorage (2026-08-17)

**Status:** Done

Non-empty `softgate-shared-data` catalogs are re-seeded from current mock on load so 2023/2024 tile dates cannot survive a matching schema. Detail + episode rows show `formatCatalogDate`. Schema 7. Note: [2026-08-17-stale-catalog-localstorage.md](../notes/2026-08-17-stale-catalog-localstorage.md).

---

## Impl Phase 99 — Hero hover come-forward survives production (2026-08-18)

**Status:** Done

Split HeroBook3D hover so straighten stays rotate-only on `.hero-book` and come-forward is `translate3d(..., 3rem)` on `.hero-book-motion`. Home enter 2D `translate` moved off the `perspective` node onto `.hero-book-enter`. Production must no longer flatten Z. Note: [2026-08-18-hero-hover-come-forward-prod.md](../notes/2026-08-18-hero-hover-come-forward-prod.md).

---

## Impl Phase 100 — Skip link + sticky Hero Pause (2026-08-18)

**Status:** Done

MainLayout skip-to-content (native `#main-content` + `.skip-link`) and Hero Pause/Play that does not share hover-pause state. Autoplay 5s, dots + next, and forced book motion unchanged. Note: [2026-08-18-skip-link-hero-pause.md](../notes/2026-08-18-skip-link-hero-pause.md).

---

## Impl Phase 101 — Skip link vertically centers in the nav bar (2026-08-18)

**Status:** Done

Focused `.skip-link` chip aligns to the nav `h-16` midpoint below `safe-top` (`top: calc(max(0px, env(safe-area-inset-top)) + 2rem)` + `translateY(-50%)`). Markup, Pause, and Hero unchanged. Note: [2026-08-18-skip-link-header-align.md](../notes/2026-08-18-skip-link-header-align.md).

---

## Impl Phase 102 — Favicon, OG PNG, Press kit IA (2026-08-18)

**Status:** Done

Favicon set in `index.html`; OG/JSON-LD use `logo.png`. Press rebuilt as honest kit (boilerplate copy, facts including SoftGate / Insein, News empty, SVG+PNG+icon-512, usage, screenshot/spokesperson slots, `press@`). Contact HQ i18n aligned. Note: [2026-08-18-press-kit-favicon.md](../notes/2026-08-18-press-kit-favicon.md).

---

## Impl Phase 103 — About: Who we are (facts, product, timeline, team) (2026-08-18)

**Status:** Done

About H1 is **Who we are**; footer/breadcrumb stay **About Us**. Trophy stats grid replaced with Press-style fact chips. New sections: how the portal works (including demo-wallet honesty), skim 2026 timeline + studio photo, stand-in team grid (`public/about/team/`, `team-creators.jpg` plural). Mission/values/CTA copy tightened; "Join Us" became **Get involved**. Stand-in names are not in Organization JSON-LD. Note: [2026-08-18-about-who-we-are.md](../notes/2026-08-18-about-who-we-are.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 104 — Home discovery jobs (2026-08-18)

**Status:** Done

Home modules use different jobs: Hero Spotlight flags, Ranking by `viewCount` with numbers 1–6, Trending by `weeklyViewCount`, Updated by `updatedAt`, New by `createdAt`. Same title may appear in more than one module. Schema **8**. Note: [2026-08-18-home-discovery-jobs.md](../notes/2026-08-18-home-discovery-jobs.md).

---

## Impl Phase 105 — Prelaunch quality bar (always-on agent rule) (2026-08-18)

**Status:** Done

Standing hand-off bar: international webtoon-site standard; beat current webtoon sites on layout, information, and UI/UX. Incomplete client data and live tools on other sites are not blockers. Installed in always-on rule `07-prelaunch-quality-bar.mdc` (Cursor + Antigravity), root `AGENTS.md`, `.agents/AGENTS.md`, and [prelaunch-quality-bar.md](../conventions/prelaunch-quality-bar.md). Docs only — no `src/` change. Note: [2026-08-18-prelaunch-quality-bar.md](../notes/2026-08-18-prelaunch-quality-bar.md).

---

## Impl Phase 106 — Ranking chart + honest Popular destination (2026-08-18)

**Status:** Done

Home Popular is an ordered ranking chart (large 1–3, list not a 6-up twin of New). `/categories?sort=popular` continues ranks 1–N. `/categories` without `sort` stays unranked browse. Trending gets this-week copy + icon and no View all. Hero/skip/Pause and discovery selectors unchanged. Schema **8**. Note: [2026-08-18-ranking-chart.md](../notes/2026-08-18-ranking-chart.md).

---

## Impl Phase 107 — Publish with Us complete creator intake (2026-08-18)

**Status:** Done

Plan drafted as Impl 106; that number was taken by the ranking chart. This ships as **107**. `/creators` is a complete editorial-intake landing (facts, why, handbook, pitch, after-send, rights/earnings, FAQ). CTA **Send your pitch** → `/contact?intent=submit` prefills Contact. No fake uploader. Note: [2026-08-18-creators-intake.md](../notes/2026-08-18-creators-intake.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 108 — Help / FAQ / Contact support funnel (2026-08-18)

**Status:** Done

Plan drafted as Impl 107; that number was taken by Creators intake. This ships as **108**. Help is the front door, FAQ is the hash/catalog library, Contact is the last step (honest mailto). Footer Support is Help + Contact only. No Zendesk, chat, or tickets. Note: [2026-08-18-support-funnel.md](../notes/2026-08-18-support-funnel.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 109 — Categories sort labels match Home (2026-08-18)

**Status:** Done

Categories dropdown Popular uses `home.ranking` (same as Home / Nav). Popular page icon is `ListOrdered`, not `TrendingUp`. New and Recently Updated titles were already aligned. Highest Rated stays in the dropdown; `h1` for that sort is still Browse by Genre (parked). Ranks still only when `?sort=popular`. Note: [2026-08-18-categories-sort-labels.md](../notes/2026-08-18-categories-sort-labels.md).

---

## Impl Phase 110 — Publish with Us intake polish (2026-08-18)

**Status:** Done

Plan drafted as Impl 109; Categories sort labels took 109. This ships as **110**. `/creators` adds TOC, why cards, demo 3:4 covers, handbook visuals, do-not-send, simultaneous-rights honesty, FAQ5, and a fixed Send pitch bar. Contact `intent=submit` uses labeled pitch fields; default Contact unchanged. Note: [2026-08-18-creators-intake-polish.md](../notes/2026-08-18-creators-intake-polish.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 111 — Help, FAQ, Contact support pages perfect (2026-08-19)

**Status:** Done

Plan drafted as Impl 109; 109–110 were taken (Categories sort labels, Creators intake polish). This ships as **111**. Help, FAQ, and Contact meet the prelaunch bar: six Help kinds, FAQ `q15`–`q20`, honest coins/refund copy, local-only thumbs, About-style chrome, no page-root `overflow-hidden`, Contact writer checklist + Insein, Yangon, Myanmar. `intent=submit` still prefills subject + message template. No chat, tickets, or extra form fields. Note: [2026-08-19-support-pages-perfect.md](../notes/2026-08-19-support-pages-perfect.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 112 — Contact pitch fields for Publish with Us (2026-08-19)

**Status:** Done

Last mile for Publish with Us. `/contact?intent=submit` uses labeled pitch fields (title, genre, episode count, synopsis, 3:4 cover checkbox, optional platforms/notes). Subject-only prefill. Default `/contact` unchanged. Creators CTA inbox `support@` is `translate="no"`. Note: [2026-08-19-contact-pitch-fields.md](../notes/2026-08-19-contact-pitch-fields.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 113 — Contact Demo inbox hours + FAQ a6 a10 a11 (2026-08-19)

**Status:** Done

Plan drafted as Impl 112; Contact pitch fields took 112. This ships as **113**. Copy-only polish: Demo weekday Yangon inbox hours (studio replaces; no clock, no SLA). FAQ `a6` / `a10` / `a11` filled (Profile → Security delete, Home New Releases, request is not a license promise). Still 20 FAQs. `q10` related Home. Note: [2026-08-19-support-hours-faq-fill.md](../notes/2026-08-19-support-hours-faq-fill.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 114 — Series ratings on catalog + Highest Rated (2026-08-19)

**Status:** Done

Plan drafted as Impl 113; Contact hours/FAQ fill took 113. This ships as **114**. Catalog covers show a dark community-score chip (gold star + one decimal). Premium sits under that chip on every catalog tile. Detail and chapter-complete share a 0.5-step series rating control. Community `webtoon.rating` stays frozen; your score is per-user on engagement schema **3**. First rate requires a read episode. Guest → login. Highest Rated gets a real `h1` + `Star` icon, no ranks, no Home/Nav. No fake rating counts. Note: [2026-08-19-series-ratings.md](../notes/2026-08-19-series-ratings.md).

---

## Impl Phase 115 — Series rating star hit cells 44 by 24 (2026-08-19)

**Status:** Done

Chrome only. `SeriesRatingControl` star cells are `h-11 w-12` so each 0.5 hit is 44×24 CSS pixels. Glyph stays square `h-11 w-11` centered. Cover `RatingChip` unchanged. Rating logic, gates, and Highest Rated unchanged. Note: [2026-08-19-series-rating-hit-target.md](../notes/2026-08-19-series-rating-hit-target.md).

---

## Impl Phase 116 — Pitch funnel four-point align (2026-08-19)

**Status:** Done

Plan drafted as Impl 115; series rating star hit cells took 115. This ships as **116**. Pitch form episode min 3 (matches handbook). `intent=submit` handbook link to `/creators#creators-specs`. FAQ `a14` no in-portal upload. Creators after-send: no published reply SLA. Note: [2026-08-19-creators-pitch-align.md](../notes/2026-08-19-creators-pitch-align.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 117 — Popular rank hang-overlap (2026-08-19)

**Status:** Done

Home Popular numbers were `text-6xl` beside the cover. Chart `RankMark` now hangs off the cover bottom-left (outside `.book-media` overflow): `text-4xl font-black`, same size for 1–6, title row `pl-12`. Matches WEBTOON overlap geometry without fake ▲/▼ deltas (no week-rank metric). 2-column chart of 6 kept. Categories tile ranks stay bottom-right (status lives bottom-left). Gist 3 Updated vs New split untouched. Note: [2026-08-19-popular-rank-overlap.md](../notes/2026-08-19-popular-rank-overlap.md).

---

## Impl Phase 118 — 404 recovery to hand-off bar (2026-08-19)

**Status:** Done

Unknown URLs, missing series, and missing episodes share one recovery (`NotFoundPage` variants). SearchAutocomplete, guest-safe destinations (no Library), demo 3:4 BookCards, Help/Contact. SEO noindex, no JSON-LD, no canonical. No homepage redirect. Note: [2026-08-19-404-recovery.md](../notes/2026-08-19-404-recovery.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md), [portal-seo.md](../conventions/portal-seo.md).

---

## Impl Phase 119 — Popular ranks inside the cover (2026-08-19)

**Status:** Done

Replaces Impl 117 hang-into-title. One RankMark inside `.book-media` (bottom-left, `primary-600`, white stroke, `text-2xl sm:text-3xl`). Home Popular uses the same 6-up grid as Trending, still an `<ol>`. Skeleton Popular is six ranked covers. Categories `?sort=popular` matches; status moves to bottom-right while ranked. No fake week-delta arrows. Gist 3 untouched. Note: [2026-08-19-popular-rank-on-cover.md](../notes/2026-08-19-popular-rank-on-cover.md).

---

## Impl Phase 120 — Help hub layout + Footer FAQ (2026-08-19)

**Status:** Done

Footer Support names Help Center, FAQ, and Contact. Help hub body fills the 7xl shell (topic card, browse-all → `/faq`, popular, creators | need-more 2-col). Compact left header and `max-w-3xl` search stay. FAQ inner `max-w-3xl` and Contact unchanged. Note: [2026-08-19-help-hub-footer-faq.md](../notes/2026-08-19-help-hub-footer-faq.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md).

---

## Impl Phase 121 — 404 recovery page polish (2026-08-19)

**Status:** Done

Plan drafted as Impl 120; Help hub took 120. Nine page items on the Impl 118 recovery. Reader miss uses `withSiteChrome`. Go here is Categories / Popular / New. Still need help is Help + Contact. No inner `min-h-screen`. Search heading. SEO omits keywords, `og:image`, Twitter. Dead 404 keys removed. MM copy no longer mixes `catalog` / `Live`. HTTP 404 stays a later host Impl. Note: [2026-08-19-404-recovery-polish.md](../notes/2026-08-19-404-recovery-polish.md). Convention: [info-page-chrome.md](../conventions/info-page-chrome.md), [portal-seo.md](../conventions/portal-seo.md).

---

## Impl Phase 122 — Popular rank bottom-left cover pocket (2026-08-19)

**Status:** Done

Corner wash on the digit only showed on skeleton. Ranked covers now clip a bottom-left pocket (`--rank-pocket: 2.5rem`); `RankMark` sits in that hole as a sibling of the hardcover, same primary + stroke as Impl 119. Hover lifts frame + number. Home skeleton matches. Categories Popular matches. Gist 3 untouched. Note: [2026-08-19-popular-rank-pocket.md](../notes/2026-08-19-popular-rank-pocket.md). Convention: [catalog-tiles.md](../conventions/catalog-tiles.md).

---

## Impl Phase 123 — Host HTTP 404 for unknown SPA paths (2026-08-19)

**Status:** Done

Unknown path shapes return HTTP 404 on Vercel via post-build `dist/404.html` (copy of `index.html`) so the React recovery page still paints. Known SPA routes in `SPA_REWRITE_SOURCES` rewrite to `/index.html` (200). No catch-all rewrite (that 200s junk URLs). No homepage redirect. Catalog id misses stay 200 + React recovery. `npm run dev` stays 200. Note: [2026-08-19-host-http-404.md](../notes/2026-08-19-host-http-404.md). Convention: [portal-seo.md](../conventions/portal-seo.md).

---

## Impl Phase 124 — Popular rank white glyph on the cover (2026-08-19)

**Status:** Done

Deleted the Impl 122 square pocket. Rank is only the numeral: white fill in the digit shape + primary-600 stroke (`#0e9494`) on a full 3:4 hardcover. No hang, no title indent. Home skeleton and Categories Popular match. Gist 3 untouched. Note: [2026-08-19-popular-rank-glyph.md](../notes/2026-08-19-popular-rank-glyph.md). Convention: [catalog-tiles.md](../conventions/catalog-tiles.md).

---

## Impl Phase 125 — Popular rank white offset kick (2026-08-19)

**Status:** Done

Concentric stroke stayed. `RankMark` adds a hard down-right white `text-shadow` (`1px 2px 0 #fff`, no blur) so the digit has a kick without becoming a box, wash, or hang. Note: [2026-08-19-popular-rank-glyph-kick.md](../notes/2026-08-19-popular-rank-glyph-kick.md). Convention: [catalog-tiles.md](../conventions/catalog-tiles.md).

---

## Impl Phase 126 — Legal pages layered notice + honesty (2026-08-19)

**Status:** Done

Privacy, Terms, and Cookies share `LegalPageShell`: Help-identical wash, related-policy strip, At a glance, mailto + `/contact`, one `LEGAL_EFFECTIVE_DATE` (19 Aug 2026). Cookies storage table lists every real key including `softgate_engage_v1`, `softgate_accounts_v1`, and `softgate-shared-data`. Privacy rights link `/profile?tab=security`. Terms add Changes + guest vs signed-in. No cookie CMP or US arbitration. Note: [2026-08-19-legal-layered-notice.md](../notes/2026-08-19-legal-layered-notice.md). Convention: [legal-pages.md](../conventions/legal-pages.md).

---

## Impl Phase 127 — Popular rank white lip follows digit geometry (2026-08-19)

**Status:** Done

Impl 125 `text-shadow` was not visible under the 3px stroke. `RankMark` is two copies of the same digit: a white `scale-[1.2]` lip behind white fill + primary stroke. No hang, no box. Note: [2026-08-19-popular-rank-glyph-lip.md](../notes/2026-08-19-popular-rank-glyph-lip.md). Convention: [catalog-tiles.md](../conventions/catalog-tiles.md).

---

## Impl Phase 128 — Legal TOC thin primary scrollbar (2026-08-19)

**Status:** Done

Legal TOC pane (`max-h-[50vh] overflow-y-auto`) uses `@utility scrollbar-thin-primary` (thin rounded primary thumb) instead of the Windows default bar. Privacy / Terms / Cookies share `LegalTocSidebar`. Document `html` scrollbar stays hidden. Note: [2026-08-19-legal-toc-scrollbar.md](../notes/2026-08-19-legal-toc-scrollbar.md). Conventions: [legal-pages.md](../conventions/legal-pages.md), [portal-scroll-chrome.md](../conventions/portal-scroll-chrome.md).

---

## Impl Phase 129 — Home Updated vs New split (2026-08-19)

**Status:** Done

Gist 3: Home Updated excludes New-rail ids; honesty copy + Clock/Sparkles; Updated tiles (and Categories recentlyUpdated) print `updatedAt`. No fake Daily. Note: [2026-08-19-updated-new-split.md](../notes/2026-08-19-updated-new-split.md). Convention: [catalog-tiles.md](../conventions/catalog-tiles.md), [discovery-honesty.md](../conventions/discovery-honesty.md).

---

## Impl Phase 130 — Series hub Continue, tags, thumbs, related (2026-08-19)

**Status:** Done

Series detail: Continue vs Start from published history; Latest when it is not the primary target; HeroBook3D matches primary; genre → `/categories/:slug`; tags → search; author other-works rail; related heading You may also like; landscape episode thumbs with mobile date/views; unpublished reader 404. Note: [2026-08-19-series-hub.md](../notes/2026-08-19-series-hub.md). Convention: [series-hub.md](../conventions/series-hub.md).

---

## Impl Phase 131 — Search destination empty landing (2026-08-19)

**Status:** Done

Empty `/search` is a discovery destination: visible h1, Browse genres, recent + Clear, Go here, Popular/New rails. Webtoons-tab chips; richer author/episode hits; 404-class no-results. Note: [2026-08-19-search-destination.md](../notes/2026-08-19-search-destination.md). Convention: [in-app-search.md](../conventions/in-app-search.md).

---

## Impl Phase 132 — Categories polish search SEO empty recovery (2026-08-19)

**Status:** Done

Header search submits to `/search`. SEO uses browse description and path-only URL. Genre `h1` when no sort query. Count line includes genre/status. Empty recovery matches 404 plus Clear filters. Note: [2026-08-19-categories-polish.md](../notes/2026-08-19-categories-polish.md). Convention: [categories-browse.md](../conventions/categories-browse.md).

---

## Impl Phase 133 — Reader chrome episode sheet prefs keyboard (2026-08-19)

**Status:** Done

Episode List Modal of published episodes; device prefs `softgate_reader_prefs_v1`; Cookies Reader display row; ArrowLeft/Right; comments count; Fit vs Full width on the strip stack. Note: [2026-08-19-reader-chrome.md](../notes/2026-08-19-reader-chrome.md). Convention: [reader-chrome.md](../conventions/reader-chrome.md).

---

## Impl Phase 134 — Guest Start here rail (2026-08-19)

**Status:** Done

When Continue is empty, Home fills that slot with a Start here catalog rail: free published episode 1, Hero ids excluded, cards open `/read/:id/1`. Continue XOR Start here. Popular stays a chart. Bottom Get started free unchanged. Note: [2026-08-19-guest-start-here.md](../notes/2026-08-19-guest-start-here.md). Conventions: [guest-access.md](../conventions/guest-access.md), [discovery-honesty.md](../conventions/discovery-honesty.md), [continue-reading.md](../conventions/continue-reading.md).

---

## Impl Phase 135 — Author profile `/author/:id` (2026-08-19)

**Status:** Done

Catalog creator profile at `/author/:id`. Hub chip, Search authors tab, and autocomplete author hits go there. Series count is published titles. Hub episode stat uses published length. Schema stays 8. Note: [2026-08-19-author-profile.md](../notes/2026-08-19-author-profile.md). Convention: [author-profile.md](../conventions/author-profile.md).

---

## Impl Phase 136 — Auth reading room (2026-08-19)

**Status:** Done

Plan B reading-room auth: desk photos, 7xl shell, real `/login` `/register` `/forgot-password` `/reset-password` routes. Forgot is an email → mock OTP → new password stepper that does not send mail or persist password. Token reset is a future mail-link shell. Note: [2026-08-19-auth-reading-room.md](../notes/2026-08-19-auth-reading-room.md). Convention: [client-auth.md](../conventions/client-auth.md).

---

## Impl Phase 137 — Hero heading and duplicate CTA (2026-08-19)

**Status:** Done

Home `h1` is `home.pageHeading` (site identity). Spotlight kicker is an eyebrow `<p>`. Series title is `h2`. Home 3D cover is pointer-only (not a second SR/keyboard Start Reading). Detail cover stays a tabbable link. Note: [2026-08-19-hero-heading-cta.md](../notes/2026-08-19-hero-heading-cta.md). Convention: [hero-spotlight.md](../conventions/hero-spotlight.md).

---

## Impl Phase 138 — Reader swipe + pinch (2026-08-19)

**Status:** Done

Touch/pen swipe on the reader strip changes episode; pinch CSS-scales 1–3 at the pinch midpoint; double-tap resets. Session-only zoom. Overlays block gestures like arrows. Guests keep gestures. Note: [2026-08-19-reader-gestures.md](../notes/2026-08-19-reader-gestures.md). Convention: [reader-chrome.md](../conventions/reader-chrome.md).

---

## Impl Phase 139 — Nav Login carries return `from` (2026-08-19)

**Status:** Done

MainLayout guest Login links pass `state={{ from: location }}` so Author, Categories (including query), and other in-app pages return after sign-in. Login/Register already consume `safeReturnTo`. ReaderLayout has no Nav. Note: [2026-08-19-nav-login-return.md](../notes/2026-08-19-nav-login-return.md). Conventions: [client-auth.md](../conventions/client-auth.md), [guest-access.md](../conventions/guest-access.md).

---

## Impl Phase 140 — Subscribe + 18+ content rating (2026-08-19)

**Status:** Done

Save → Subscribe (keep `softgate_library_v1`). Mute in-app episode notices. Demo notify when catalog episode number advances after subscribe. Per-title `contentRating`; 18+ Reader gate (account localStorage / guest sessionStorage). Schema **9**. Note: [2026-08-19-subscribe-age-gate.md](../notes/2026-08-19-subscribe-age-gate.md). Conventions: [library-bookmarks.md](../conventions/library-bookmarks.md), [content-rating.md](../conventions/content-rating.md).

---

## Impl Phase 141 — Categories browse + `/ranking` path (2026-08-19)

**Status:** Done

`/ranking` is the all-genre numbered Popular catalog. Browse (`/categories`) sorts by `viewCount` without ranks. Home genre chips use `/categories/:slug`. Unknown genre slug is React 404. Pagination logic exists; UI hidden at ≤24 titles. Note: [2026-08-19-categories-ranking-browse.md](../notes/2026-08-19-categories-ranking-browse.md). ADR: [006-ranking-path.md](../decisions/006-ranking-path.md). Convention: [categories-browse.md](../conventions/categories-browse.md).

---

## Impl Phase 142 — Account hub to hand-off bar (2026-08-19)

**Status:** Done

Signed-in hub (Profile Settings/Preferences, Notifications, Coins honesty, Library History Continue) to the prelaunch bar. Password min 8. Empty-first inbox; notification prefs in `softgate_notif_prefs_v1`. No live mail, IAP, or push. Note: [2026-08-19-account-hub.md](../notes/2026-08-19-account-hub.md).

---

## Impl Phase 143 — Categories chart chrome (2026-08-19)

**Status:** Done

Ranked catalog grids (`/ranking`, `?sort=popular`) are `<ol>` with RankMark-on-cover, numbered-chart eyebrow, and masthead `radial-wash-primary`. Filters stick below nav via `sticky-below-nav`. Header search removed. Genre chips `min-h-11` without `uppercase`. Note: [2026-08-19-categories-chart-chrome.md](../notes/2026-08-19-categories-chart-chrome.md). Convention: [categories-browse.md](../conventions/categories-browse.md).

---

## Impl Phase 144 — Hub series comments (2026-08-19)

**Status:** Done

Series hub has a series discussion thread keyed `id:series`, stored in `softgate_comments_v1` schema 1 next to episode `id:N`. Guest reads; write requires login. Reader episode comments stay isolated. Note: [2026-08-19-hub-comments.md](../notes/2026-08-19-hub-comments.md). Conventions: [series-hub.md](../conventions/series-hub.md), [client-comments-notifications.md](../conventions/client-comments-notifications.md).

---

## Impl Phase 145 — Search Demo searches chips (2026-08-19)

**Status:** Done

Empty `/search` has frozen Demo search chips above Browse genres. Honesty copy: not live trends. Chips run `?q=`. Not Home Trending. Note: [2026-08-19-search-demo-trending.md](../notes/2026-08-19-search-demo-trending.md). Convention: [in-app-search.md](../conventions/in-app-search.md).

---

## Impl Phase 146 — Auth portal split-card (2026-08-19)

**Status:** Done

Login/register: portal wash + one card; reading-room photo slides as the 50% pane (0.65s). No full-bleed page photo. No OAuth. Forgot/reset stay a plain form card. Note: [2026-08-19-auth-split-card.md](../notes/2026-08-19-auth-split-card.md). Convention: [client-auth.md](../conventions/client-auth.md).

---

## Impl Phase 147 — Home For You rail (2026-08-19)

**Status:** Done

Home For You from Subscribe, likes, and history, then same-genre neighbors by stable id. Guest / empty hide. Not Ranking. Note: [2026-08-19-for-you.md](../notes/2026-08-19-for-you.md). Convention: [discovery-honesty.md](../conventions/discovery-honesty.md).

---

## Impl Phase 148 — Author Follow on catalog profiles (2026-08-19)

**Status:** Done

Author profile Follow / Following via `softgate_follows_v1`. Guest → login `from`. No public `followerCount`. Not series Subscribe. Note: [2026-08-19-author-follow.md](../notes/2026-08-19-author-follow.md). Convention: [author-profile.md](../conventions/author-profile.md).

---

## Impl Phase 149 — Auth split-card photo curtain (2026-08-19)

**Status:** Done

Login and register forms stay glued (left / right 50%). Only the reading-room photo translates. No form `translate`. Split card does not render `Outlet`. Note: [2026-08-19-auth-split-curtain.md](../notes/2026-08-19-auth-split-curtain.md). Convention: [client-auth.md](../conventions/client-auth.md).

---

## Impl Phase 150 — Home Daily weekday board (2026-08-19)

**Status:** Done

Home Daily after Trending, before Updated. `uploadDay` `0–6` (`Date.getDay()`), ongoing only, Demo Mon–Sun assignment, schema **10**. Sort `viewCount`. Not `updatedAt`. No View all. No wait-for-free clock. Note: [2026-08-19-daily.md](../notes/2026-08-19-daily.md). Convention: [discovery-honesty.md](../conventions/discovery-honesty.md).

---

## Impl Phase 151 — Wait-for-free on premium episodes (2026-08-19)

**Status:** Done

Premium episodes may list `freeAt`. After that time they are readable without coins. Coins still skip the wait for signed-in readers. Not Daily `uploadDay`. Not a 23:59 clock. Schema **11**. Note: [2026-08-19-wait-for-free.md](../notes/2026-08-19-wait-for-free.md). Convention: [client-wallet.md](../conventions/client-wallet.md).

---

## Impl Phase 152 — Catalog Premium chip to top-left (2026-08-19)

**Status:** Done

Catalog cover Premium chip moves to the top-left column with New (`gap-1`). Rating + age stay top-right. Same `span` chrome; not a button. One `CatalogBookCard` change. Note: [2026-08-19-catalog-premium-left.md](../notes/2026-08-19-catalog-premium-left.md). Convention: [catalog-tiles.md](../conventions/catalog-tiles.md).

---

## Impl Phase 153 — Home Daily upcoming episode drops (2026-08-19)

**Status:** Done

Home Daily lists unpublished `Episode.scheduledAt` drops by Yangon weekday. Cards are not links. Countdown on the cover bottom lip; episode + Yangon time under the cover. Published leaves Daily; overdue stays Publishing soon. Hub Next drop uses the global soonest scheduled episode. Schema **12**. Note: [2026-08-19-daily-drops.md](../notes/2026-08-19-daily-drops.md). Convention: [discovery-honesty.md](../conventions/discovery-honesty.md), [catalog-tiles.md](../conventions/catalog-tiles.md), [series-hub.md](../conventions/series-hub.md).

---

## Impl Phase 154 — Daily / Updated / New Demo honesty (2026-08-19)

**Status:** Done

Demo seed retuned so Home Updated is older series with later `updatedAt` (Shadow / Horizon / Golden Age). New six-pack stays launch windows. Copy names episode vs series. Demo omits `uploadDay`; type stays optional. Schema **13**. Selectors and Daily `scheduledAt` unchanged. Note: [2026-08-19-discovery-time-family.md](../notes/2026-08-19-discovery-time-family.md). Convention: [discovery-honesty.md](../conventions/discovery-honesty.md), [catalog-tiles.md](../conventions/catalog-tiles.md).

---

## Impl Phase 155 — Skeleton layout (155a) + production contract (155b) (2026-08-21)

**Status:** Done

One Impl number, two same-day passes. **155a** layout: guest Home, Daily lip, hub comments, Library/Author bones ([2026-08-21-page-skeletons-match-live.md](../notes/2026-08-21-page-skeletons-match-live.md)). **155b** contract: CatalogStatus, cover `imageLoaded` setters, extra page skeletons, reader prefetch; sheen added then reverted in 156 ([2026-08-21-skeleton-production-contract.md](../notes/2026-08-21-skeleton-production-contract.md)). Route page skeletons (no splash). Continue / For You / related rails omitted (CLS). Convention: [loading-states.md](../conventions/loading-states.md). Docs map: [2026-08-21-skeleton-docs-truth.md](../notes/2026-08-21-skeleton-docs-truth.md).

---

## Impl Phase 156 — Restore skeleton pulse, remove sheen (2026-08-21)

**Status:** Done

Skeleton primitive is Tailwind `animate-pulse` again. Sheen CSS, `coverSheenClass`, and unused `SkeletonLibraryCard` removed. Cover overlays (BookCard, DailyDropCard, HeroBook3D, Author avatar) pulse until `onLoad`. **155a** section order unchanged. **155b** extras (CatalogStatus, setters, extra page skeletons, reader prefetch) stayed. Note: [2026-08-21-skeleton-pulse-restore.md](../notes/2026-08-21-skeleton-pulse-restore.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 157 — Lock skeleton docs to pulse + current contract (2026-08-21)

**Status:** Done

Docs-only. Wiki + session match current code: pulse (no sheen); 155a layout vs 155b contract labeled; hub omits Other works; CatalogStatus sits above nav. No `src/` changes. Note: [2026-08-21-skeleton-docs-truth.md](../notes/2026-08-21-skeleton-docs-truth.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 158 — Lock Daily skeleton cap (2026-08-21)

**Status:** Done

Docs-only. Home Daily skeleton (155a bones, unchanged) is **7** weekday chips + **6** `SkeletonDailyDropCard` lip bones (index 0–5) as **cap / reserved slots**, not a promised count. Empty/`dailyEmpty` after catalog load only. Do not bind Demo 1–3. No `src/` changes. Note: [2026-08-21-daily-skeleton-cap.md](../notes/2026-08-21-daily-skeleton-cap.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 159 — Match Home hero skeleton chrome (2026-08-21)

**Status:** Done

Home hero skeleton reuses live static `/banner/banner.png` plus the gray-950 gradient overlay. `bg-gray-950` is banner-layer fallback only (not a solid black section). Dark-tone bones and `z-10` copy column kept. Genre chips and catalog rails stay white. Daily and Continue / For You untouched. Note: [2026-08-21-hero-skeleton-chrome.md](../notes/2026-08-21-hero-skeleton-chrome.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 160 — Home skeleton Continue / For You by session (2026-08-21)

**Status:** Done

Home catalog skeleton follows session: guest = Start here only; signed-in = Continue xor Start here plus For You 6 as cap. Continue bones are a horizontal cap-12 shelf. Catalog-loading paint uses `readSession` + `listHistory` (not `EngagementContext.history`). Hero 159 and Daily 158 unchanged. Note: [2026-08-21-home-skeleton-auth-rails.md](../notes/2026-08-21-home-skeleton-auth-rails.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 161 — Unhook account pages from catalog loading (2026-08-21)

**Status:** Done

Profile and Notifications no longer wait on catalog `isLoading`; skeleton files stay on disk. Coins page skeleton is off the route; Buy / wallet paint immediately. Unlock titles show one row bone per wallet key while catalog joins (`coins-unlocked-pending`), not a fake empty state. Library stays catalog-gated. Note: [2026-08-21-account-skeleton-triggers.md](../notes/2026-08-21-account-skeleton-triggers.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 162 — Search landing live chrome + Reader chrome (2026-08-22)

**Status:** Done

Search no-query catalog wait paints live h1, search field, demo chips, recent from localStorage, and Go here. Genre chips (8) and Popular / New Releases cards (`DISCOVERY_RAIL_CAP` 6) stay reserved bones. Query 12-card branch unchanged (reserved cap). Reader skeleton matches live header/footer from reader prefs; close uses route series id; strip height stays unguessed. Categories wash/chevron parked. Note: [2026-08-22-search-reader-skeleton-chrome.md](../notes/2026-08-22-search-reader-skeleton-chrome.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 163 — Search query live chrome (2026-08-22)

**Status:** Done

Search hasQuery catalog wait paints live h1, filled search field, clear, tabs without counts, status, All genres, and sort. Named genre chips (8) and result lists stay reserved bones (webtoons 12 / authors 6 / episodes 6 caps). Busy region does not wrap the search field. Landing 162, Categories wash/chevron, and reader strip stay parked. Note: [2026-08-22-search-query-skeleton-chrome.md](../notes/2026-08-22-search-query-skeleton-chrome.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 164 — Categories skeleton live chrome (2026-08-22)

**Status:** Done

Categories catalog wait paints live masthead from the sort job (ranked wash plus Numbered chart / Popular). Status and sort stay live from the URL. Genre names stay 8 reserved bones with no overflow chevron; count stays a bone; 24 cards and ranks unchanged. Search 162/163 and Reader strip parked. Note: [2026-08-22-categories-skeleton-chrome.md](../notes/2026-08-22-categories-skeleton-chrome.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 165 — Reader first-panel fetchpriority + async decode (2026-08-23)

**Status:** Done

Live strip panel 0 is eager with `fetchPriority` high; panel 1 stays eager without high; later panels stay lazy; all successful panels use `decoding="async"` and `h-auto`. No guessed skeleton strip height, no `width`/`height` attrs, no shared schema change. Note: [2026-08-23-reader-panel-priority.md](../notes/2026-08-23-reader-panel-priority.md). Convention: [reader-chrome.md](../conventions/reader-chrome.md).

---

## Impl Phase 166 — Reader imageSizes consume + Admin wiki item 21 (2026-08-23)

**Status:** Done

Optional `Episode.imageSizes?`; live `<img width height>` only when both integers > 0; Demo omits sizes; `applyCatalogSeed` unchanged in this Impl. At ship, Admin item 21 was markdown only; Admin persist later shipped as Admin Impl **27**. CLS ≤ 0.1 not claimed. Note: [2026-08-23-reader-panel-sizes.md](../notes/2026-08-23-reader-panel-sizes.md). Convention: [reader-chrome.md](../conventions/reader-chrome.md).

---

## Impl Phase 167 — Trust stored catalog (stop seed wipe) (2026-08-23)

**Status:** Done

`applyCatalogSeed` is identity. Schema **13** stored catalog (Admin + `imageSizes`) survives load. Empty catalogs stay empty. Demo refresh stays schema bump / first-run mocks. Admin persist is Impl **27** shipped. CLS ≤ 0.1 not claimed (QA measure of a sized episode). Note: [2026-08-23-trust-stored-catalog.md](../notes/2026-08-23-trust-stored-catalog.md). Convention: [discovery-honesty.md](../conventions/discovery-honesty.md).

---

## Impl Phase 168 — Consume Admin coinPackages on /coins (2026-08-23)

**Status:** Done

`/coins` reads optional `SharedData.coinPackages` from `softgate-shared-data` (schema 13). Missing / non-array → `coinData.ts` six packs. `[]` → empty shop. Invalid rows skipped; metal/glow derived in the UI only. Checkout still `demoTopUp(coins+bonus)`. Schema not bumped. Admin repo untouched. Note: [2026-08-23-portal-coin-packages.md](../notes/2026-08-23-portal-coin-packages.md).

---

## Impl Phase 169 — Reserved genre-rail chevron slot (2026-08-23)

**Status:** Done

`GenreRailChevron` always reserves the right min-size slot on Categories, Home Genres, and Search landing. The Show more genres button paints only when `canScrollRight`. Skeletons use the inert slot only. Home Continue stays conditional. Search hasQuery has no this slot. Guessed Reader strip and CLS ≤ 0.1 stay unclaimed. Note: [2026-08-23-genre-rail-chevron-slot.md](../notes/2026-08-23-genre-rail-chevron-slot.md). Conventions: [categories-browse.md](../conventions/categories-browse.md), [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 170 — Portal monorepo plumbing (2026-08-24)

**Status:** Done

pnpm workspaces + Turborepo on this portal repo. Vite app lives at `apps/portal`. `@softgate/contracts` is a Zod envelope skeleton. `@softgate/shared` is unchanged catalog types/mock. No `apps/api`. Catalog still localStorage. Admin dashboard repo untouched. Note: [2026-08-24-monorepo-workspace.md](../notes/2026-08-24-monorepo-workspace.md).

---

## Impl Phase 171 — API skeleton (2026-08-24)

**Status:** Done

`apps/api` is a Hono Node TypeScript skeleton (`@softgate/api`). `GET /health` returns the contracts envelope with `persist: "stub"`. Env validation, CORS allowlist (`CLIENT_URL` plus optional `ADMIN_URL`), and TLS-ready cookie helpers ship; health does not set cookies. No `/api/data`, Prisma, R2, or Brevo runtime. Portal catalog stays localStorage. Named later: PostgreSQL + Prisma, Cloudflare R2, Brevo. Note: [2026-08-24-api-skeleton.md](../notes/2026-08-24-api-skeleton.md). ADR: [007-backend-integrations.md](../decisions/007-backend-integrations.md).

---

## Impl Phase 172 — Portal catalog HTTP read (2026-08-24)

**Status:** Done

When `VITE_USE_MOCK_API=false`, portal `DataContext` `GET`s `/api/catalog` (published read model: webtoons, episodes, authors, genres, optional `coinPackages`). Envelope `{ data }` via `@softgate/contracts`. No whole-`SharedData` `PUT` / `/api/data` (still 404). Mock default still uses schema-13 localStorage. Persist remains stub; `publishedCatalogFrom` filters drafts and keeps scheduled + premium images. `applyCatalogSeed` stays identity. Note: [2026-08-24-catalog-http-read.md](../notes/2026-08-24-catalog-http-read.md). Convention: [portal-catalog-read.md](../conventions/portal-catalog-read.md).

---

## Impl Phase 173 — Portal settings HTTP read (2026-08-24)

**Status:** Done

Portal consumes `maintenanceMode`, `allowRegistration`, and `contactEmail` from `GET /api/settings` when mock is off. Stub persist returns Admin seed defaults (`contactEmail: admin@softgatecomic.com`). Mock keeps registration open and uses fallback `support@softgatecomic.com` when email is missing. Maintenance closes catalog/reader/account surfaces; `/login` and info/legal stay open. `/register` is gated. `defaultLanguage` is on the payload and unused. Note: [2026-08-24-settings-http-read.md](../notes/2026-08-24-settings-http-read.md). Convention: [portal-settings-read.md](../conventions/portal-settings-read.md).

---

## Impl Phase 174 — Reader auth httpOnly cookie (2026-08-24)

**Status:** Done

Reader register/login/logout/me/refresh on `apps/api` with bcryptjs hashes and `sg_reader` / `sg_reader_refresh` httpOnly cookies. Portal mock still uses localStorage accounts; `VITE_USE_MOCK_API=false` uses the cookie API as source of truth. Profile write APIs are not in this Impl (`AUTH_PROFILE_NOT_LIVE`). Guest access unchanged. Persist users are in-memory stub. Note: [2026-08-24-reader-auth-cookie.md](../notes/2026-08-24-reader-auth-cookie.md). Convention: [portal-auth-http.md](../conventions/portal-auth-http.md).

---

## Impl Phase 175 — Wallet authority + paywall strip (2026-08-24)

**Status:** Done

Stub wallet ledger + paywall image strip on `apps/api` when mock is off. `GET /api/catalog` optional cookie (never 401) empties locked premium `images` and keeps `imageSizes`. `GET/POST /api/wallet/*` seed 150, Demo top-up, unlock by server `coinPrice`. Portal mock still uses `softgate_wallet_v1`. HTTP does not write that key. Guest wait-for-free unchanged. Note: [2026-08-24-wallet-paywall-strip.md](../notes/2026-08-24-wallet-paywall-strip.md). Convention: [portal-wallet-http.md](../conventions/portal-wallet-http.md).

---

## Impl Phase 176 — Named integration slots (2026-08-25)

**Status:** Done

Optional env slots for PostgreSQL, Cloudflare R2, and Brevo plus a Prisma 6 schema mirroring stub users/wallet/refresh. Runtime persist stays `kind: "stub"` even when `DATABASE_URL` is set. No migrate, no `@prisma/client` persist, no R2/Brevo SDKs, no portal change. Note: [2026-08-25-named-integration-slots.md](../notes/2026-08-25-named-integration-slots.md). Convention: [named-integrations.md](../conventions/named-integrations.md).

---

## Impl Phase 177 — Love in Seoul MM title + schema 14 (2026-08-25)

**Status:** Done

Demo series id `2` MM title is `ဆိုးလ်မြို့က ချစ်ခြင်းတရား`. EN and cover path unchanged. Envelope **14** so stored catalogs pick up the seed (`applyCatalogSeed` stays identity). Forest Spirit and other cover-brand MMs stay Latin. Admin repo untouched. Note: [2026-08-25-love-in-seoul-mm-title.md](../notes/2026-08-25-love-in-seoul-mm-title.md). Convention: [catalog-tiles.md](../conventions/catalog-tiles.md), [discovery-honesty.md](../conventions/discovery-honesty.md).

---

## Impl Phase 178 — Vite SSR/hybrid infrastructure (2026-08-25)

**Status:** Done

Public routes server-rendered on the existing Vite 6 + React Router 6 stack (no framework swap). SSR-safety pass (i18n `document` guard, `DataContext` seed → effect, `CommentsThread`/`HeroSpotlight` deterministic initializers), `entry-client`/`entry-server` split with per-request i18n clone and `SsrResponseContext` real 404s, `index.html` placeholders, `server/dev.ts` + `server/index.ts` (Hono), Vercel `api/ssr.ts` + rewrites, `template.html` rename. Node-env `SsrRenderSmoke` tests. Note: [2026-08-25-perfect-seo-ssr-hybrid.md](../notes/2026-08-25-perfect-seo-ssr-hybrid.md). Convention: [portal-seo-ssr.md](../conventions/portal-seo-ssr.md).

---

## Impl Phase 179 — Server meta + JSON-LD + dynamic sitemap (2026-08-25)

**Status:** Done

Explicit `path`-derived canonicals (no `window.location` fallback), reader `noindex, follow` with no JSON-LD. `ComicSeries` + `BreadcrumbList` on hubs, `WebSite` + `SearchAction` + `Organization` on home; `Book`/`Article` builders removed. Dynamic `/sitemap.xml` from the shared catalog (`lastmod`, cover images, hreflang alternates) via build script + dev route; static sitemap deleted; `robots.txt` disallows `/read/` + private/auth for both locales. Note: [2026-08-25-perfect-seo-ssr-hybrid.md](../notes/2026-08-25-perfect-seo-ssr-hybrid.md). Conventions: [portal-seo-ssr.md](../conventions/portal-seo-ssr.md), [portal-seo.md](../conventions/portal-seo.md).

---

## Impl Phase 180 — /mm locale URLs + hreflang (2026-08-25)

**Status:** Done

Myanmar mounted at `/mm/` via router `basename`; URL prefix is the public-page language source of truth (no Accept-Language redirect). `lib/locale/` helpers + `LocaleProvider`; `SEO.tsx` emits self-referencing canonical, `hreflang` `en`/`my`/`x-default`, `og:locale` `en_US`/`my_MM`; server sets `<html lang>` (`my` BCP47). `LanguageSwitcher` navigates to the alternate-locale URL. Note: [2026-08-25-perfect-seo-ssr-hybrid.md](../notes/2026-08-25-perfect-seo-ssr-hybrid.md). Convention: [portal-seo-ssr.md](../conventions/portal-seo-ssr.md).

---

## Impl Phase 181 — Series OG image generation (2026-08-25)

**Status:** Done

`scripts/generate-og-images.ts` (sharp) composes 1200x630 per published series — blurred cover background, brand gradient, rounded cover, logo — into `public/og/<id>.png` (9 images). `ogImageForWebtoon` wires hubs to them; other pages keep the logo fallback. Honest demo assets only. Note: [2026-08-25-perfect-seo-ssr-hybrid.md](../notes/2026-08-25-perfect-seo-ssr-hybrid.md). Convention: [portal-seo-ssr.md](../conventions/portal-seo-ssr.md).

---

## Impl Phase 182 — HeroBook3D cover after SSR onLoad miss (2026-08-26)

**Status:** Done

`HeroBook3D` now reveals a cover when `img.complete && naturalWidth > 0` after mount, so SSR/hydration can no longer miss `onLoad` and leave the first spotlight slide (`opacity-0` + gray pulse) blank. `onLoad` / `onError` stay for in-flight decode. Catalog covers and `BookCard` defaults unchanged. Note: [2026-08-26-hero-cover-ssr-onload.md](../notes/2026-08-26-hero-cover-ssr-onload.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 183 — Catalog cover after SSR onLoad miss (2026-08-26)

**Status:** Done

`BookCard` and `DailyDropCard` call `onImageLoad` when `img.complete && naturalWidth > 0` after mount, so SSR/hydration can no longer miss `onLoad` and leave catalog rail covers (`opacity-0` + gray pulse) blank. Default `imageLoaded = true` unchanged. HeroBook3D, layout, badges, copy, Author avatar untouched. Note: [2026-08-26-catalog-cover-ssr-onload.md](../notes/2026-08-26-catalog-cover-ssr-onload.md). Convention: [loading-states.md](../conventions/loading-states.md).

---

## Impl Phase 184 — Local pnpm dev back to Vite SPA (2026-08-27)

**Status:** Done

Portal `dev` is Vite SPA again (`vite`); `dev:ssr` runs `server/dev.ts` for optional local SEO checks. Root `pnpm dev` still proxies portal `dev`. Production Perfect SEO unchanged: `build` + `api/ssr.ts` + `vercel.json`. Note: [2026-08-27-dev-spa-default.md](../notes/2026-08-27-dev-spa-default.md). Convention: [portal-seo-ssr.md](../conventions/portal-seo-ssr.md).

---

## Impl Phase 185 — Prisma persist for reader tables (2026-09-08)

**Status:** Done

Empty `DATABASE_URL` keeps in-memory stub. Non-empty URL + Prisma `$connect` uses reader tables (`ReaderUser`, refresh, wallet, unlocks). Non-empty URL + down Postgres fails boot. `GET /health` `persist` is `"stub"` | `"prisma"`. Catalog/settings stay shared mocks. Local Docker compose + committed migration SQL. `prisma generate` in api build; no migrate in check. Portal mock default unchanged. Note: [2026-09-08-prisma-persist.md](../notes/2026-09-08-prisma-persist.md). Convention: [named-integrations.md](../conventions/named-integrations.md). ADR: [008-prisma-persist-boot.md](../decisions/008-prisma-persist-boot.md).

---

## Impl Phase 186 — R2 helper with portal prefix (2026-09-08)

**Status:** Done

Four core R2 env slots set → S3 `PutObject` under `portal/` on the shared bucket. Empty or partial → `R2_NOT_CONFIGURED`, no send, boot still listens. `R2_PUBLIC_BASE_URL` is the only public origin. No upload HTTP routes. No health R2 field. Note: [2026-09-08-r2-object-store.md](../notes/2026-09-08-r2-object-store.md). Convention: [named-integrations.md](../conventions/named-integrations.md). ADR: [009-r2-object-store.md](../decisions/009-r2-object-store.md).

---

## Impl Phase 187 — Brevo HTML forgot/reset + token API (2026-09-08)

**Status:** Done

Repo HTML (EN+MM) for forgot link and reset confirmation. `BREVO_API_KEY` + `BREVO_FROM_EMAIL` → send via Brevo v6; empty/partial → no send. `POST /api/auth/forgot` always `{ data: { ok: true } }`. `POST /api/auth/reset` updates bcrypt hash and revokes refresh. HTTP portal drops Demo OTP; mock OTP stepper unchanged. No health mail field. No boot ping. Note: [2026-09-08-brevo-forgot-reset.md](../notes/2026-09-08-brevo-forgot-reset.md). Convention: [named-integrations.md](../conventions/named-integrations.md). ADR: [010-brevo-mail.md](../decisions/010-brevo-mail.md).

---

## Impl Phase 188 — Local portal HTTP + profile writers (2026-09-08)

**Status:** Done

Committed `apps/portal/.env.example` is `VITE_USE_MOCK_API=false`. `isMockApi()` stays `!== 'false'` (Vercel unset = mock). Vite does not load the example. Local `pnpm dev` HTTP uses gitignored `.env.development.local` (not `.env`, which Vitest also loads). Cookie POSTs `/api/auth/profile`, `/password`, `/delete-account` on stub + Prisma persist. HTTP Profile copy no longer says “this device.” Note: [2026-09-08-portal-http-local.md](../notes/2026-09-08-portal-http-local.md). Convention: [portal-auth-http.md](../conventions/portal-auth-http.md). ADR: [011-portal-http-local.md](../decisions/011-portal-http-local.md).

---

## Impl Phase 189 — Cap profile avatars at 512 KB jpeg/png/webp (2026-09-08)

**Status:** Done

Profile file picker rejects files over 524288 bytes or not jpeg/png/webp before FileReader. `POST /api/auth/profile` rejects `avatar` that is not a jpeg/png/webp data URL or longer than `ceil(524288 * 4 / 3) + 32`. 400 `VALIDATION_ERROR`. Persist unchanged. No R2, no compress. Note: [2026-09-08-avatar-byte-cap.md](../notes/2026-09-08-avatar-byte-cap.md). Convention: [portal-auth-http.md](../conventions/portal-auth-http.md).

---

## Impl Phase 190 — Library Subscribe, History, Likes HTTP persist (2026-09-08)

**Status:** Done

Cookie API + stub/Prisma persist for Library Subscribe, History (`scrollRatio`, `readEpisodeNumbers`), and Likes when mock is off. HTTP does not write `softgate_library_v1`. History/likes SoT is `/api/library`, not `softgate_engage_v1`. Ratings stay localStorage. Notifications inbox HTTP is Impl 191. Prefs HTTP is Impl 192. Mute and `lastNotifiedEpisodeNumber` persist. `deleteReaderUser` / `clearAuth` drop library rows before `ReaderUser`. Note: [2026-09-08-library-http-persist.md](../notes/2026-09-08-library-http-persist.md). Convention: [portal-library-http.md](../conventions/portal-library-http.md).

---

## Impl Phase 191 — Notifications inbox HTTP persist (2026-09-08)

**Status:** Done

Cookie API + stub/Prisma persist for the notifications inbox when mock is off. HTTP does not write `softgate_notifications_v1`. Prefs HTTP is Impl 192 ([portal-prefs-http.md](../conventions/portal-prefs-http.md)). Client still generates `new_episode` via `syncSubscribeNotifications`; API does not scan catalog. `deleteReaderUser` / `clearAuth` drop notification rows before `ReaderUser`. Note: [2026-09-08-notifications-http-persist.md](../notes/2026-09-08-notifications-http-persist.md). Convention: [portal-notifications-http.md](../conventions/portal-notifications-http.md).

---

## Impl Phase 192 — Notif toggles + reader prefs HTTP persist (2026-09-08)

**Status:** Done

Cookie API + stub/Prisma persist for notification toggles and reader display prefs when mock is off. HTTP logged-in does not write `softgate_notif_prefs_v1` or `softgate_reader_prefs_v1`. Guest reader keeps the device reader key. No login merge. Do not seed. GET returns defaults without insert. `deleteReaderUser` / `clearAuth` drop prefs before `ReaderUser`. Note: [2026-09-08-prefs-http-persist.md](../notes/2026-09-08-prefs-http-persist.md). Convention: [portal-prefs-http.md](../conventions/portal-prefs-http.md). Git `main` / `development` is documented in [02-workflow.md](../02-workflow.md) (not a numbered Impl).

---

## Impl Phase 193 — Leader dev env mapping (2026-09-08)

**Status:** Done

Map leader **dev** JWT / R2 / Brevo onto existing `apps/api` slots in gitignored local env. Omit `DATABASE_URL` until the database name is known (set URL + down Postgres fails boot). No `R2_ENDPOINT`. Sender name stays SoftGate Comic. Runtime TypeScript unchanged. Catalog/CMS, mock-off, migrate, Vercel, and prod keys stay out. Note: [2026-09-08-leader-dev-env-mapping.md](../notes/2026-09-08-leader-dev-env-mapping.md). Convention: [named-integrations.md](../conventions/named-integrations.md).

---

## How to append

1. Take **next free Impl** (currently **194**).
2. Add a row to Quick index + a `## Impl Phase N` section here.
3. Mirror in `wiki/notes/YYYY-MM-DD-<slug>.md` and `docs/sessions/YYYY-MM-DD-session-summary.md` with `phases: [N]`.
4. Lark Title should start with `Impl N — …` for new work going forward (do not backfill historical Lark tasks unless asked).
