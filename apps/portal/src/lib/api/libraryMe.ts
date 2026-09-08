import type { BookmarkRecord } from '../library'
import type { HistoryRecord } from '../engagement'

export type LibraryMe = {
  bookmarks: BookmarkRecord[]
  history: HistoryRecord[]
  likedWebtoonIds: string[]
}
