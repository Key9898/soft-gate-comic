---
title: Impl 214 — Phase 0 ship blockers from the UI/UX plan
type: note
date: 2026-09-14
tags: [uiux, a11y, reader, coins, profile, contrast, portal, softgate]
impl: 214
---

# Impl 214 — Phase 0 ship blockers from the UI/UX plan

Phase 0 of [2026-09-14-uiux-improvement-plan.md](2026-09-14-uiux-improvement-plan.md). Eight blockers, tracked as GitHub issues #3–#10 under epic #17. No Phase 1–6 work is included; the design-system consolidation that Phase 1 owns is untouched, so the 227 touch-target patches and 23 CTA constants are still in place.

## What shipped

### Series detail hero no longer clips on a phone (#3)

`WebtoonDetailPage.tsx` — the info panel was `flex-1` with the flexbox default `min-width: auto`, so the six-card stats row (`flex-nowrap` + `overflow-x-auto`, six `flex-shrink-0` cards) forced the column to its content width. At 375px the column measured `left=-250, right=625` while `document.scrollWidth` stayed 375: the title, synopsis, meta chips and CTA row were clipped and unreachable rather than scrollable.

`w-full min-w-0 flex-1` restores the constraint, which lets `overflow-x-auto` do its job. Verified live at 375px: column now `left=16, right=359`, `scrollWidth` 375. The stats row also changed from `justify-center` to `justify-start sm:justify-center` — a centred nowrap scroll row puts its first items off the left edge with no way back.

### Coin spend is legible before it happens (#6)

`ReaderPage.tsx`:

- The CTA now carries the price: `readerPage.unlockCta` renders `Unlock · {{coins}} coins`.
- `balanceAfter` shows what the spend will leave, next to the current balance.
- First tap opens an inline confirm (`confirmUnlockBody`) with Confirm / Cancel rather than spending immediately. Inline, not a modal — the paywall panel is already a dedicated full-screen state and does not need a second layer.
- `handleUnlock` holds `unlockPending` across the await and passes it to `Button isLoading`, so the button is disabled and spinning rather than silently double-tappable.
- A `role="status" aria-live="polite"` region in the reader root announces the new balance. It lives at the root, not in the paywall, because the paywall unmounts on success.

### Insufficient coins recovers instead of ejecting (#5)

`ReaderPage.tsx:handleUnlock` used to `setUnlockError(...)` and `navigate('/coins')` on the next line, discarding the error it had just written and dropping the user into a shop with no memory of what they wanted.

It now stays put and renders, inside the paywall: the error, the shortfall (`readerPage.shortfall`), and a **Top up and come back** link carrying `state={{ from, needCoins, episodeNumber, seriesTitle }}`.

`CoinsPage.tsx` reads that state into a context strip (`data-testid="coins-topup-context"`) showing what the top-up is for, how many coins are missing, the smallest pack that covers the gap (`smallestSufficientPack`, cheapest package whose coins + bonus clear the shortfall), and a **Back to Episode N** link. Absent state, nothing renders — a plain `/coins` visit is unchanged.

### Account deletion is confirmed; notification deletes are confirmed (#7)

The policy was inverted against severity: deleting three bookmarks opened a focus-trapped modal, deleting an account was one click.

- `LibraryDeleteConfirmDialog` is promoted to `components/ConfirmDialog`, with optional `confirmPhrase` / `confirmPhraseLabel` (type-to-confirm) and `isConfirming`. The old path is now a re-export, so `LibraryPage` and `ModalA11y.test.tsx` are unchanged.
- `ProfilePage` account deletion goes through it with `confirmPhrase = user.username`. Username, not a fixed word: a fixed English `DELETE` is not typeable guidance in Burmese.
- `NotificationsPage` routes both single delete and `clearReadNotifications` through the same dialog.

Notification **undo** is deliberately not implemented. The store has no restore path, so an undo toast would be a button that cannot do what it says. The confirm is the guardrail until `EngagementContext` can support a real restore.

### The demo checkout cannot hold a real card (#8)

