# API Prisma schema

This app shares a Postgres instance with the Admin CMS. `schema.prisma` therefore
holds two kinds of model, and they are governed by different rules.

## Website-owned tables

Everything above the `// BEGIN ADMIN-OWNED TABLES` marker — readers, wallet,
library, notifications, comments, and the catalog. The website owns these: it
reads and writes them, and it migrates them.

## Admin-owned tables

Everything between `// BEGIN ADMIN-OWNED TABLES` and `// END ADMIN-OWNED TABLES`:

| Area   | Models                                                       |
| ------ | ------------------------------------------------------------ |
| About  | `AboutHistory`, `AboutTeamMember`, `AboutTeamMeta`           |
| Press  | `PressMeta`, `PressNews`, `PressStill`                       |
| FAQ    | `FaqMeta`, `FaqItem`                                         |
| Cookie | `CookieMeta`, `CookieStorageRow`                             |
| Legal  | `PrivacyMeta`, `PrivacySection`, `TermsMeta`, `TermsSection` |

These belong to Admin. They are copied here only so Prisma can generate read
types for `/api/about`, `/api/press`, `/api/faq`, `/api/cookies`, and
`/api/legal`. The website never writes them and never migrates them. That is why
`prisma/migrations/` contains no migration for any of them, and why the newest
migration is still `20260910010000_reader_push_campaigns`.

## Do not run `prisma migrate dev`

`migrate dev` diffs the schema against the migration history and generates
whatever is missing. Run in this app it would generate a migration creating all
fourteen Admin-owned tables, which conflicts with Admin's authoritative
definitions on the shared database.

Use the committed script instead:

```bash
pnpm db:migrate
```

That is `prisma migrate deploy` — it applies migrations that are already
committed and never generates new ones. To add a migration for a
**website-owned** table, write the migration directory by hand, or generate it
in a scratch database whose schema contains only the website-owned half.

## Keeping the copy in sync

When Admin changes one of these tables, edit the copy here by hand to match.
Nothing detects drift automatically. A mismatched column surfaces at runtime as
a Prisma error that is not `P2021`, and the readers rethrow it as a 500 rather
than silently serving a stub — see the fallback tables in
`wiki/conventions/portal-press-read.md` and its siblings.

A missing table is different and is handled: every reader catches `P2021`
per table and falls back to its seed, so the site stays up while Admin is still
provisioning. `src/test/persistPrismaFallbacks.test.ts` covers that behaviour.

## Enforcement

`src/test/adminOwnedSchema.test.ts` fails if a model listed above drifts out of
the marked block, if a website-owned model drifts into it, or if any committed
migration references an Admin-owned table.
