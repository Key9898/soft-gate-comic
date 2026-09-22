---
title: Immersive colour tokens via data-theme attribute, not dark: variants
type: decision
date: 2026-09-22
tags: [colour, tokens, reader, webtoon, semantics, tailwind, softgate]
---

# Immersive colour tokens via data-theme attribute, not dark: variants

## Status

Accepted

## Context

Three surfaces hardcode dark colours:

- Webtoon Detail's hub hero is a fixed `bg-gray-900` overlay with 19 dark literals around it. It is always immersive.
- The Reader treats dark as a user preference, stored in `softgate_reader_prefs_v1` under the `darkMode` key (default true). The preference is threaded through 18 files and branched in 37 ternaries.

A single mechanism has to serve a static scope and a toggled one.

## Decision

Semantic tokens are declared in the `@theme` block in `apps/portal/src/index.css` alongside the existing palette. A `data-theme='immersive'` attribute on a subtree root rebinds all twelve of them for everything inside.

- Webtoon Detail's hub hero sets the attribute statically.
- The Reader sets it when `darkMode` is true and omits it when false. The preference now drives CSS instead of markup branching.
- No other page sets it, which is what makes "light pages unchanged" testable rather than asserted.

Light values are the default binding. The attribute remaps them to immersive values for the two surfaces that need it.

## Consequences

- Most of the 37 ternaries collapse to single class names, and the `darkMode` prop stops
  being needed for class selection at those sites. It does not disappear from class
  selection everywhere: a handful of chrome sites have no token equivalent — translucent
  chrome-bar fills, floating-nav opacity/ring, and hover-borders — and still branch on
  `darkMode` directly, each documented inline at its call site. As shipped, that is
  `ReaderPage.tsx:758-760`, `:849`, `:864`, `:1096-1098`; `ReaderSkeleton.tsx:33`, `:38`;
  `ReaderSettingsSheet.tsx:34`; and `ReaderEpisodeSheet.tsx:55`, `:60`. Elsewhere the prop
  survives only where it picks a component variant (e.g. `tone: darkMode ? 'hero' : 'page'`)
  or has been dropped where a token now serves the role. See
  [reader-chrome.md](../conventions/reader-chrome.md), which already described this
  correctly.
- Light pages outside the Reader are unchanged.
- The Reader's light mode gains the light-mode deltas the design spec enumerates in "The
  pixel-identity trade" — `text-gray-500` at three sites and `text-gray-400` at one site,
  both moving to `text-gray-600` — which correct values `index.css` documents as failing AA
  (gray-500 at 4.42:1, gray-400 at 2.85:1). The design spec originally enumerated three
  delta groups in total (those two plus the immersive-side muted step from gray-300 to
  gray-400); Task 5's review found two further immersive-side deltas — `border-white/5` to
  `border-edge` at five chrome/card edges, and `text-white` to `text-ink` on
  `ReaderSheet.tsx`'s panel text — bringing the enumerated total to five, not three. The
  design spec's list, not this ADR, is the source of truth for the count.
- A token name must not shadow a Tailwind default scale key. `--color-base` collides with the built-in `--text-base` font-size step: a `--color-X` theme variable drives the `text-X` colour utility, so both `--text-base` (font-size) and `--color-base` (colour) feed the same utility. With both declared, `text-base` silently compiles to `color: var(--color-base)` and drops `font-size` portal-wide. The token is named `--color-canvas` instead.

## Alternatives considered

**CSS `dark:` variant strategy — rejected.** The `dark:` modifier is activated by `@media (prefers-color-scheme: dark)`, which follows OS preference. The Reader's dark preference is a device-local user setting, not OS preference. The Detail's hub hero is always dark regardless of OS setting. Neither scenario fits `dark:` semantics.

**Redefining the existing `--color-muted` and `--color-muted-strong` inside the immersive scope — rejected.** Those two tokens already serve light pages across the portal. Remapping them inside an immersive scope would make every call site theme-aware for free, which is tempting. Rejected because pages this issue does not touch should stay outside the scope of a reader change. Silently changing a portal-wide token from inside a scoped change is how a colour regression reaches a surface nobody tested. `--color-ink-muted` is a new token instead; reader sites move to it explicitly.

## Related

- [Design spec (2026-09-22)](../notes/2026-09-22-immersive-colour-tokens-design.md) — the token set, roles, and the pixel-identity trade
- [Immersive tokens testing](../notes/2026-09-22-immersive-colour-tokens-design.md#testing) — what "light pages unchanged" actually tests for
