---
title: R2 object-store helper
type: decision
date: 2026-09-08
tags: [api, r2, s3, object-store, softgate]
impl: 186
---

# R2 object-store helper

## Status

Accepted

## Context

Leader’s media stack is one shared Cloudflare R2 bucket. Admin and the portal API must not overwrite each other’s keys. Missing R2 env must not fail API boot (unlike Prisma). Public CDN origin may be `r2.dev` in staging and a custom domain later.

## Decision

- Empty or partial core R2 slots (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`) → `putObject` throws `R2_NOT_CONFIGURED`. No SDK call. Boot still listens.
- All four set → `@aws-sdk/client-s3` `PutObject` to `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`. No `ACL`. No boot ping.
- Object keys for this API are under `portal/` (`r2ObjectKey`). Relative keys are prepended. `admin/x` becomes `portal/admin/x`.
- `R2_PUBLIC_BASE_URL` is the only public origin. Unset → `publicUrl` is `undefined`. Do not hardcode `r2.dev`.
- No upload HTTP routes in 186. `GET /health` does not report R2.

## Consequences

- Portal API can put before a custom domain exists.
- Admin should use a different prefix (for example `admin/`) on the same bucket.
- Wrong credentials fail on put, not at boot.

## Alternatives considered

- Fail boot when R2 is unset — rejected; local/dev without Cloudflare must still serve catalog/auth.
- Prefix `covers/` — rejected; that is an asset type, not an owner split on a shared bucket.
- Extra `R2_ENDPOINT` env — rejected; endpoint is derived from account id.
