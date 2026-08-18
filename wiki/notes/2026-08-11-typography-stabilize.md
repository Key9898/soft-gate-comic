---
title: Typography stack + bold-flicker stabilize
type: note
date: 2026-08-11
tags: [impl, typography, fonts]
impl: 12
---

# Typography stack + bold-flicker stabilize

Impl 12 wires Inter + Noto Sans Myanmar, bans 800/900 weights, stabilizes selected-state weights, removes unloaded serif toggles on legal pages.

## Key files

- `index.html` — Google Fonts Inter + Noto Sans Myanmar
- `src/index.css` — `--font-sans` / `--font-mono` + `body font-sans`
- Feature pages: weight normalize; Reader/TOC/sort/floating labels; Privacy/Terms/Cookies serif removal

## Verify

`npm run check`; `rg "font-(black|extrabold)" src` empty; EN/MM LanguageSwitcher visual check.

## Docs

- [conventions/typography.md](../conventions/typography.md)
- [decisions/003-softgate-type-stack.md](../decisions/003-softgate-type-stack.md)
