---
title: Loading states (UI state stack)
type: convention
date: 2026-08-22
tags:
  [
    loading,
    skeleton,
    spinner,
    empty-state,
    a11y,
    pulse,
    softgate,
    impl-68,
    impl-155,
    impl-156,
    impl-157,
    impl-158,
    impl-159,
    impl-160,
    impl-161,
    impl-162,
    impl-163,
    impl-164,
    impl-210,
  ]
---

# Loading states

Every async surface resolves through the UI state stack: **loading → (empty | error | ideal)**. Never conflate them (the old `isLoading || list.length === 0` HomePage guard produced an infinite spinner on legitimately empty data).

## Pattern per situation

| Situation                                                  | Pattern                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content page, predictable layout (`DataContext.isLoading`) | Live always-on chrome + [`CatalogBusyPanel`](../../apps/portal/src/components/CatalogBusyPanel/CatalogBusyPanel.tsx) wells. Do not invent book-card grids.                                                                                                                                                                                                                                                                       |
| Form submit / auth action                                  | `Button isLoading` inline spinner (unchanged)                                                                                                                                                                                                                                                                                                                                                                                    |
| Like / bookmark / toggle                                   | Optimistic, no indicator (unchanged)                                                                                                                                                                                                                                                                                                                                                                                             |
| Sub-100ms resolution (ProtectedRoute auth check)           | Nothing visible — quiet `min-h-screen` shell with `aria-busy`                                                                                                                                                                                                                                                                                                                                                                    |
| Request resolved, zero items                               | Dedicated empty state: icon + why + CTA (never a skeleton/spinner)                                                                                                                                                                                                                                                                                                                                                               |
| Catalog fetch failed (API mode)                            | `CatalogStatus` banner + Retry; live chrome + `errors.catalogUnavailable` when the list is empty. Do not claim unpublished or cached/demo. Keep in-memory titles if a prior 200 filled them. Local `ERR_CONNECTION_REFUSED` on `VITE_API_BASE_URL` is SoftGate not listening — restore `pnpm dev:api` / health 200; do not retarget Admin or turn mock on ([live-join-api-listen](../notes/2026-09-10-live-join-api-listen.md)). |
| Catalog still loading after 10s                            | Same Retry control (banner, not a new page)                                                                                                                                                                                                                                                                                                                                                                                      |
| Cover URL known, image not loaded                          | Cover `animate-pulse` until `onLoad` (only if the page passes `imageLoaded`)                                                                                                                                                                                                                                                                                                                                                     |

No splash screen. No `/loading` route. No spinner on top of a skeleton.

## Same-day 155 (labels, not extra Impl numbers)

One Impl number, two same-day passes in this repo. **155a** / **155b** are labels only. Frontmatter on both notes stays `impl: 155`. Do not add a second `| 155 |` index row.

| Label | Pass                                                 | Note                                                                                              | Still in code?                                                                                                |
| ----- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 155a  | Layout (website)                                     | [2026-08-21-page-skeletons-match-live.md](../notes/2026-08-21-page-skeletons-match-live.md)       | Guest Home, Daily lip tiles, hub comments, Library/Author bones                                               |
| 155b  | Production contract (admin agent, same website repo) | [2026-08-21-skeleton-production-contract.md](../notes/2026-08-21-skeleton-production-contract.md) | CatalogStatus, cover `imageLoaded` setters, extra page skeletons, reader prefetch. **Sheen reverted in 156.** |

## Pulse primitive (Impl 156)

- `Skeleton` uses Tailwind `animate-pulse` plus tone fill (`bg-gray-200` / `bg-white/10`). Do **not** add `skeleton-sheen`, `coverSheenClass`, or a sweep overlay.
- Cover placeholders reuse the same pulse: BookCard / DailyDropCard / HeroBook3D overlays and the Author avatar load overlay are `animate-pulse bg-gray-200` until `onLoad`.
- **`prefers-reduced-motion: reduce`** kills pulse (static fill). Do not force skeleton pulse. Product motion elsewhere may still be forced; skeleton pulse is exempt and must respect reduce.
- `BookCard` `imageLoaded` default stays **`true`**. Never flip the default (pages without `onLoad` would pulse forever).
- `skeleton-appear` (200ms delay guard) stays. Sheen keyframes stay deleted.

## CatalogStatus placement (as shipped)

`CatalogStatus` mounts in `src/App.tsx` as a **sibling of `<Routes>`**, before layouts. It paints **above** MainLayout nav and reader chrome. It is **not** inside `MainLayout`. Hidden on `/login`, `/register`, `/forgot-password`, `/reset-password` (and those prefixes). Shown on other routes, including MainLayout pages and `/read`, when `error` is set or catalog `isLoading` lasts more than 10s. Moving it below nav is parked (not this convention’s current behavior).

