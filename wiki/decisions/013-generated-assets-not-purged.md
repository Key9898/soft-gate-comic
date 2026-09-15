---
title: Generated image derivatives leave git going forward, but history stays
type: decision
date: 2026-09-15
tags: [git, images, build, history, softgate]
---

# Generated image derivatives leave git going forward, but history stays

## Status

Accepted

## Context

OG images (`public/og/`) and the AVIF/WebP ladder (`public/{webtoon-covers,banner}/r/`) were committed artifacts. Impl 223 moved both generators into the portal build and untracked the files, so they stop accumulating. That left the question of the ~11 MiB already in history.

The blobs do not split evenly, and where they sit is what decides this:

|                | Blobs | Size    | Earliest commit       | Reachable from     |
| -------------- | ----- | ------- | --------------------- | ------------------ |
| OG images      | 9     | 7.7 MiB | `1cc26cb`, 2026-08-28 | `main`             |
| Image variants | 90    | 3.5 MiB | `319ec97`, 2026-09-15 | `development` only |

## Decision

Do not rewrite history. The derivatives stay in the pack.

## Consequences

- `.git` stays around 37 MB. This is not a size anyone is paying for.
- `4d64c60` already stops the growth, which was the actual problem — regenerating the ladder no longer writes new blobs on every run.
- Anyone reading this later should not reopen it on size grounds alone. The numbers are above; they would have to change by an order of magnitude to shift the answer.

## Alternatives considered

**Rewrite all branches (`git filter-repo`) — rejected.** 69% of the payload is only reachable through `main`, the Vercel deploy branch, and its earliest commit predates every other branch. Purging it means rewriting production history from 2026-08-28 and force-pushing four branches. It also invalidates the commit SHAs cited in the closing comments of GitHub #24 and #25 and seven SHA-shaped references in `wiki/` and `docs/`. Eleven MiB does not buy that.

**Rewrite `development` only — rejected, and worse than either extreme.** It recovers just the 3.5 MiB of variants (about 10% of the pack) because the OG blobs stay reachable from `main`, while still requiring a force-push and still permanently diverging `development` from `main`'s shared history.

**Ran `git gc --prune=now` instead.** Non-destructive. It folded 1117 loose objects into the pack; `size-pack` reads larger afterwards (33.06 -> 36.61 MiB) because those objects moved _into_ the pack rather than sitting beside it. Total `.git` is 37 MB.

## Related

- [Impl 223](../notes/2026-09-15-responsive-image-pipeline.md) — the pipeline, and why `image-variants.json` stays tracked while the binaries do not.
