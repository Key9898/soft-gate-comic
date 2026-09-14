---
title: Impl 216 — Phase 3 accessibility floor
type: note
date: 2026-09-14
tags: [a11y, keyboard, reader, search, aria, portal, softgate]
impl: 216
---

# Impl 216 — Phase 3 accessibility floor

Phase 3 of the [UI/UX improvement plan](2026-09-14-uiux-improvement-plan.md), GitHub epic #20 and issue #13. The theme running through it: several controls already **declared** ARIA roles without honouring the behaviour those roles promise.

## The reader is operable from a keyboard (#13)

Three separate defects, one surface.

**The page moved under the finger.** `<main>` tied its own padding to chrome visibility — `pt-20 pb-16` when shown, `pt-2 pb-2` when hidden — so every tap to hide the toolbar shifted the strip about 72px. Chrome is `position: fixed`; it never needed to affect document flow. Padding is now constant and only the chrome animates. Verified live: `main` holds `padding-top: 96px` across a toggle.

**There was no keyboard path.** Chrome toggling lived on an `onClick` on `<main>` with no role and no key binding, and the toolbar otherwise only returned on an upward scroll — so a keyboard reader who scrolled down could not get it back, and had no way out of the reader at all. Added `t` to toggle and `Escape` to leave for the series hub, both guarded by `isEditableReaderTarget` so they do not fire inside the comment box.

**Swipes fought the OS.** A right-swipe starting at the left edge was simultaneously the iOS back gesture and "previous episode", which makes both unreliable. Swipes originating within 24px of either edge (`SYSTEM_EDGE_GUTTER_PX`) no longer start an episode change.

Also here: the live progress bar declared `role="progressbar"` with **no value** — no `aria-valuenow`, `aria-valuemin` or `aria-valuemax` — while `ReaderSkeleton` supplied them correctly. A progressbar without a value announces nothing useful. The percentage also moved out of `aria-label` and into `aria-valuenow`, where it belongs.

## `SearchAutocomplete` honours the roles it declares

It declared `role="listbox"` / `role="option"` and `aria-autocomplete="list"`, then shipped **zero** keyboard handling and hardcoded `aria-selected={false}` on every option. The list was reachable only by tabbing past the input into a floating popup, and dismissable only with a mouse. This is the primary search entry point on Home, Search, the 404 page and both search skeletons.

Now: `role="combobox"` on the input (required — `aria-expanded` and `aria-activedescendant` are only valid there), arrow-key movement with `aria-activedescendant` tracking the active option, `Home`/`End`, `Enter` to take the active option, `Escape` to close without clearing the query, and `tabIndex={-1}` on the option buttons so `Tab` still leaves the field.

One deliberate detail: arrowing past the last option returns to **no active option** rather than wrapping to the first. Otherwise `Enter` could never submit what the visitor actually typed.

This changes the exposed role from `searchbox` to `combobox`, so four tests that asserted the old role were updated.

Covered by `src/test/SearchAutocompleteKeyboard.test.tsx` (5 tests).

## `ReaderSettingsSheet` had two labels wrapping nothing

The theme and fit groups were bare `<label>` elements with no control inside — no accessible group name — and the chosen option was conveyed by colour alone. Each group is now a `fieldset` + `legend` with a `role="radiogroup"` and `role="radio"` / `aria-checked` per option.

The sheet also gained the **font-size control it never had**: `fontSize` was stored, applied to the strip and persisted across sessions, but the only way to change it was in profile settings, three navigations away from the reading you are trying to adjust.

## Smaller items

- **Notification filters** used a `Button` `variant` swap — selection by colour alone. They are `Chip`s now, with `aria-pressed`.
- **The daily-drop card re-announced itself every second.** Its `aria-label` included the live countdown, so the accessible name changed on every tick and a screen-reader user sitting on the card heard it re-read continuously. The countdown left the name and stayed visible (`aria-hidden`) in the gradient strip.
- **The comment composers posted mid-composition.** `Enter` submitted without checking `e.nativeEvent.isComposing`, so a Burmese (or any IME) user committing a candidate posted a half-typed comment. Guarded, on both composers.
- **Legal reading dropped below the readable floor.** The smallest step was 12px and the mobile default 14px, for long-form legal copy much of it in Burmese. Mobile now starts at 16px across all four steps.
- **Errored textareas lost their focus ring.** `ContactPage` killed the outline and restored a ring only in the non-error branch, so focus was invisible on exactly the field the visitor was being sent back to. The ring is now unconditional and turns red with the error.
- **`LanguageSwitcher` had a hardcoded English accessible name** — `Switch to ${name}` — on the app's own language control. Now `t('a11y.switchLanguage')`.
- **Both route gates painted a blank screen.** `ProtectedRoute` and `MaintenanceGate` returned an empty grey `<div>` before each route's purpose-built skeleton, so the first paint of every gated route had nothing for a screen reader. `ProtectedRoute` now takes a `fallback` and App passes each route its own skeleton; both announce loading through a visually-hidden `role="status"`.
- **Two radius violations missed in Phase 1.** `rounded-l-sm` / `rounded-r-sm` on the half-star rating hit areas did not match a `rounded-sm` grep. The Phase 1 claim of "15 → 0" was therefore slightly wrong; a directional-variant sweep now reports genuinely zero.

## Judgement calls, recorded

**`LanguageSwitcher`'s visible label stays hidden below `xl`.** The review called this a defect. It is a deliberate decision from the Impl 77 responsive ladder, with two tests pinning it, and the control has a proper accessible name and a 44px target at every width — so the globe is never unlabelled for assistive tech. Layout preference, not an accessibility floor item. Left alone.

**The half-star rating targets stay 24px wide.** Half-star precision needs them; you cannot have both halves at 44px without a 88px star. The mitigation that matters is already there — the control is a real radiogroup with roving `tabIndex`, `aria-checked` and per-option labels, so it is fully operable without pointing at a 24px strip.

**`LanguageSwitcher` still does a full `window.location.assign`.** Locale lives in the route basename, which is read at boot, so switching without a reload means remounting the router. That is a routing change, not an accessibility one, and it does not belong in this phase.

## Verification

`pnpm check` green: 0 lint errors (16 pre-existing warnings), prettier clean, 759 portal + 157 API tests, both builds.

Live checks at `/read/3/1`: `main` padding constant at 96px across a chrome toggle, `t` hides and restores the toolbar, `Escape` navigates to `/webtoon/3`, and the progress bar reports `aria-valuenow`/`min`/`max`. On Home, the combobox sets `aria-activedescendant` to the first option on `ArrowDown` and clears it one press past the end.
