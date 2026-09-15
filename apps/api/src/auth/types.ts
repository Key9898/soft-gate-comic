export type ReaderPublicUser = {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  createdAt: string
}

export const MIN_PASSWORD_LENGTH = 8
export const MIN_USERNAME_LENGTH = 3
/**
 * The cost every real deployment uses. Never lower this.
 */
export const PRODUCTION_BCRYPT_COST = 12

/**
 * Tests only. `bcryptjs` is pure JS, so cost 12 is ~220ms per hash or compare
 * on an idle machine. The auth suites chain several of those per test, which
 * pushed them past Vitest's 5s default under CPU contention — see #24.
 *
 * The switch reads NODE_ENV directly rather than taking an env var, so there is
 * no setting a deployment can get wrong: only a process that already declares
 * itself a test run gets the cheap cost. bcrypt records the cost inside each
 * hash, so a hash written at 12 still verifies here.
 */
export const BCRYPT_COST = process.env.NODE_ENV === 'test' ? 4 : PRODUCTION_BCRYPT_COST

export const ACCESS_COOKIE = 'sg_reader'
export const REFRESH_COOKIE = 'sg_reader_refresh'
export const ACCESS_MAX_AGE = 15 * 60
export const REFRESH_MAX_AGE = 7 * 24 * 60 * 60