## Skeleton rules (Impl 68, 155a layout, 155b contract, pulse Impl 156, Daily cap Impl 158, hero chrome Impl 159, Home auth rails Impl 160, account gates Impl 161, Search/Reader chrome Impl 162, Search query chrome Impl 163, Categories chrome Impl 164, genre rail slot Impl 169, honest loading chrome Impl 210)

1. **Primitives** live in [src/components/Skeleton/](../../src/components/Skeleton/Skeleton.tsx): `Skeleton`, `SkeletonText`, `SkeletonBookCard`, `SkeletonDailyDropCard`, `SkeletonSection` (`role="status"`, `aria-busy`, `aria-label={t('a11y.loading')}`, delay guard). Bones stay `aria-hidden`. Do not reintroduce `SkeletonLibraryCard` or `coverSheenClass`. `SkeletonBookCard` / `SkeletonDailyDropCard` stay on disk; catalog-gated **page** skeletons must not use them (Impl 210).
2. **Live chrome + busy wells, not invented inventory (Impl 210).** Loading reuses empty **shape**, not empty **copy**. Module bodies are [`CatalogBusyPanel`](../../apps/portal/src/components/CatalogBusyPanel/CatalogBusyPanel.tsx) (same box + BookOpen circle as `CatalogEmptyPanel`, no title/desc/Help/Creators). Wrap each well in `SkeletonSection`; do not put `role="status"` on the panel itself. Do **not** paint `SkeletonBookCard` grids, rank marks, Daily lip cards, Continue covers, Hero 3:4 bones, Search 6/12 cards, Library compact covers, or hub episode thumbs. Do **not** put `home.emptyTitle` / `emptyDesc` / `catalogEmpty` / Help / Creators on the loading paint. Home skeleton follows **session**: guest = Start here, never Continue, never For You. Signed-in = Continue **xor** Start here (Continue only when `listHistory` is non-empty on the catalog-loading paint — do not wait on `EngagementContext.history`). Continue is heading + well, not a 12-cover shelf. **For You is omitted** until live knows a non-empty list. Rail headings/descriptions/icons are live text; View All is omitted (empty rails hide it). Home hero: static `/banner/banner.png` + gradient + live `home.pageHeading` only. No HeroBook3D, series title, stars, Read/Save, or emptyDesc. Genre row: live `home.genres` + well + inert chevron slot. Daily: live title + seven real weekday labels (`UPLOAD_DAY_ORDER` / `todayWeekday()`) + well; no drop bones. Bottom `startJourney` CTA is live; pass `registrationOpen` so guest goes to `/register` or `/login`. Categories: live masthead/status/sort; genre chip row structurally empty (no 8 bones, no well — live empty `genres.map` of `[]` is blank); grid is one well; omit the count line. Search **landing**: live h1, field, Demo chips, recent; browse-genres heading + well (**no** chevron, **no** View All, **no** Go Here, **no** `search.catalogEmpty` Help panel). Search **query**: live h1, field, tabs without `(N)`, status, All genres, sort; no 8 named genre bones; one result well; no fake result count; no `SearchNoResults`. Hub: dark hero band + well; live All/Free/Premium tab labels without counts; comments heading + well; **omit** `hub-next-drop-slot`. Author: identity bones + live works heading + well. Library: live title/tabs without counts + search/view chrome + well. Reader: live header/footer from `loadReaderPrefs()`; close `href` when `webtoonId` is set; strip height unguessed (unchanged). Busy islands do not wrap working search fields, masthead, or status/sort. Genre slug with unknown name uses a title bone, not a `browseByGenre` lie.
3. **Delay guard** — `skeleton-appear`: opacity 0 → fades in after 200ms. Mock path sets `isLoading` false immediately (no fake delay).
4. **Page skeletons are feature components** — `src/features/<feature>/components/<X>Skeleton.tsx`; wired only when **that page’s** async is loading. Catalog `DataContext.isLoading` is for discovery join (Home, Categories, Search, hub, Reader, Library). **Account hubs do not wait on catalog:** Profile and Notifications paint from local session / inbox. Coins paints Buy / balance / history from wallet. If Coins `unlockedEpisodeKeys.length > 0` while catalog is still loading, the unlock **card** shows one row bone per key (`data-testid="coins-unlocked-pending"`), not `unlockedEmpty`. Keep `ProfilePageSkeleton` / `NotificationsPageSkeleton` / `CoinsPageSkeleton` on disk for a future account/inbox/wallet API. Search and Reader stay catalog-gated; landing, query, and reader chrome that does not need the catalog HTTP payload still paints during that wait.
5. **No spinner on top of a skeleton.** One signal only.
6. **Two-layer covers** — after data arrives, pulse on the cover until `img onLoad`. Default `imageLoaded = true` for callers that do not wire setters. `HeroBook3D` owns its own `imgLoaded` (starts `false`): after mount it must also treat `img.complete && naturalWidth > 0` as loaded, because SSR HTML can finish decoding before React attaches `onLoad` (Impl 182). `BookCard` / `DailyDropCard` do the same complete-check and call `onImageLoad` when the parent passed `imageLoaded={false}` (Impl 183).

