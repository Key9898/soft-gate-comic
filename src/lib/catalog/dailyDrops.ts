import type { Episode, UploadDay, Webtoon } from '@softgate/shared'
import { DISCOVERY_RAIL_CAP, publishedWebtoons } from './discovery'

export const YANGON_TZ = 'Asia/Yangon'

export const UPLOAD_DAY_ORDER: readonly UploadDay[] = [1, 2, 3, 4, 5, 6, 0]

const WEEKDAY_SHORT: Record<string, UploadDay> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

const dropAtFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: YANGON_TZ,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export interface DailyDrop {
  webtoon: Webtoon
  episode: Episode
}

export const parseScheduledAt = (scheduledAt: string | undefined): number | null => {
  if (!scheduledAt) return null
  const ms = Date.parse(scheduledAt)
  return Number.isFinite(ms) ? ms : null
}

export const weekdayInYangon = (at: Date | string): UploadDay => {
  const date = typeof at === 'string' ? new Date(at) : at
  const short = new Intl.DateTimeFormat('en-US', {
    timeZone: YANGON_TZ,
    weekday: 'short',
  }).format(date)
  const day = WEEKDAY_SHORT[short]
  if (day === undefined) {
    throw new Error(`weekdayInYangon: unexpected weekday ${short}`)
  }
  return day
}

export const todayWeekday = (now: Date = new Date()): UploadDay => weekdayInYangon(now)

export const isDailyScheduledEpisode = (episode: Episode): boolean =>
  episode.status === 'scheduled' && parseScheduledAt(episode.scheduledAt) !== null

const byScheduledAt = (a: Episode, b: Episode) => {
  const byTime = parseScheduledAt(a.scheduledAt)! - parseScheduledAt(b.scheduledAt)!
  if (byTime !== 0) return byTime
  return a.id.localeCompare(b.id)
}

export const nextDropForSeries = (episodes: Episode[], webtoonId: string): Episode | undefined => {
  const scheduled = episodes.filter(
    (episode) => episode.webtoonId === webtoonId && isDailyScheduledEpisode(episode)
  )
  if (scheduled.length === 0) return undefined
  return [...scheduled].sort(byScheduledAt)[0]
}

export const dailyDrops = (
  webtoons: Webtoon[],
  episodes: Episode[],
  day: UploadDay,
  cap: number = DISCOVERY_RAIL_CAP
): DailyDrop[] => {
  const seriesById = new Map(
    publishedWebtoons(webtoons).map((webtoon) => [webtoon.id, webtoon] as const)
  )
  const soonestOnDay = new Map<string, Episode>()

  for (const episode of episodes) {
    if (!isDailyScheduledEpisode(episode)) continue
    if (weekdayInYangon(episode.scheduledAt!) !== day) continue
    const series = seriesById.get(episode.webtoonId)
    if (!series) continue
    const current = soonestOnDay.get(episode.webtoonId)
    if (!current || byScheduledAt(episode, current) < 0) {
      soonestOnDay.set(episode.webtoonId, episode)
    }
  }

  return [...soonestOnDay.entries()]
    .map(([webtoonId, episode]) => ({
      webtoon: seriesById.get(webtoonId)!,
      episode,
    }))
    .sort((a, b) => {
      const byTime = byScheduledAt(a.episode, b.episode)
      if (byTime !== 0) return byTime
      return a.webtoon.id.localeCompare(b.webtoon.id)
    })
    .slice(0, cap)
}

export const dropRemainingMs = (scheduledAt: string, now: number = Date.now()): number => {
  const at = parseScheduledAt(scheduledAt)
  if (at === null) return 0
  return at - now
}

export const formatDropCountdown = (ms: number): string => {
  if (ms <= 0) return ''
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`
  return `${hours}h ${minutes}m ${seconds}s`
}

export const formatDropAtYangon = (iso: string): string => {
  const at = parseScheduledAt(iso)
  if (at === null) return iso
  return dropAtFormat.format(new Date(at)).replace(/[\u00a0\u202f]/g, ' ')
}
