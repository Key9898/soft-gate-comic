---
title: Impl 199 — Reader reading room
type: note
date: 2026-09-09
tags: [reader, chrome, ads, softgate]
impl: 199
---

# Impl 199 — Reader reading room

Complete calm WEBTOON-class episode reader at `/read/:webtoonId/:episodeNumber`. Impl **198** already shipped (catalog load-fail vs success-empty). Next is **200**.

## What shipped

- `ReaderLayout` has no white shell. Brightness overlay is `z-40` under header/footer `z-50`. Strip art is not rounded/shadow-cropped. Chrome hide drops `pt-20 pb-16`. Header/footer enter is forced product motion.
- Episode list and settings use `ReaderSheet` (mobile bottom sheet / desktop right drawer). Font-size control stays on Profile Preferences only. First/Last published jumps live in the episode sheet.
- Footer shows published `n / total`, catalog `likeCount`, Share (`/read/:id/:n`). Header has author link. Desktop `md+` side prev/next.
- Pinch scale 1–3 can pan; swipe episode is off while zoomed. Double-tap resets scale and pan.
- In-flow Demo ad slots: end after last panel always; mid only when `images.length >= 6`. No overlay, no ad network. Locked gate has no ads.
- Quiet chapter-end: rating, comments teaser, creator-note Demo, next or same-genre related (max 6), guest nudge, episode report (`softgate_episode_reports_v1`, auth + confirm).

## Verify

- `pnpm check`
- Mock `pnpm dev` `/read/1/1`: end ad, no mid, episode sheet, share, quiet complete
- HTTP logged-in reader prefs still `/api/prefs`; ads/report stay device Demo
