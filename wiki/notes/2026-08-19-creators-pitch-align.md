---
title: Pitch funnel four-point align
type: note
date: 2026-08-19
tags: [contact, creators, faq, pitch, honesty, info, softgate]
impl: 116
---

# Impl 116 — Pitch funnel four-point align

Plan drafted as Impl 115; series rating star hit cells already used 115. This ships as **116**.

Help / FAQ / Contact IA was already Perfect. Four leftovers between Publish with Us and the pitch form:

1. Pitch `intent=submit` episode count **min 3** (handbook / do-not-send already required 3; form had `min={0}`). Contact form uses `noValidate` so EN/MM JS errors show instead of the browser min tooltip.
2. Pitch form handbook `Link` to `/creators#creators-specs` (bookmarking `?intent=submit` skipped the handbook). Default Contact does not show it.
3. FAQ `a14` states no in-portal upload; format and Send your pitch are on Publish with Us. Related stays `/creators`.
4. Creators `after2Desc` no longer invents “10 business days”. Demo; **no published reply SLA** (aligned with Contact `hours`).

## Verify

`npm run check`

## Next

Impl **117**
