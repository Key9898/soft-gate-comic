import { Prisma } from '@prisma/client'

/**
 * P2021 is "the table does not exist". Every Admin-owned reader treats it as
 * "Admin has not provisioned this yet" and falls back to its seed, so the site
 * stays up while the CMS is still being set up.
 *
 * Any other Prisma error — a changed column type, for instance — is schema
 * drift and rethrows as a 500 rather than silently serving a stub. See
 * prisma/README.md.
 */
export function isMissingTable(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021'
}
