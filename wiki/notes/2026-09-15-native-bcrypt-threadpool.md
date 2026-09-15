---
title: Impl 222 — Native bcrypt and a host-sized libuv threadpool
type: note
date: 2026-09-15
tags: [api, auth, performance, bcrypt, threadpool, softgate]
impl: 222
---

# Impl 222 — Native bcrypt and a host-sized libuv threadpool

GitHub #25, split out of #24. Two commits, one concern: password hashing was running on the event loop, and moving it off exposed a second ceiling immediately behind it.

## The problem was starvation, not latency

`apps/api` hashed with `bcryptjs` — the pure-JS implementation — at cost 12. The per-hash cost was never the interesting part. `bcryptjs`'s async API chunks its work with `setImmediate`, so it is not a hard block, but every chunk still runs on the main thread. Probing one async cost-12 hash with a 10ms `setInterval`:

```
async hash 218ms   timer ticks fired during it: 3   (expected ~21 if fully non-blocking)
```

Roughly 86% of the event loop gone during a single hash, before any concurrency. Under ten concurrent hashes the serialisation is unmistakable:

|                    | bcryptjs | native bcrypt |
| ------------------ | -------- | ------------- |
| One hash, cost 12  | 226 ms   | 213 ms        |
| Ten concurrent     | 2172 ms  | **648 ms**    |
| Max event-loop lag | 1000 ms  | **2 ms**      |

Ten concurrent hashes taking ten times one hash is the definition of no parallelism. The consequence was the third row: a burst of ten logins added a full second of latency to every unrelated request in the process — catalog reads, episode fetches, everything. `apps/api` is one long-lived Node process, so that cost was shared.

Native `bcrypt` runs the same algorithm in a C++ addon dispatched to libuv's threadpool. The single-hash figure barely moves, which is correct — the work is the same work. What changes is where it happens.

## No migration

bcrypt records cost and salt inside the hash, and both libraries produce and accept the same `$2b$` format, so stored hashes verify unchanged across the swap. `passwordConcurrency.test.ts` pins a hash literally written by the previous `bcryptjs` deployment and verifies it through native `bcrypt`, so this is proven rather than assumed. No stored data touched, no logins invalidated.

`bcrypt` is a native module with a postinstall build, so it is added to the root `pnpm.onlyBuiltDependencies` allowlist. Without that entry pnpm skips the build silently and the import fails at runtime rather than at install — a failure mode worth naming, because it would first appear in production.

#24's `NODE_ENV=test` cost drop survives unchanged. Native `bcrypt` takes the same cost argument, so `BCRYPT_COST` still resolves to 4 under test and 12 everywhere else, and the API suite stays fast. Cost 12 in production was deliberately left at 12: this change moves the work, it does not do less of it.

## The second ceiling

Moving hashing onto the threadpool makes the pool size the login ceiling. libuv defaults to **4 threads regardless of core count**, so the fifth concurrent login queues behind the first four. Measured: ten concurrent cost-12 hashes took 699ms at a pool of 4 and 295ms at 12.

`resolveThreadpoolSize` sizes the pool from the host, clamped to `[4, 16]` — never below libuv's own default, because that would be a regression, and capped because threads past the core count stop helping while each still costs a stack.

An explicitly set `UV_THREADPOOL_SIZE` is left alone. An operator who set it knows the box better than a heuristic does.

The awkward part is _when_ it has to be set. libuv reads the size once, when the pool is first used, so assigning it inside the server is a race against whatever touches the pool first. `scripts/start.js` therefore sets it and spawns the server as a child with the value already in its environment — the only way to be certain it took. The launcher forwards `SIGINT`/`SIGTERM` so the container stop path still reaches the server, and propagates the child's exit code and signal.

## Verification

22 tests across the four auth files in 1.67s. Re-measured after the swap on an idle machine:

```
one hash cost12: 213ms
ten concurrent: 648ms | max event-loop lag: 2ms
```

Against the #25 baseline: concurrency 3.4x better, event-loop lag 500x better, single-hash cost unchanged.

## Left open

Nothing outstanding on #25. `argon2` is the current recommendation for new systems, but it is also a native module and carries a hash-format migration on top, so it was not worth the disruption for a system whose bcrypt cost is already sound. `node:crypto` `scrypt` would remove the native dependency entirely but needs verify-old-then-rehash-on-login. Both were weighed on the issue and declined in favour of the drop-in.

The `pnpm.onlyBuiltDependencies` entry is a standing requirement, not a one-off: any future native dependency needs the same treatment or it will fail at runtime.
