---
title: Contact pitch fields for Publish with Us
type: note
date: 2026-08-19
tags: [contact, creators, intake, pitch, honesty, info, softgate]
impl: 112
---

# Impl 112 — Contact pitch fields for Publish with Us

`/creators` landing shipped in Impl 110. Impl 111 left `/contact?intent=submit` as subject + Message template. This Impl wires labeled pitch fields on that path only.

## What shipped

- `intent=submit`: subject-only prefill (`Series submission`); labeled series title, genre, finished episodes (`type="number"` `min={0}`), synopsis, required 3:4 cover checkbox, optional other platforms and notes. Reader writer checklist hidden. Mailto body is labels + values. Inbox stays `support@softgatecomic.com`.
- Default `/contact`: Name / Email / Subject / Message unchanged. No series title.
- Creators `#creators-cta` inbox line: `support@` in `translate="no"`.
- No second form on `/creators`, no `creators@`, no fake Upload.

## Verify

`npm run check`

## Next

Impl **113**
