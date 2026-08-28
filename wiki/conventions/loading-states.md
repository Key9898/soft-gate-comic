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
  ]
---

# Loading states

Every async surface resolves through the UI state stack: **loading → (empty | error | ideal)**. Never conflate them (the old `isLoading || list.length === 0` HomePage guard produced an infinite spinner on legitimately empty data).

## Pattern per situation

| Situation                                                  | Pattern                                                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Content page, predictable layout (`DataContext.isLoading`) | Page skeleton mirroring the real layout                                      |
| Form submit / auth action                                  | `Button isLoading` inline spinner (unchanged)                                |
| Like / bookmark / toggle                                   | Optimistic, no indicator (unchanged)                                         |
| Sub-100ms resolution (ProtectedRoute auth check)           | Nothing visible — quiet `min-h-screen` shell with `aria-busy`                |
| Request resolved, zero items                               | Dedicated empty state: icon + why + CTA (never a skeleton/spinner)           |
| Catalog fetch failed (API mode)                            | `CatalogStatus` banner + Retry; keep cached/demo data                        |
| Catalog still loading after 10s                            | Same Retry control (banner, not a new page)                                  |
| Cover URL known, image not loaded                          | Cover `animate-pulse` until `onLoad` (only if the page passes `imageLoaded`) |

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

## Skeleton rules (Impl 68, 155a layout, 155b contract, pulse Impl 156, Daily cap Impl 158, hero chrome Impl 159, Home auth rails Impl 160, account gates Impl 161, Search/Reader chrome Impl 162, Search query chrome Impl 163, Categories chrome Impl 164, genre rail slot Impl 169)

1. **Primitives** live in [src/components/Skeleton/](../../src/components/Skeleton/Skeleton.tsx): `Skeleton`, `SkeletonText`, `SkeletonBookCard`, `SkeletonDailyDropCard`, `SkeletonSection` (`role="status"`, `aria-busy`, `aria-label={t('a11y.loading')}`, delay guard). Bones stay `aria-hidden`. Do not reintroduce `SkeletonLibraryCard` or `coverSheenClass`.
2. **Mirror always-on live chrome** — same containers and grids. Home skeleton follows **session**, not a single guest shape: guest = Start here, never Continue, never For You. Signed-in = Continue **xor** Start here (Continue only when `listHistory` is non-empty on the catalog-loading paint — do not wait on `EngagementContext.history`, which starts `[]`). Continue bones are a horizontal cap-**12** shelf (`CONTINUE_CAP`), not a 6-up grid; slots are reserved, not “12 titles exist.” Signed-in also reserves For You **6** (`DISCOVERY_RAIL_CAP`) after Continue/Start here and before Ranking; live may hide For You after load if empty (loading ≠ empty). Do **not** put empty copy on the skeleton. Home hero skeleton reuses live static `/banner/banner.png` plus `from-gray-950/70 via-gray-950/30 to-gray-950/45`; `bg-gray-950` is banner-layer fallback only (not a solid black section, not a white band). Dark-tone bones sit on `relative z-10`. Do **not** mount `HeroBook3D` on the skeleton. Hub skeleton includes comments (always on); **not** Other works / You may also like (`length > 0` gated). Hub skeleton always shows `hub-next-drop-slot`; live next-drop is `nextDrop` gated (CLS parked). Daily: **7** weekday chips (`home-daily-weekday`); **6** `SkeletonDailyDropCard` bones (index 0–5) = **cap / reserved slots**, not “6 drops exist”. CMS/Admin count is 0–6 and unknown at hand-off. Do **not** match Demo 1–3. Do **not** put `dailyEmpty` (or any empty copy) on the skeleton (loading ≠ empty). Published leaving Daily for Updated is a **live** job, not a skeleton prediction. Bones are lip tiles, not full `SkeletonBookCard` meta. Categories catalog wait paints live masthead from the sort job (ranked: `radial-wash-primary` at `inset-0` plus `rankingEyebrow` / Popular h1; New / Updated / Rated use the same helper). Status and sort stay live from the URL via `catalogHref`. Genre chips are **8** reserved `flex-nowrap` slots plus an inert right chevron slot (`genre-rail-chevron-slot`; no working Show more genres button). Count stays a bone (not `24 Webtoons`). Busy islands wrap genre bones and the **24**-card grid only — not masthead, status, or sort. Genre slug with unknown name uses a title bone, not a `browseByGenre` lie. Ranked ranks use `rankOnPage(page, i)` on **24** cards. Search **landing** (no query) paints live h1, search field, demo chips, recent from localStorage, and Go here; genre chips are **8** reserved slots plus the inert chevron slot; Popular / New Releases headings and View all stay live; cards are `DISCOVERY_RAIL_CAP` (**6**) each. Do not wrap the working search field in `SkeletonSection`. Search **query** paints live h1, filled field, clear, tabs without `(N)`, status, All genres, and sort from the URL; named genre chips are **8** reserved slots (`flex-wrap`); results are `QUERY_WEBTOON_CARD_CAP` **12** cards or `QUERY_HIT_ROW_CAP` **6** author/episode rows — reserved caps, not promised hits. Do not prefix a fake result count. Do not paint `SearchNoResults` during load. Busy does not wrap the search field. Reader skeleton paints live-shaped header/footer from `loadReaderPrefs()` (dark vs light tokens); close is a native series `href` when `webtoonId` is set; strip height stays unguessed.
3. **Delay guard** — `skeleton-appear`: opacity 0 → fades in after 200ms. Mock path sets `isLoading` false immediately (no fake delay).
4. **Page skeletons are feature components** — `src/features/<feature>/components/<X>Skeleton.tsx`; wired only when **that page’s** async is loading. Catalog `DataContext.isLoading` is for discovery join (Home, Categories, Search, hub, Reader, Library). **Account hubs do not wait on catalog:** Profile and Notifications paint from local session / inbox. Coins paints Buy / balance / history from wallet. If Coins `unlockedEpisodeKeys.length > 0` while catalog is still loading, the unlock **card** shows one row bone per key (`data-testid="coins-unlocked-pending"`), not `unlockedEmpty`. Keep `ProfilePageSkeleton` / `NotificationsPageSkeleton` / `CoinsPageSkeleton` on disk for a future account/inbox/wallet API. Search and Reader stay catalog-gated; landing, query, and reader chrome that does not need the catalog HTTP payload still paints during that wait.
5. **No spinner on top of a skeleton.** One signal only.
6. **Two-layer covers** — after data arrives, pulse on the cover until `img onLoad`. Default `imageLoaded = true` for callers that do not wire setters. `HeroBook3D` owns its own `imgLoaded` (starts `false`): after mount it must also treat `img.complete && naturalWidth > 0` as loaded, because SSR HTML can finish decoding before React attaches `onLoad` (Impl 182). `BookCard` / `DailyDropCard` do the same complete-check and call `onImageLoad` when the parent passed `imageLoaded={false}` (Impl 183).

## Empty-state rules

- Explain why it's empty + give a next action + an icon ([HomeEmptyState](../../src/features/home/components/HomeEmptyState.tsx), [LibraryEmptyState](../../src/features/library/components/LibraryEmptyState.tsx) are the references).
- Resolved state: no `aria-busy`, no pulse animation.
- Honest copy per [discovery-honesty.md](discovery-honesty.md) — reader-facing portal never fakes content.

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
