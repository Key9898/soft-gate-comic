---
title: Author Follow on catalog profiles
type: note
date: 2026-08-19
tags: [author, follow, honesty, softgate]
impl: 148
---

# Impl 148 — Author Follow

`/author/:id` has Follow / Following. Store is `softgate_follows_v1` schema **1**, namespaced by signed-in `user.id`. Not `softgate_library_v1`. Guest click goes to `/login` with `from`. Copy says this is not a public follower count. `author.followerCount` is not shown.

No Library Following tab. No author-update notices. For You, Daily, and wait-for-free are unchanged.

## Verify

`npx vitest run src/test/AuthorPage.test.tsx src/test/authorFollows.test.ts src/test/accountDataMigration.test.ts src/test/LegalPages.test.tsx`

## Next

Impl **149**.