## Empty-state rules

- Catalog **success** with zero published titles keeps **live page chrome** (Home hero banner + rails, Categories masthead/filters, Search landing/query). Module bodies use [`CatalogEmptyPanel`](../../apps/portal/src/components/CatalogEmptyPanel/CatalogEmptyPanel.tsx) — icon well, honest “library not published yet” copy, not a full-page Refresh card, not skeleton pulse. Help (`/help`) and Creators (`/creators`) only on empty Hero, Categories catalog-empty grid, and Search catalog-empty landing/query — not on every rail, **never on load-fail**. Filter/query misses while titles exist stay the existing no-match recovery. Library tab empty still uses [LibraryEmptyState](../../src/features/library/components/LibraryEmptyState.tsx).
- Catalog **load-fail** (`error` set, zero titles in memory) is a different story: same live chrome, `CatalogEmptyPanel unavailable` / Hero `unavailable` use `errors.catalogUnavailable` and point at Retry on `CatalogStatus`. Do not use `home.emptyDesc` / `categories.catalogEmpty` / `search.catalogEmpty`. Banner `errors.catalogLoad` does not mention cached or demo data. `error` with titles still in memory keeps those cards + banner only.
- Resolved state: no `aria-busy`, no pulse animation.
- Honest copy per [discovery-honesty.md](discovery-honesty.md) — reader-facing portal never fakes content. Empty catalog is empty chrome, not seed. Load-fail is not empty.

## Parked (do not redo blindly)

- CatalogStatus below nav (today it sits above nav).
- Hub Other works / next-drop CLS vs live gating.
- Reader strip `aspect-ratio` / `h-[60vh]` guesses — intrinsic ratios unknown; width reserved only. Prefetch next 3 URLs + per-panel Retry instead.
- `packages/shared` empty-data guard in `loadFromLocalStorage` — could clobber the admin sibling's legitimate cleared state.
- Route-level `lazy()`/`Suspense` code splitting — separate Impl.

## Related

- Impl 68: [2026-08-13-skeleton-loading-states.md](../notes/2026-08-13-skeleton-loading-states.md)
- Impl 155a layout pass: [2026-08-21-page-skeletons-match-live.md](../notes/2026-08-21-page-skeletons-match-live.md)
- Impl 155b production contract: [2026-08-21-skeleton-production-contract.md](../notes/2026-08-21-skeleton-production-contract.md)
- Impl 156 pulse restore: [2026-08-21-skeleton-pulse-restore.md](../notes/2026-08-21-skeleton-pulse-restore.md)
- Impl 157 docs truth lock: [2026-08-21-skeleton-docs-truth.md](../notes/2026-08-21-skeleton-docs-truth.md)
- Impl 158 Daily skeleton cap: [2026-08-21-daily-skeleton-cap.md](../notes/2026-08-21-daily-skeleton-cap.md)
- Impl 159 Home hero skeleton chrome: [2026-08-21-hero-skeleton-chrome.md](../notes/2026-08-21-hero-skeleton-chrome.md)
- Impl 160 Home skeleton Continue / For You by session: [2026-08-21-home-skeleton-auth-rails.md](../notes/2026-08-21-home-skeleton-auth-rails.md)
- Impl 161 unhook account pages from catalog loading: [2026-08-21-account-skeleton-triggers.md](../notes/2026-08-21-account-skeleton-triggers.md)
- Impl 162 Search landing live chrome + Reader chrome: [2026-08-22-search-reader-skeleton-chrome.md](../notes/2026-08-22-search-reader-skeleton-chrome.md)
- Impl 163 Search query live chrome: [2026-08-22-search-query-skeleton-chrome.md](../notes/2026-08-22-search-query-skeleton-chrome.md)
- Impl 164 Categories skeleton live chrome: [2026-08-22-categories-skeleton-chrome.md](../notes/2026-08-22-categories-skeleton-chrome.md)
- Impl 169 reserved genre-rail chevron slot: [2026-08-23-genre-rail-chevron-slot.md](../notes/2026-08-23-genre-rail-chevron-slot.md)
- Impl 196 catalog-empty live chrome: [2026-09-09-catalog-empty-chrome.md](../notes/2026-09-09-catalog-empty-chrome.md)
- Impl 198 catalog load-fail vs success-empty: [2026-09-09-catalog-load-fail-copy.md](../notes/2026-09-09-catalog-load-fail-copy.md)
- Impl 210 honest catalog loading chrome: [2026-09-10-catalog-loading-chrome.md](../notes/2026-09-10-catalog-loading-chrome.md)
- Live join listen (ops, not numbered): [2026-09-10-live-join-api-listen.md](../notes/2026-09-10-live-join-api-listen.md)
