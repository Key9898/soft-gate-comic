---
title: Responsive header + overflow hardening
date: 2026-08-13
impl: 77
type: note
tags: [responsive, layout, flexbox, overflow, a11y, tailwind]
---

# Responsive header + overflow hardening (Impl 77)

Follow-up to the six-batch audit (Impl 69–76): the nav bar crowded in the tablet band because the
member cluster appeared at `sm:` while the bar nav links appeared at `md:`. Measuring the row to fix
it surfaced two silent defects nobody had reported.

## What changed

### Breakpoint ladder

Member cluster promoted `sm:` → `lg:` (Library, Coins, profile chip, logout); desktop search box
`sm:` → `xl:` with the existing 44px toggle covering everything below; language label
`sm:inline` → `xl:inline`; hamburger conditional (`lg:hidden` members / `md:hidden` guests) with the
menu panel carrying the same conditional; menu's duplicated nav-links block wrapped in `md:hidden`.
Full table in [responsive-chrome.md](../conventions/responsive-chrome.md).

### Two silent defects found by measurement

1. **The logo was being squeezed, not the row overflowing.** `<img className="h-11 w-auto">` had no
   `shrink-0`, so a replaced element absorbed the deficit: 58px → 47px at 1024 and **35px at 1280 and
   1440** in `mm` (a 40% shrink on every Burmese desktop, live before this Impl). Because the deficit
   was absorbed, `row.scrollWidth === row.clientWidth` reported "no overflow" — the exit criterion
   originally planned would have passed while the bug shipped. Fixed with `shrink-0`; the metric was
   changed to `clientWidth - leftGroup - rightGroup`.
2. **`scrollbar-none` on the Library tab rail was a no-op** (Tailwind v4 ships no `scrollbar-*`
   utility; the project utility is `scrollbar-hide`), so that rail showed a scrollbar while every
   other rail hid it.

### Fitting the measured budget

`mm` needed 1239px at 1280 (23 over) and 970px at 1024 (10 over). Recovered with: right-cluster
`lg:gap-2` (−20px in both bands), search box default `w-64` → `w-56` (−32px at `xl`), name cap
`max-w-[10ch]`. Worst case is now +28px at 1024 and +47px at 1280.

### Flex/text safety nets

`min-w-0` on the profile `Link` (**not** the icon cluster — see the convention for why that would
silently clip icons), `truncate max-w-[10ch]` on the display name, `shrink-0` on icon links + logo,
`whitespace-nowrap` on bar nav links, `wrap-anywhere` on comment bodies, `truncate` on commenter
names.

### Disclosure semantics

Hamburger and search toggle got `aria-expanded` + `aria-controls` wired to `useId()` ids on their
panels. The hamburger's misleading `common.viewAll` / `common.close` ternary was replaced with one
constant `nav.menu` key (en "Menu" / mm "မီနူး") — APG disclosure form: name stays fixed, state
lives in `aria-expanded`.

### Page guard

`html, body { overflow-x: clip }` — never `hidden` (it would break the sticky nav). Verified live:
sticky nav at `top: 0` while scrolled, fixed probe + ScrollToTop hit-testable, Modal centered
(448px, dead-centre of 1920), Reader settings sheet full-width flush to bottom with a
1920×1080 backdrop, `useScrollLock` restoring `overflow-x: clip`. Library edit bar / Coins wizard use
the identical `fixed inset-0 …` wrapper as the verified Modal, so they are covered by equivalence
(seeding a fake session to reach them was declined).

## Measurements

44 cells (10 widths + 1440 × guest/member × en/mm) all positive after the fix; tightest are member
@320 (+18, icon-only row) and guest `mm` @768 (+20). Method and the numbers are recorded in the
convention doc; the iframe-resize harness was validated with a 500px spacer probe before trusting
any zero.

## Tests

New [`src/test/ResponsiveChrome.test.tsx`](../../src/test/ResponsiveChrome.test.tsx) (13 cases):
ladder classes per auth state, logo/icon `shrink-0`, nav-link `whitespace-nowrap`, name
`truncate max-w-[10ch]`, profile `min-w-0`, an **anti-regression case asserting the right cluster has
no `min-w-0`**, `aria-expanded`/`aria-controls` round-trip, menu duplication hidden at `md`,
`nav.menu` in both locales, `scrollbar-hide` on the Library rail, `wrap-anywhere` on comment bodies.
`NavChrome.test.tsx` language-label assertion updated to `xl:inline`. Suite: **256** green.

Also verified in the production CSS that `wrap-anywhere` → `overflow-wrap:anywhere` and
`break-words` → `overflow-wrap:break-word` both emit under Tailwind 4.3.2 (so AboutPage keeps
`break-words`).

## Files

`Navigation.tsx`, `LanguageSwitcher.tsx`, `SearchAutocomplete.tsx`, `Comments.tsx`,
`LibraryPage.tsx`, `index.css`, locales en+mm, `ResponsiveChrome.test.tsx` (new),
`NavChrome.test.tsx`.
