export interface HistoryRecord {
  webtoonId: string
  episodeNumber: number
  lastReadAt: string
  /** 0..1 scroll progress within the current episode */
  scrollRatio?: number
  /** Episodes actually opened (not 1..N assumption). Legacy records lack this field. */
  readEpisodeNumbers?: number[]
}

export interface UserEngagement {
  history: HistoryRecord[]
  likedWebtoonIds: string[]
  ratings: Record<string, number>
}

export const ENGAGEMENT_SCHEMA_VERSION = 3

export interface EngagementStore {
  schemaVersion: number
  byUserId: Record<string, UserEngagement>
}
