---
title: Impl 228 — One predicate decides which series get an OG image
type: note
date: 2026-09-15
tags: [portal, seo, og, images, softgate]
impl: 228
---

# Impl 228 — One predicate decides which series get an OG image

Filed as "add a staleness guard for `generate:og`". Checking first showed that is not the gap.

## The staleness guard is not needed

`generate:og` runs inside the portal build (Impl 223 / `4d64c60`) and its output is gitignored, so the OG images are regenerated on every deploy. There is no committed artifact that can go stale, and a content-hash manifest like `image-variants.json` would guard nothing.

The loose-end note claiming otherwise was written before that change landed and never corrected.

## The real gap: two predicates that could disagree

`ogImageForWebtoon` emitted `/og/{id}.png` for **any** webtoon with a local `/webtoon-covers/` path. `generate-og-images.ts` generated for non-draft webtoons with a local cover **that exists on disk**.

Those conditions are not the same. A draft series with a local cover satisfied the page's condition and failed the generator's, so the page would have advertised an `og:image` that was never produced — and every share of that series would have resolved to a 404 image.

Today the sets happen to agree: all nine series are non-draft with local covers, so nothing is broken right now. The divergence is latent, and the failure mode is silent in both directions:

- the generator's skip was a `console.warn` inside a build log nobody reads
- the 404 only appears when someone shares a link, on a surface the product cannot see

## The fix is structural, not a test

`hasGeneratedOgImage(webtoon)` now lives beside `ogImageForWebtoon` in `src/lib/seo/ogImage.ts`, and **the generator imports it**. There is one predicate, so the page and the generator cannot drift.

The generator's missing-cover case also changed from `console.warn` + `continue` to a thrown error. By the time that branch is reached the page is already advertising an `og:image` for that series, so a missing cover is a guaranteed 404 rather than something to skip past. Failing the build is the honest response.

## Guards

- Every webtoon's advertised state must equal `hasGeneratedOgImage` — pins the contract itself, not one example.
- Every advertised image must exist on disk once built (skipped before the generator has run, same caveat as the cover variants).
- A draft with a local cover is not advertised.

Both were exercised rather than assumed. The draft case was probed with a temporary test; the missing-cover case by moving `blood-moon.png` aside:

```
Error: 7 (Blood Moon) advertises an og:image but its cover is missing at .../blood-moon.png
```

## A near miss worth recording

The first attempt to probe the draft path edited `data.ts` with a Python script whose `rfind` returned `-1`, which appended a duplicate of the entire file — 1360 spurious lines. It was caught by reading `git diff --stat` before doing anything else, and restored from a backup taken first.

Two habits did the work: copy the file before a scripted edit, and read the diff rather than trusting the script's own output. The probe was then done against the predicate directly, with no file surgery, which is what it should have been from the start.

## Verification

`pnpm check` green: 6/6 tasks, 109 portal + 38 API test files.
