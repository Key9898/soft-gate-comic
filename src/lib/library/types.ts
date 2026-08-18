export interface BookmarkRecord {
  webtoonId: string
  addedAt: string
}

export const LIBRARY_SCHEMA_VERSION = 1

export interface LibraryStore {
  schemaVersion: number
  byUserId: Record<string, BookmarkRecord[]>
}
