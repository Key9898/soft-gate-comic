---
title: Impl 227 — Series titles are one string in both locales
type: note
date: 2026-09-15
tags: [portal, i18n, catalog, search, softgate]
impl: 227
---

# Impl 227 — Series titles are one string in both locales

Follows #29, which was closed as not planned: five of nine series titles had `mm` values identical to their English strings. Closing it decided those five stay English — which left the catalogue in a state with no rule. Four titles were Burmese (`ဆိုးလ်မြို့က ချစ်ခြင်းတရား`, `ရွှေခေတ်`, `သွေးနက်လ`, `တက္ကသိုလ်ဘဝ`) and five were Latin, sitting side by side in the same rail with nothing distinguishing them.

That reads as an unfinished translation rather than a decision. The owner chose the coherent direction: **one rule for all series titles**, applied by reverting the four translations rather than completing the five.

## Scope

18 occurrences across `packages/shared/src/data.ts`, in `title` and `webtoonTitle` fields only. Each episode repeats its series title, which is why four series produce eighteen edits.

**Descriptions and author names stay translated.** This is a decision about series titles as proper nouns, not a retreat from Burmese. `ကိုဇော်` is still the `mm` form of `Ko Zaw`, and every series description is still Burmese. A test pins both halves so a future sweep cannot read this as "stop translating".

## The dependency that would have broken silently

`DEMO_SEARCH_CHIPS` offers six suggested searches on the Search page. Two of them — `ဆိုးလ်` (Seoul) and `သွေးနက်လ` (Blood Moon) — matched **only** because those titles were Burmese. Reverting the titles left both chips pointing at nothing: a visitor taps a suggestion the product offered them and gets an empty result page.

The existing chip test would not have caught it. It asserts the list length, the six English labels, and their uniqueness — never that a chip finds anything. Both chips are now `Seoul` and `Blood Moon`, and a new test runs every chip through `searchWebtoons` and `searchAuthors` in **both** locales and requires at least one hit.

`Ko Zaw` keeps `ကိုဇော်`, and that chip still resolves, which is the check confirming author names were genuinely left alone.

The guard was watched failing by restoring one chip:

```
chip "Blood Moon" finds nothing for mm term "သွေးနက်လ": expected 0 to be greater than 0
```

**The first version of that test was vacuous and passed.** `searchWebtoons(webtoons, filters)` takes an options object, not `(list, term, lang)` — passing a bare string meant no query filter, so it returned the whole catalogue and every chip "found" something. It went green immediately, which was the tell: a test written to catch a live breakage should fail before it passes. Fixed to `{ q: term, lang }`, then confirmed failing.

## A test that pinned the opposite decision

`catalogLib.test.ts` had `keeps Love in Seoul MM literary and EN cover-brand`, asserting the exact Burmese string. The name records a deliberate past choice — literary Burmese for `mm`, cover branding for `en` — now reversed.

Replaced rather than deleted, with an assertion of the new rule across **every** series instead of one hardcoded pair, plus the companion test that descriptions and author names are still translated. A rule is worth more than a fixture, and the pair of tests makes the boundary of this decision explicit.

## Verification

`pnpm check` green: 6/6 tasks, 109 portal + 38 API test files.

## Note

This reverses translation work rather than adding it. If a Burmese speaker later decides these titles should be translated after all, the coherent version is to do **all nine**, restore the two demo chips to Burmese terms, and drop the identical-titles test. The rule matters more than the direction.
