---
title: Skeleton loading states + Home empty state
type: note
date: 2026-08-13
tags: [skeleton, loading, empty-state, a11y, reduced-motion, softgate]
impl: 68
---

# Impl 68 — Skeleton loading states + Home empty state

## Why

Loading-state audit + research (skeleton vs spinner timing rules, UI state stack): all 7 content-page loading branches used an identical copy-pasted full-screen spinner even though every layout is predictable (skeleton territory); HomePage conflated loading with empty (`isLoading || webtoons.length === 0`) — legitimately empty data (empty saved shared-data or empty backend response) produced an **infinite spinner**; `prefers-reduced-motion` never disabled pulse/spin (only `@media print` did).

## What shipped

- **Skeleton primitive** — new `src/components/Skeleton/` (`Skeleton` with light/dark tone, `SkeletonText`, `SkeletonBookCard` reusing `book-media aspect-[3/4]`, `SkeletonSection` wrapper with `role="status"` + `aria-busy` + `aria-label` + delay guard)
- **CSS** — `skeleton-appear` utility (opacity 0, fades in after 200ms — kills the one-frame mock-mode flash); new reduced-motion block disabling `animate-pulse`/`animate-spin` and forcing skeletons visible
- **6 page skeletons** mirroring real layouts (containers, grid classes, card shapes): Home (hero + chip rail + 2 card-grid sections), Categories (filter header + grid), WebtoonDetail (dark hero + episode rows), Search (form bar + two-column chips), Library (header + tabs card + grid), Reader (dark top bar + strip blocks) — each wired into the page's `if (isLoading)` branch, spinner JSX replaced only
- **ProtectedRoute** — spinner + hardcoded "Loading..." replaced by quiet `min-h-screen bg-gray-50` shell with `aria-busy` (auth resolves in one frame; <100ms → no loader)
- **HomePage split** — `if (isLoading)` → skeleton; `if (webtoons.length === 0)` → new `HomeEmptyState` (BookOpen icon, `home.emptyTitle/emptyDesc`, Refresh button)
- **i18n** — `a11y.loading`, `home.emptyTitle/emptyDesc/refresh` EN + MM
- **Test** — new `src/test/SkeletonStates.test.tsx` (8 cases): each skeleton renders an accessible busy region with no text; HomePage with seeded empty `softgate-shared-data` shows empty state (not skeleton); default HomePage renders content with no busy region

## Files

- `src/components/Skeleton/{Skeleton.tsx,index.ts}` (new)
- `src/features/{home,categories,webtoon,search,library,reader}/components/*Skeleton.tsx` (new), `src/features/home/components/HomeEmptyState.tsx` (new)
- `src/features/{home/HomePage,categories/CategoriesPage,webtoon/WebtoonDetailPage,search/SearchPage,library/LibraryPage,reader/ReaderPage}.tsx`, `src/components/ProtectedRoute/ProtectedRoute.tsx`
- `src/index.css`, `src/lib/i18n/locales/{en,mm}/translation.json`
- `src/test/SkeletonStates.test.tsx` (new)
- `wiki/conventions/loading-states.md` (new)

## Verify

`npm run check`

## Next

Impl **69** — free
