import type { Episode } from './types'

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
