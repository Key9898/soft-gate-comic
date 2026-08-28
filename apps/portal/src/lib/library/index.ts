export type { BookmarkRecord, LibraryStore } from './types'
export { LIBRARY_SCHEMA_VERSION } from './types'
export { STORAGE_KEY, readStore, writeStore } from './storage'
export {
  listBookmarks,
  isBookmarked,
  toggleBookmark,
  setNotifyMuted,
  setLastNotifiedEpisodeNumber,
  removeBookmark,
  removeBookmarks,
} from './bookmarks'
