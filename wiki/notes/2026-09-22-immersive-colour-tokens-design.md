# Immersive colour mode as real tokens

Design for issue #35. Written 2026-09-22.

## The decision

Webtoon Detail, the Reader and the Home hero overlays each hardcode their dark surfaces
per page. This replaces those literals with a semantic token set that re-binds under a
`data-theme="immersive"` scope.

Two things were settled before writing this, both recorded because neither is obvious from
the issue text.

**The hero overlay is deferred.** Issue #35 names three surfaces. The hero overlay is the
subject of PR #49 (issue #39), which is open and under review, and whose scrim stops were
tuned by measurement to hold 5.30:1 deck contrast. Converting it now would edit unmerged
lines and force that tuning to be re-derived against token names. The hero conversion
becomes a follow-up once #49 merges. This design covers Webtoon Detail and the Reader.

**Normalise the roles; do not freeze the inconsistency.** See "The pixel-identity trade".

## Why the two surfaces differ

They are not the same problem.

- **Webtoon Detail** has no light/dark toggle. Its hub hero is a fixed `bg-gray-900`
  (`WebtoonDetailPage.tsx:291`) with 19 dark literals around it. It is always immersive.
- **The Reader** treats dark as a _user preference_: `darkMode` in
  `apps/portal/src/lib/reader/prefs.ts`, default true, persisted per device. It is threaded
  as a prop through 18 files and branched in 37 ternaries.

So the mechanism has to serve a static scope and a toggled one with the same tokens.

## Mechanism

Semantic variables are declared in the existing `@theme` block in
`apps/portal/src/index.css` alongside the palette already there. A
`data-theme="immersive"` attribute on a subtree root re-binds them for everything inside.

- Webtoon Detail's hub hero sets the attribute statically.
- The Reader sets it when the `darkMode` pref is on and omits it when off, so the existing
  toggle keeps working — it drives CSS instead of markup branching.
- No other page sets it, which is what makes "light pages unchanged" testable rather than
  asserted.

The switching mechanism is recorded as **ADR 014**; the ADRs currently run to 013.

The prize is not only the tokens. With the values behind an attribute, the 37 ternaries
collapse to single class names and most of the `darkMode` prop threading through those 18
files stops being necessary.

## The token set

Derived from the pairs actually in use, not invented — the Figma Foundations frames named
in the issue were unreachable while writing this.

**On the key names.** The issue suggests keying them `--color-bg-surface`. In Tailwind v4 a
`--color-X` variable generates the utilities `bg-X`, `text-X` and `border-X`, so that key
would render as `bg-bg-surface` at every call site. The names below are chosen so the
generated utility reads naturally: `bg-surface`, `text-ink`, `border-edge`. A key also has
to clear Tailwind's own default theme namespaces, not just its siblings in this table:
`--color-base` collides with the default `--text-base` font-size step, because a
`--color-X` variable and Tailwind's font-size scale both feed the `text-X` utility — with
both `--text-base` and `--color-base` defined, `text-base` becomes ambiguous and Tailwind
silently resolves it to the colour, dropping `font-size` portal-wide. That token is named
`--color-canvas` instead, verified against every default namespace (color, font-size,
spacing, radius, shadow, leading, tracking, breakpoint, container) before use. Check a new
key the same way before adding it.

| Token                    | Immersive     | Light      | Utility              | Role                         |
| ------------------------ | ------------- | ---------- | -------------------- | ---------------------------- |
| `--color-canvas`         | `gray-950`    | `gray-50`  | `bg-canvas`          | page behind everything       |
| `--color-surface`        | `gray-900/60` | `white/80` | `bg-surface`         | cards and panels             |
| `--color-surface-nested` | `white/5`     | `gray-50`  | `bg-surface-nested`  | a panel inside a panel       |
| `--color-raised`         | `white/10`    | `gray-100` | `bg-raised`          | hover and pressed fills      |
| `--color-track`          | `gray-700`    | `gray-200` | `bg-track`           | progress and slider tracks   |
| `--color-ink`            | `gray-100`    | `gray-900` | `text-ink`           | titles and body              |
| `--color-ink-secondary`  | `gray-300`    | `gray-700` | `text-ink-secondary` | supporting copy              |
| `--color-ink-muted`      | `gray-400`    | `gray-600` | `text-ink-muted`     | meta, eyebrows, placeholders |
| `--color-edge`           | `white/10`    | `gray-200` | `border-edge`        | panel and control edges      |
| `--color-edge-subtle`    | `white/5`     | `gray-100` | `border-edge-subtle` | interior dividers            |
| `--color-danger-surface` | `red-500/10`  | `red-50`   | `bg-danger-surface`  | destructive confirm blocks   |
| `--color-danger-edge`    | `red-500/40`  | `red-200`  | `border-danger-edge` | the same blocks' edges       |

