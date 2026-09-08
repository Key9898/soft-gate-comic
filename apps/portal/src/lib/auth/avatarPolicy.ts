export const MAX_AVATAR_FILE_BYTES = 524288

const AVATAR_FILE_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

export function isAllowedAvatarFile(file: File): boolean {
  return file.size <= MAX_AVATAR_FILE_BYTES && AVATAR_FILE_MIME.has(file.type)
}
