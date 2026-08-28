export interface FollowRecord {
  authorId: string
  addedAt: string
}

export const FOLLOWS_SCHEMA_VERSION = 1

export interface FollowsStore {
  schemaVersion: number
  byUserId: Record<string, FollowRecord[]>
}
