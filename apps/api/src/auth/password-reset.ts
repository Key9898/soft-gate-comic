import { createHash, randomBytes } from 'node:crypto'

export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000

export function newPasswordResetToken() {
  return randomBytes(32).toString('hex')
}

export function hashPasswordResetToken(raw: string) {
  return createHash('sha256').update(raw).digest('hex')
}

export function passwordResetUrl(clientUrl: string, raw: string) {
  return `${clientUrl.replace(/\/+$/, '')}/reset-password/${raw}`
}
