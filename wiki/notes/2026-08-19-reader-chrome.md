---
title: Reader chrome episode sheet prefs keyboard
type: note
date: 2026-08-19
tags: [reader, prefs, cookies, softgate]
impl: 133
---

# Impl 133 — Reader chrome

Footer Episode List opens a published-episode Modal instead of leaving the reader. Prefs persist in `softgate_reader_prefs_v1` (theme, brightness, HUD font size, image fit) and appear as a Cookies **Reader display** row — not a second reading-progress row. Arrow keys move prev/next unless a field or overlay is open. The comments button shows the current count. Fit vs Full width changes the strip stack width, not `<img>` font-size.

## Verify

`npx vitest run src/test/ReaderChrome.test.tsx src/test/ReaderCelebration.test.tsx src/test/ReaderGuestNudge.test.tsx src/test/LegalPages.test.tsx`

Then `npm run check`.

## Next

Impl **134**.