**On the existing `--color-muted`.** `index.css` already defines `--color-muted` and
`--color-muted-strong`, used portal-wide as `text-muted` / `text-muted-strong` on light
pages. Redefining them inside the immersive scope would make every existing `text-muted`
call site theme-aware for free, which is tempting — and rejected here. Those two serve
pages this issue does not touch, and silently changing a portal-wide token from inside a
reader change is how a colour regression reaches a surface nobody tested. `--color-ink-muted`
is a new, separate token; reader sites currently using `text-muted` move onto it explicitly.

`brand/primary` is not redefined. The existing `--color-primary-600` is already the
WCAG-safe teal the issue asks for, and the light palette comment in `index.css` documents
why. Aliasing it again under a second name would give the same colour two sources of truth.

**`--color-edge-subtle` as a fill, not just a border.** Two static, non-interactive
elements — the locked-episode lock badge in `ReaderPage.tsx` and `ReaderAdSlot.tsx`'s
container — use `bg-edge-subtle`, not a border. They were originally `white/5` on
`gray-100`, which is `edge-subtle`'s exact value pair; `raised` (`white/10`/`gray-100`)
only matched on the light side and was a Task 5 review finding. Reusing a
"divider"-named token as a background is a naming wrinkle, not a mismatch: the value is
what a decorative static fill needs, and neither site is ever hovered or pressed, so
`raised` — "hover and pressed fills" — was always the wrong role regardless of value.

## The pixel-identity trade

The issue's acceptance says "Light portal pages are pixel-identical before and after." The
Reader in light mode **is** a light portal page, and the existing pairs are internally
inconsistent, so the two goals cannot both hold:

- `darkMode ? 'text-gray-400' : 'text-gray-600'` — 4 sites
- `darkMode ? 'text-gray-400' : 'text-muted'` — 3 sites
- `darkMode ? 'text-gray-400' : 'text-gray-500'` — 3 sites

One dark value, three light values, same role. Collapsing them to `--color-ink-muted`
necessarily moves some pixels.

**The resolution:** normalise, and state the criterion precisely. Light pages _outside the
Reader_ are pixel-identical and tested as such. The Reader's light-mode deltas are
deliberate and enumerated here:

- `text-gray-500` at 3 muted sites becomes `gray-600`. Darker; contrast improves. The
  palette comment in `index.css` already says `gray-500` is 4.42:1 on the `gray-50` body
  and misses AA, so these three sites were failing and this fixes them.
- `text-gray-400` at 1 light-mode site becomes `gray-600`. That site was at 2.85:1, which
  the same comment calls failing at every size.
- Immersive-side muted settles on `gray-400`; the sites currently using `gray-300` for a
  muted role move one step dimmer.

Every other pair maps onto a token with no change of value, with two immersive-side
exceptions found in Task 5 review and enumerated here rather than silently shipped:

- `border-white/5` becomes `border-edge` (`white/10` immersive) at five static chrome/card
  edges — `ReaderPage.tsx`'s header and footer chrome bars, `ReaderSkeleton.tsx`'s mirrored
  header and footer chrome bars, and `ReaderCompleteCard.tsx`'s card border. All five paired
  `white/5` with `gray-200` on the light side, a combination no single token holds:
  `edge-subtle` is `white/5`/`gray-100` (light side off by one step) and `edge` is
  `white/10`/`gray-200` (light side exact, immersive doubled). `edge` is kept because its
  role — "panel and control edges" — is what these five sites actually are, unlike
  `edge-subtle`'s "interior dividers"; the doubled immersive opacity is a deliberate,
  accepted uplift to keep a chrome edge visible against the near-black immersive canvas,
  not an accident of the refactor.
- `text-white` becomes `text-ink` (`gray-100` immersive) on `ReaderSheet.tsx`'s panel text.
  The two values are visually indistinguishable (`white` vs. `rgb(243 244 246)`), and every
  other immersive title/body site already used `gray-100`, not literal white, before this
  refactor — `text-ink` brings this one outlier in line with the rest of the Reader instead
  of freezing its inconsistency.

## The comment composer's textarea fill: a one-off, not a token

Task 5 review found a regression: `CompleteComments.tsx`'s textarea was
`darkMode ? 'border-white/10 bg-white/5 text-gray-100' : 'border-gray-200 bg-white'` and
became `border-edge bg-surface-nested text-ink`. Border and text map cleanly onto tokens —
`border-edge` is `white/10`/`gray-200`, an exact match for both branches, and `text-ink` is
`gray-100`/(unset, which resolves the same as the light-mode default). The background does
not: `--color-surface-nested` is `gray-50` in light mode, not white, and the textarea's own
container (`nested`, same `bg-surface-nested`) already paints that surface. Collapsing both
onto the token left a light-mode reader with a comment field that has no fill distinction
from the panel behind it — gray-50 on gray-50, separated only by a 1px border.

**Resolution: keep the light branch literal at this one site**, not a thirteenth token.
`CompleteComments` already receives `darkMode` — it forwards it to `CommentsTeaser` — so a
ternary here does not reintroduce prop threading that was otherwise removed. The alternative
(a `--color-input-fill` token: immersive `white/5`, light `white`) was rejected as
speculative: this is the only site in the Reader where an input needs a fill distinct from
`surface-nested`, and YAGNI applies — a role table entry for a role no second call site
needs is the same mistake the status-badge descope (above) already avoided making. If a
second input-fill site appears, promote this literal to a token then, against two real call
sites instead of one imagined.

