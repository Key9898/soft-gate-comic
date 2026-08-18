---
title: SoftGate type stack (Inter + Noto Sans Myanmar)
type: decision
date: 2026-08-11
tags: [typography, fonts, softgate, i18n]
impl: 12
---

# SoftGate type stack (Inter + Noto Sans Myanmar)

## Status

Accepted

## Context

Inter was linked in `index.html` but not applied via CSS. Myanmar text fell back to anonymous system faces. UI used `font-black` / `font-extrabold` while only 400–700 were loaded, causing faux-bold flicker. Privacy/Terms/Cookies offered a Sans/Serif toggle without loading a serif webfont.

## Decision

- Primary stack: **Inter + Noto Sans Myanmar + system-ui**
- Weights limited to **400–700**; map former 800/900 usages to `font-bold`
- Selection states do not change font weight
- Remove unloaded serif toggle; keep mono only for payment data fields
- SoftGate uses two families max for product UI (primary + mono)

## Consequences

### Positive

- EN/MM share one wired stack; fewer FOUT/weight mismatches
- Bold flicker from synthetic weights and state toggles reduced
- Aligns with design-system guidance (≤3 families; role-mapped mono)

### Negative

- Marketing “extra black” display look is capped at 700
- Legal pages no longer offer serif reading mode

## Related

- [conventions/typography.md](../conventions/typography.md)
- [conventions/what-not-to-redo.md](../conventions/what-not-to-redo.md)
