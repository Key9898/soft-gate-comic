---
title: Reader swipe and pinch
type: note
date: 2026-08-19
tags: [reader, gestures, swipe, pinch, softgate]
impl: 138
---

# Impl 138 — Reader swipe + pinch

Touch/pen swipe on the strip changes episode (right prev, left next). Pinch uses CSS scale 1–3 at the pinch midpoint; double-tap resets. Zoom is session-only. Overlays and editable fields block gestures the same way as arrow keys. Guests keep gestures.

## Verify

`npx vitest run src/test/readerGestures.test.ts src/test/ReaderChrome.test.tsx src/test/ReaderCelebration.test.tsx src/test/ReaderGuestNudge.test.tsx`

Then `npm run check`.

## Next

Impl **139**.
