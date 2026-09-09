export interface CommentUser {
  id: string
  username: string
  displayName: string
  avatar?: string
}

export interface StoredComment {
  id: string
  episodeKey: string
  userId: string
  user: CommentUser
  content: string
  likeCount: number
  createdAt: string
  isEdited?: boolean
  parentId?: string
  likedByUserIds?: string[]
  spoiler?: boolean
  reported?: boolean
}

export const COMMENTS_SCHEMA_VERSION = 1

export interface CommentsStore {
  schemaVersion: number
  byEpisodeKey: Record<string, StoredComment[]>
}
