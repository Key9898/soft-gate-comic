export const COMMENT_MAX_LENGTH = 500
export const COMMENT_REPLY_TITLE_KEY = 'notificationsPage.commentReply'
export const COMMENT_REPLY_BODY_EN = 'Someone replied to your comment.'

export function isCommentKey(key: string): boolean {
  const trimmed = key.trim()
  if (!trimmed) return false
  return /^.+:series$/.test(trimmed) || /^.+:[1-9]\d*$/.test(trimmed)
}

export function hrefFromCommentKey(episodeKey: string): string {
  if (episodeKey.endsWith(':series')) {
    return `/webtoon/${episodeKey.slice(0, -':series'.length)}`
  }
  const colon = episodeKey.lastIndexOf(':')
  const id = episodeKey.slice(0, colon)
  const episodeNumber = episodeKey.slice(colon + 1)
  return `/read/${id}/${episodeNumber}`
}

export function webtoonIdFromCommentKey(episodeKey: string): string {
  const colon = episodeKey.lastIndexOf(':')
  return colon === -1 ? episodeKey : episodeKey.slice(0, colon)
}

export function episodeNumberFromCommentKey(episodeKey: string): number | undefined {
  if (episodeKey.endsWith(':series')) return undefined
  const colon = episodeKey.lastIndexOf(':')
  const n = Number(episodeKey.slice(colon + 1))
  return Number.isInteger(n) && n >= 1 ? n : undefined
}
