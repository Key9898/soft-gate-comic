---
title: Impl 18 — HeroBook3D UX harden
type: note
date: 2026-08-11
tags: [impl, hero, book, a11y, softgate]
impl: 18
---

# Impl 18 — HeroBook3D UX harden

## What shipped

- Home/Detail heroes: section `overflow-visible`; backdrop layers `overflow-hidden` only.
- `HeroBook3D`: cover `Link` CTA; removed nested `role="button"`; focusout + relatedTarget; touch sticky open; scene padding for swing.
- Convention updated; tests for cover link, focus containment, coarse sticky open.

## Verify

`npm run check`

## Follow-up

Visual QA swing padding on narrow mobile; optional Storybook.
