---
title: Impl 155 — Production skeleton contract (155b contract)
type: note
date: 2026-08-21
tags: [skeleton, loading, sheen-reverted, catalog-error, retry, reader, 155b, softgate]
impl: 155
---

# Impl 155 — Production skeleton contract (155b contract)

**Same-day pass B (155b).** Frontmatter stays `impl: 155`. Layout pass is **155a** ([page-skeletons-match-live](2026-08-21-page-skeletons-match-live.md)). Docs truth: [2026-08-21-skeleton-docs-truth.md](2026-08-21-skeleton-docs-truth.md).

**Motion superseded by Impl 156:** skeleton bones and cover overlays use `animate-pulse`. Sheen CSS and `coverSheenClass` were removed. Layout / catalog retry / reader prefetch in this note still apply unless a later Impl says otherwise. See [2026-08-21-skeleton-pulse-restore.md](2026-08-21-skeleton-pulse-restore.md).

Content wait is the **route page skeleton**. No splash, no `/loading`, no spinner on top of a skeleton. Empty ≠ loading ≠ error. Mock `DataContext` has **no** artificial delay (`skeleton-appear` 200ms delay guard still prevents sub-200ms flash).

Layout-faithful skeletons from 155a stay; this pass locked catalog error + 10s retry and reader strip prefetch/retry. (Sheen as the motion primitive was reverted in Impl 156.)

## What shipped

- **Sheen (reverted in Impl 156)** — this pass added `skeleton-sheen`; Impl 156 restored `animate-pulse` and deleted sheen CSS / `coverSheenClass`. Do not re-add sheen.
- **Home skeleton** — always-on guest chrome only. No Continue / For You (session-gated; would CLS). Ranking 1–6.
- **Categories** — sticky filter clone; **24** cards (`PAGE_SIZE`); ranked ranks use `rankOnPage(page, i)`.
- **Hub skeleton** — HeroBook-sized bone, episode thumbs, comments. **No** Other works / You may also like (`length > 0` gated).
- **Search** — empty vs `hasQuery` + tab (`webtoons` | `authors` | `episodes`).
- **Library / Author / Notifications / Coins / Profile** skeletons. Auth + FAQ/legal stay untouched.
- **Reader** — chrome-only skeleton (no guessed strip height). Prefetch next 3 URLs. Per-panel Retry. No `aspect-ratio` on strips.
- **Cover load overlay** — `BookCard.imageLoaded` default stays **`true`**. Pages that own covers pass Set-based `imageLoaded` / `onImageLoad` / `onImageError`. Overlay motion is pulse (Impl 156), not sheen.
- **CatalogStatus** — error banner + Retry (honest: cached/demo may still show). Same Retry if `isLoading` > 10s. Mounts in `App.tsx` as a **sibling of `<Routes>`**, so it paints **above** MainLayout nav / reader chrome — not inside `MainLayout`. Hidden on `/login`, `/register`, `/forgot-password`, `/reset-password`. Visible on other routes including `/read` when `error` or 10s slow load.

## Parked

- Reader strip `aspect-ratio` / `h-[60vh]` guesses.

## Related

- Layout match pass (155a): [2026-08-21-page-skeletons-match-live.md](2026-08-21-page-skeletons-match-live.md)
- Pulse restore: [2026-08-21-skeleton-pulse-restore.md](2026-08-21-skeleton-pulse-restore.md)
- Docs truth (157): [2026-08-21-skeleton-docs-truth.md](2026-08-21-skeleton-docs-truth.md)
- Convention: [loading-states.md](../conventions/loading-states.md)
