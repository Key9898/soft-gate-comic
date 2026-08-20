import type { Episode } from '@softgate/shared'
import { formatCatalogDate } from './formatCatalogDate'

export type WaitForFreeEpisode = Pick<Episode, 'isPremium' | 'freeAt'>

export const parseFreeAt = (freeAt: string | undefined): number | null => {
  if (!freeAt) return null
  const ms = Date.parse(freeAt)
  return Number.isFinite(ms) ? ms : null
}

export const hasWaitSchedule = (episode: WaitForFreeEpisode): boolean =>
  Boolean(episode.isPremium && parseFreeAt(episode.freeAt) !== null)

export const isWaitFreeNow = (episode: WaitForFreeEpisode, now: number = Date.now()): boolean => {
  if (!episode.isPremium) return false
  const at = parseFreeAt(episode.freeAt)
  if (at === null) return false
  return now >= at
}

export const isEpisodeLocked = (
  episode: WaitForFreeEpisode,
  unlocked: boolean,
  now: number = Date.now()
): boolean => episode.isPremium && !unlocked && !isWaitFreeNow(episode, now)

export const formatWaitFreeAt = (iso: string): string => {
  const ms = parseFreeAt(iso)
  if (ms === null) return iso
  const date = formatCatalogDate(iso)
  const hours = String(new Date(ms).getUTCHours()).padStart(2, '0')
  const minutes = String(new Date(ms).getUTCMinutes()).padStart(2, '0')
  return `${date}, ${hours}:${minutes} UTC`
}
