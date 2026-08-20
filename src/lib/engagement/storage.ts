import { isValidRating } from '../rating'
import {
  ENGAGEMENT_SCHEMA_VERSION,
  type EngagementStore,
  type HistoryRecord,
  type UserEngagement,
} from './types'

const ACCEPTED_SCHEMA_VERSIONS = new Set([1, 2, 3])

export const STORAGE_KEY = 'softgate_engage_v1'

function emptyStore(): EngagementStore {
  return { schemaVersion: ENGAGEMENT_SCHEMA_VERSION, byUserId: {} }
}

function isHistory(item: unknown): item is HistoryRecord {
  if (!item || typeof item !== 'object') return false
  const h = item as Partial<HistoryRecord>
  if (
    typeof h.webtoonId !== 'string' ||
    typeof h.episodeNumber !== 'number' ||
    typeof h.lastReadAt !== 'string'
  ) {
    return false
  }
  if (h.scrollRatio !== undefined && typeof h.scrollRatio !== 'number') return false
  if (h.readEpisodeNumbers !== undefined && !Array.isArray(h.readEpisodeNumbers)) return false
  return true
}

function sanitizeReadEpisodes(raw: number[] | undefined, fallbackEpisode: number): number[] {
  const source = Array.isArray(raw) ? raw : [fallbackEpisode]
  const valid = source.filter((n) => typeof n === 'number' && Number.isFinite(n) && n > 0)
  return [...new Set(valid)].sort((a, b) => a - b)
}

function normalizeHistory(item: HistoryRecord): HistoryRecord {
  return {
    webtoonId: item.webtoonId,
    episodeNumber: item.episodeNumber,
    lastReadAt: item.lastReadAt,
    scrollRatio:
      typeof item.scrollRatio === 'number' && Number.isFinite(item.scrollRatio)
        ? Math.min(1, Math.max(0, item.scrollRatio))
        : 0,
    readEpisodeNumbers: sanitizeReadEpisodes(item.readEpisodeNumbers, item.episodeNumber),
  }
}

function sanitizeRatings(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const ratings: Record<string, number> = {}
  for (const [webtoonId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!webtoonId || !isValidRating(value)) continue
    ratings[webtoonId] = value
  }
  return ratings
}

function normalize(raw: unknown): UserEngagement | null {
  if (!raw || typeof raw !== 'object') return null
  const e = raw as Partial<UserEngagement>
  if (!Array.isArray(e.history)) return null
  return {
    history: e.history.filter(isHistory).map(normalizeHistory),
    likedWebtoonIds: Array.isArray(e.likedWebtoonIds)
      ? e.likedWebtoonIds.filter((id): id is string => typeof id === 'string')
      : [],
    ratings: sanitizeRatings(e.ratings),
  }
}

export function readStore(): EngagementStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<EngagementStore>
    const version = obj.schemaVersion
    if (
      typeof version !== 'number' ||
      !ACCEPTED_SCHEMA_VERSIONS.has(version) ||
      !obj.byUserId ||
      typeof obj.byUserId !== 'object'
    ) {
      return emptyStore()
    }
    const byUserId: Record<string, UserEngagement> = {}
    for (const [userId, value] of Object.entries(obj.byUserId)) {
      const normalized = normalize(value)
      if (normalized) byUserId[userId] = normalized
    }
    return { schemaVersion: ENGAGEMENT_SCHEMA_VERSION, byUserId }
  } catch {
    return emptyStore()
  }
}

export function writeStore(store: EngagementStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...store, schemaVersion: ENGAGEMENT_SCHEMA_VERSION })
  )
}