```
className={`border-edge text-ink w-full rounded-2xl border p-3 text-sm ${
  darkMode ? 'bg-white/5' : 'bg-white'
}`}
```

Verified in the running dev server: the textarea's computed `background-color` in light mode
is `rgb(255, 255, 255)` (was `rgb(249, 250, 251)`, the same as its `bg-surface-nested`
container, before this fix); the container stays `rgb(249, 250, 251)`.

## A delta the light-mode list above doesn't cover

The pixel-identity trade above only enumerates the Reader's deltas because, when this was
written, Webtoon Detail's hub hero had no counterpart — its `bg-gray-900` was assumed to
carry over at the same value. It doesn't. `--color-canvas`'s immersive binding is
`gray-950`, not `gray-900`, so converting the hero's section background from the literal
`bg-gray-900` to `bg-canvas` (Task 3) makes the hero visibly darker than it was.

This is the same call already made for the Reader's own canvas conversion (`bg-gray-950` /
`bg-gray-50` — never `gray-900`), applied consistently to the second surface that uses the
token: `canvas` has one immersive value, gray-950, and the hero adopts it rather than
getting a special-cased gray-900 the token doesn't otherwise carry. The hero was never
covered by the issue's pixel-identity guarantee in the first place — that guarantee is
scoped to "light pages outside the Reader," and the hero is the always-dark half of a page
that has no light hero state to stay identical to.

## Status badge family: an intentional descope

`WebtoonDetailPage.tsx`'s `statusConfig` (around lines 218–236) renders inside the hub
hero and has four entries — `ongoing` (emerald), `completed` (sky), `hiatus` (amber), and
`draft` (`bg-gray-400/20 text-gray-300`). The `draft` entry is a gray literal inside a
surface this issue otherwise clears of them, so it's worth stating the decision rather
than leaving it silently unconverted.

**Descoped, left literal.** Three of the four status colours are brand accents with no
entry in the twelve-token table — there is no `--color-status-*` role to convert _into_.
Tokenising only `draft` would fragment the badge family: three sibling badges styled as
literal Tailwind brand colours and a fourth styled through a semantic token, for a family
that reads as one visual set. Introducing four new tokens for a single four-way badge is
the speculative-generality this design otherwise avoids — nothing else in the portal needs
an ongoing/completed/hiatus/draft palette. `draft`'s `bg-gray-400/20 text-gray-300` stays
literal, matching its three siblings, and is excluded from the source sweep's hero
boundary for the same reason (see the sweep's own scope note in
`immersiveTokens.test.ts`).

## Two things that are not colour

`darkMode ? 'hero' : 'page'` and `darkMode ? 'dark' : 'light'` pass _variant_ props to
child components, not classes. They are not token candidates and stay as they are.

`darkMode ? 'text-muted' : 'text-muted'` has identical branches — dead branching that has
been doing nothing. It is deleted rather than tokenised.

## Staging

Two phases inside one branch, because the mechanism should be proven on the small surface
before the large one.

- **Phase A** — tokens in `@theme`, the `data-theme="immersive"` binding, ADR 014, and
  Webtoon Detail converted. 19 literals, no toggle, no prop threading.
- **Phase B** — the Reader converted: 37 ternaries, and the `darkMode` prop removed from
  the components that only used it to pick classes.

Phase A ships a working mechanism even if Phase B is deferred.

## Testing

- A source sweep asserting no `bg-gray-950`, `bg-gray-900`, `text-gray-400`-style literal
  in the converted files, in the manner of `apps/portal/src/test/SmallTypeWeight.test.tsx`,
  which already enforces a convention this way.
- `data-theme="immersive"` is present on Detail's hub hero, and on the Reader root only
  when the `darkMode` pref is on.
- Toggling the Reader's dark preference still changes the rendered theme, driven by the
  attribute rather than by class branching.
- The token declarations exist in the built stylesheet, not merely in source — the check
  `apps/portal/src/test/ChipRadiusWeight.test.tsx` performs for `--radius-chip`.
- A light page outside the Reader renders the same class names before and after.
- Contrast: `--color-ink-muted` on `--color-canvas` clears 4.5:1 in both modes, measured
  rather than assumed.

## Out of scope

- The Home hero overlay, pending PR #49. A follow-up issue is filed when this lands.
- Any colour change to light pages outside the Reader.
- The `text-muted` / `text-muted-strong` utilities already in `index.css`, which serve light
  pages across the portal and are not reader-specific.

## Acceptance

Restated from the issue, with the tension resolved: no hardcoded ink or gray literals
remain in Webtoon Detail or the Reader; light pages outside the Reader are pixel-identical;
the Reader's light-mode deltas are the enumerated list above and nothing else.
