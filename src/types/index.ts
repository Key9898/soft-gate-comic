export * from '@softgate/shared'

// Add any frontend-specific types here if needed in the future
export interface Bookmark {
  id: string
  webtoonId: string
  lastReadEpisodeId?: string
  createdAt: string
  updatedAt: string
}

export interface ReadingProgress {
  webtoonId: string
  episodeId: string
  progress: number
  lastReadAt: string
}
