---
title: Dialog system — APG pattern, scroll lock, focus trap
date: 2026-08-13
impl: 70
type: note
tags: [a11y, modal, dialog, hooks, focus-trap]
---

# Dialog system a11y (Impl 70)

Batch 2 of the six-batch audit overhaul. All three overlay surfaces now implement the ARIA APG
modal-dialog pattern via two shared hooks (native `<dialog>` migration stays parked — framer-motion
exit animations + regression risk).

## New hooks

- `src/hooks/useScrollLock.ts` — iOS-proof body lock: stores `window.scrollY`, sets
  `position: fixed; top: -scrollY` on `<body>`, restores styles + scroll position on unlock.
  Replaces the naive `overflow: hidden` toggle (which iOS Safari ignores).
- `src/hooks/useFocusTrap.ts` — on activate: remembers the trigger element, moves focus to
  `initialFocusRef` (or the container, auto-`tabindex="-1"`); traps Tab/Shift+Tab cycling through
  focusable descendants; on deactivate: restores focus to the trigger. Capture-phase listener so it
  wins over page-level key handlers.

## Wired surfaces

| Surface                                  | Changes                                                                                                                                                                                                                                                                      |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Modal.tsx`                              | `role="dialog"` + `aria-modal` + `aria-labelledby` (title h2 gets `useId`), `useScrollLock` + `useFocusTrap`, content wrapper now `max-h-[calc(85dvh-4rem)] overflow-y-auto overscroll-contain` (long Reader comments scroll internally instead of overflowing the viewport) |
| `LibraryDeleteConfirmDialog.tsx`         | dialog semantics labelled by the h3, Escape handler, scroll lock, focus trap with initial focus on Cancel (safe destructive-dialog default), `aria-hidden` warning icon                                                                                                      |
| Reader settings sheet (`ReaderPage.tsx`) | Escape to close, `useScrollLock(showSettings)`, close button `p-1.5` → `p-2` + `aria-label` + `aria-hidden` icon                                                                                                                                                             |

## Files

- New: `src/hooks/useScrollLock.ts`, `src/hooks/useFocusTrap.ts`, `src/test/ModalA11y.test.tsx` (7 cases)
- Edited: `src/components/Modal/Modal.tsx`, `src/features/library/components/LibraryDeleteConfirmDialog.tsx`, `src/features/reader/ReaderPage.tsx`

## Verify

`npm run check` green; `ModalA11y.test.tsx` covers role/aria wiring, focus in + restore, body lock/unlock, internal scroll container, Cancel initial focus, Escape, Tab wrap both directions. Existing `Modal.test.tsx` (10 cases) unchanged and green.
