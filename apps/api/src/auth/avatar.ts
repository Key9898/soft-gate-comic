export const MAX_AVATAR_FILE_BYTES = 524288

export const MAX_AVATAR_DATA_URL_CHARS = Math.ceil((MAX_AVATAR_FILE_BYTES * 4) / 3) + 32

const AVATAR_DATA_URL_RE = /^data:image\/(jpeg|jpg|png|webp);base64,/i

export function isAllowedAvatarDataUrl(value: string): boolean {
  return value.length <= MAX_AVATAR_DATA_URL_CHARS && AVATAR_DATA_URL_RE.test(value)
}
