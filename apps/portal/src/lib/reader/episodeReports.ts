export const EPISODE_REPORTS_KEY = 'softgate_episode_reports_v1'
export const EPISODE_REPORTS_SCHEMA = 1 as const

type EpisodeReportsStore = {
  schemaVersion: typeof EPISODE_REPORTS_SCHEMA
  keys: string[]
}

function emptyStore(): EpisodeReportsStore {
  return { schemaVersion: EPISODE_REPORTS_SCHEMA, keys: [] }
}

export function episodeReportKey(webtoonId: string, episodeNumber: number): string {
  return `${webtoonId}:${episodeNumber}`
}

function readStore(): EpisodeReportsStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(EPISODE_REPORTS_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<EpisodeReportsStore>
    if (obj.schemaVersion !== EPISODE_REPORTS_SCHEMA || !Array.isArray(obj.keys)) {
      return emptyStore()
    }
    return {
      schemaVersion: EPISODE_REPORTS_SCHEMA,
      keys: obj.keys.filter((key): key is string => typeof key === 'string' && key.length > 0),
    }
  } catch {
    return emptyStore()
  }
}

function writeStore(store: EpisodeReportsStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(EPISODE_REPORTS_KEY, JSON.stringify(store))
}

export function hasEpisodeReport(webtoonId: string, episodeNumber: number): boolean {
  const key = episodeReportKey(webtoonId, episodeNumber)
  return readStore().keys.includes(key)
}

export function addEpisodeReport(webtoonId: string, episodeNumber: number): void {
  const key = episodeReportKey(webtoonId, episodeNumber)
  const store = readStore()
  if (store.keys.includes(key)) return
  writeStore({ schemaVersion: EPISODE_REPORTS_SCHEMA, keys: [...store.keys, key] })
}