`CoinsPage.tsx` — the card branch was a working PAN / expiry / CVV form for an app that posts nothing anywhere. The fields are now `readOnly` + `aria-readonly`, pre-filled from a `DEMO_CARD` constant using the reserved Visa test number, with an amber `card-demo-locked` note saying so. The 3D flip-card preview and the CVV focus-flip still work. `handleCopyMerchant` is now `async` with `navigator.clipboard?.` and a `try/catch` — unguarded, it throws on insecure origins and on denied permission.

### `text-gray-400` retired on light surfaces (#9)

`--color-muted` (gray-600) and `--color-muted-strong` (gray-700) are new `@theme` tokens. gray-600 clears AA on both white (7.6:1) and the `bg-gray-50` body (7.3:1); gray-500 is 4.42:1 on gray-50 and misses, which is why the token is not the obvious gray-500.

`text-gray-400` (2.85:1, 127 uses, 57 of them at 11–12px) is replaced with `text-muted` across every light surface. Kept where the surface is dark: `Footer` (on gray-900) and the five reader components that already branch on `darkMode`. `ReaderSettingsSheet` labels became theme-aware rather than a fixed tone, since the sheet follows the reader theme.

Also in this pass: the 404 numeral moved from `text-primary-200` (1.4:1 at 96px) to `text-primary-700`; `Footer` copyright from gray-500 on gray-900 (3.4:1) to gray-400; `RatingChip` and `ContentRatingBadge` scrims from `bg-black/60` to `bg-black/75`.

### Reduced motion covers the hero book (#10)

The reduce block covered only `animate-pulse`, `animate-spin` and `skeleton-appear`. `:focus-within` on `.hero-book-scene` rotated the book through `rotateX(6) rotateY(-42) rotateZ(-4)` plus a 3rem push — fired by `Tab`, with no way to opt out.

Under reduce the book now keeps its authored resting angle and stops moving: transitions off, the enter slide off, and the hover/focus variants pinned to the resting values. The radial dialog enter animation is untouched — [forced-product-motion.md](../conventions/forced-product-motion.md) covers motion the visitor asked for, and opening a dialog is a request. Tabbing is navigation.

### Episode strips stop borrowing other series' covers (#4, partial)

`packages/shared/src/data.ts` had 29 episodes whose `images` arrays pointed at _other_ series' covers — Shadow Knight Ep 1 rendered the covers of _Love in Seoul_, _Ocean Dreams_ and _The Last Horizon_. Those arrays are now `[]`, so the existing `fillEpisodeStripImages()` fills each strip with that episode's own series cover.

New `isPlaceholderStrip(episode, seriesCover)` in `lib/catalog/seriesReading.ts` detects a strip that is the series cover repeated, and the reader renders `readerPage.stripDemo` above it — the same disclosure discipline as `ReaderAdSlot`. A reader that shows a cover as panel art without saying so is claiming art the project does not have.

## Not done

- **The binary assets in #4.** `banner.png` still contains its own baked-in wordmarks (`SOFT GATE Comics`, `YOUR DAILY ESCAPE,`, `JUST BEYOND THE GATE.`) which the live hero overlay renders on top of, and the cover PNGs still carry `[AUTHOR NAME] | ART BY [ARTIST NAME]`. Both need real artwork; they cannot be fixed in code. #4 stays open for them.
- Notification undo, per above.

## Verification

`pnpm lint` clean (0 errors, 15 pre-existing warnings). `turbo run test:run build`: 729 portal + 153 API tests pass, both builds succeed.

New `src/test/Phase0Blockers.test.tsx` covers the price on the CTA, the balance-after line, the confirm step and its cancel, the live region, the top-up context strip and its absence on a plain visit, the locked card fields, and the delete dialog's type-to-confirm gate.

Two existing tests were updated for intended behaviour changes: `ReaderChrome` strip length 4 → 5 (own-cover fill), and `ReaderGuestNudge` unlock button name `unlock with coins` → `unlock ·` (price on CTA).

## Known repo issue, not from this work

`pnpm format:check` fails on a pristine `HEAD` checkout — 70 files under `apps/portal/src`. The committed formatting was produced by an older `prettier-plugin-tailwindcss`; the installed and lockfile-resolved version is 0.6.14, which orders some class strings differently. `pnpm check` therefore cannot go green without either reformatting those 70 files or pinning the plugin back to the version that produced the committed state. Left alone here so a formatter decision is not buried inside a UI change.
