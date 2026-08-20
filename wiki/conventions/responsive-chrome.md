---
title: Responsive chrome
type: convention
date: 2026-08-13
tags: [responsive, layout, flexbox, overflow, tailwind, softgate]
impl: 77
---

# Responsive chrome

How the app shell (Navigation bar, page-level overflow) is kept fitting at every width. Rules here
are **measured**, not guessed — see the width budget below before changing any breakpoint.

## Breakpoint ladder (Navigation)

| Element                                      | Visible from |
| -------------------------------------------- | ------------ |
| Bar nav links (Categories/Popular/New)       | `md:` (768)  |
| Bell (members)                               | always       |
| Library + Coins icons, profile chip + logout | `lg:` (1024) |
| Desktop search box (`w-56`)                  | `xl:` (1280) |
| Search icon toggle + panel                   | below `xl:`  |
| Language label (Globe always shown)          | `xl:` (1280) |
| Guest Login button                           | `sm:` (640)  |
| Hamburger — members                          | below `lg:`  |
| Hamburger — guests                           | below `md:`  |

The hamburger's breakpoint is **conditional on auth state** (`isAuthenticated ? 'lg:hidden' : 'md:hidden'`)
because guests have nothing left to disclose once bar links (`md:`) and Login (`sm:`) are visible.
The menu panel must always carry the **same** conditional as its trigger, so a panel can never
outlive the button that opened it. Nav links are duplicated inside the menu, so that block is
`md:hidden` — at 768–1023 a member's menu shows account rows only.

## Width budget (the rule that decides breakpoints)

The row is `flex justify-between` with two groups inside `max-w-7xl` + `px-4 sm:px-6 lg:px-8`.
A band is safe only when:

```
leftGroup + rightGroup + headroom <= row.clientWidth
```

Measure per band with the dev server (jsdom cannot do layout). `scrollWidth` alone is **not** enough
— a squeezable child (an unpinned `<img>`) absorbs the deficit and reports zero overflow:

```js
const row = document.querySelector('nav .flex.h-16')
const L = row.firstElementChild.getBoundingClientRect().width
const R = row.lastElementChild.getBoundingClientRect().width
console.log(L, R, row.clientWidth, row.clientWidth - L - R) // last value must stay > 0
```

Trick that avoids 40 page reloads: load the app in a same-origin `<iframe>` and resize the iframe.
Media queries respond to iframe width, so one load covers every width. Validate the harness first by
appending a 500px `shrink-0` spacer and confirming overflow is reported.

Measured budget (Impl 77, member + `mm` = worst case, 15-char display name):

| Width | left | right | client | headroom |
| ----- | ---- | ----- | ------ | -------- |
| 320   | 58   | 212   | 288    | 18       |
| 768   | 474  | 212   | 720    | 34       |
| 1024  | 474  | 458   | 960    | 28       |
| 1280+ | 474  | 695   | 1216   | 47       |

Burmese nav labels are ~75px wider than English (474 vs 399), which is why `mm` sets every
breakpoint. Never tune a header breakpoint against English text alone.

## Flex safety nets — where they belong

- `min-w-0` goes on **text-bearing children that should ellipsize** (the profile `Link` so its name
  span can truncate). **Never** on an icon cluster: its children have `min-w-11` and cannot shrink,
  so the group would be sized below content and its icons would spill — and with the `clip` guard
  below they would be silently cut off instead of visibly squeezed.
- `truncate` + a `max-w-[Nch]` cap on any user-supplied name in chrome (`max-w-[10ch]` in the nav).
- `shrink-0` on icon links **and on the logo `<img>`** — replaced elements shrink below their
  intrinsic width in a flex row, which is silent (Impl 77 found the logo rendering at 35px instead
  of 58px on every `mm` desktop).
- `whitespace-nowrap` on bar nav links, so a shortfall becomes measurable overflow instead of text
  quietly wrapping to two lines inside the fixed `h-16` row.

## Page-level overflow guard

`html, body { overflow-x: clip }` in [src/index.css](../../src/index.css).

**Never `overflow-x: hidden`** — `hidden` creates a scroll container and breaks `position: sticky`
on the nav; `clip` clips identically without creating one. Verified under the guard: sticky nav
stays at `top: 0` while scrolled, ScrollToTop/toasts stay viewport-anchored, Modal dialogs stay
centered and hit-testable, Reader footer + settings sheet stay flush to the viewport bottom, and
`useScrollLock` still restores `overflow-x: clip` on close.

The guard is a **safety net, not a fix**: after it lands, page-level `scrollWidth` stops reporting
overflow, so the element-level headroom check above is the only diagnostic. Also note the document
scrollbar is hidden (Impl 47), so overflow never shows a scrollbar — it just pans.

## Text overflow in user content

Use `wrap-anywhere` (not `break-words`) for user-generated bodies inside flex rows — it factors
mid-word breaks into min-content sizing, which is what actually stops a 200-character unbroken
string from widening the row. `break-words` remains fine for short display values.

## Scroll rails

Horizontal rails use `@utility scrollbar-hide` (defined in `src/index.css`). There is no
`scrollbar-*` utility in Tailwind v4 — a typo like `scrollbar-none` silently does nothing, so assert
the class in a test when adding a rail.

## Skip link overlay (Impl 101)

The MainLayout skip-to-content control stays **outside** the nav flex (first child of the layout). Do not insert it into the `h-16` row — that would shove the logo right on focus.

On `:focus` it overlays the header: `position: fixed; left: 1rem; z-index: 50`, vertically centered on the `h-16` band below `safe-top`:

```css
top: calc(max(0px, env(safe-area-inset-top)) + 2rem);
transform: translateY(-50%);
```

Do not use viewport `top: 1rem` (sits higher than the logo). Hidden-until-Tab clip, native `#main-content` href, and chip colors stay as shipped in Impl 100.

## QA widths

320, 375, 640, 744, 768, 820, 834, 1024, 1032, 1280 × guest/member × `en`/`mm`.
WCAG 1.4.10 Reflow: at 320 CSS px (or 1280 @ 400% zoom) there must be no two-dimensional scrolling
and no clipped content.
