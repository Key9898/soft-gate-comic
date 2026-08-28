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
export const BCRYPT_COST = 12

export const ACCESS_COOKIE = 'sg_reader'
export const REFRESH_COOKIE = 'sg_reader_refresh'
export const ACCESS_MAX_AGE = 15 * 60
export const REFRESH_MAX_AGE = 7 * 24 * 60 * 60
