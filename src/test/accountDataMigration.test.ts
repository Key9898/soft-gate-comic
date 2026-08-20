import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { migrateUserData, deleteUserData } from '../lib/account'
import {
  ensureNotifications,
  addNotification,
  markAsRead,
  readStore as readNotificationsStore,
  getNotifPrefs,
  setNotifPrefs,
  readPrefsStore,
} from '../lib/notifications'
import {
  listHistory,
  listLikedWebtoonIds,
  recordHistory,
  toggleLike,
  readStore as readEngagementStore,
} from '../lib/engagement'
import {
  DEFAULT_SEED_BALANCE,
  demoTopUp,
  unlockEpisode,
  readStore as readWalletStore,
  getWallet,
} from '../lib/wallet'
import { listBookmarks, toggleBookmark, readStore as readLibraryStore } from '../lib/library'
import { listFollows, toggleFollow, readStore as readFollowsStore } from '../lib/follows'
import { confirmAge, readAgeConfirmStore } from '../lib/contentRating'
import {
  addComment,
  addReply,
  episodeCommentKey,
  listComments,
  toggleCommentLike,
} from '../lib/comments'

const store = new Map<string, string>()

const OLD_ID = 'u_old'
const NEW_ID = 'u_new'

const userA = { id: OLD_ID, username: 'olduser', displayName: 'Old User' }
const userB = { id: 'u_other', username: 'other', displayName: 'Other User' }

describe('account data migration', () => {
  beforeEach(() => {
    store.clear()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value)
        },
        removeItem: (key: string) => {
          store.delete(key)
        },
        clear: () => store.clear(),
        length: 0,
        key: () => null,
      },
    })
  })

  it('moves the four byUserId stores to the new id', () => {
    recordHistory(OLD_ID, 'wt-1', 3)
    toggleLike(OLD_ID, 'wt-2')
    demoTopUp(OLD_ID, 50, 'seed top-up')
    unlockEpisode(OLD_ID, '1', 4, 5, 'unlock ep 4')
    toggleBookmark(OLD_ID, 'wt-3')
    toggleFollow(OLD_ID, 'a-1')
    addNotification(OLD_ID, {
      id: 'n1',
      type: 'system',
      titleKey: 'notificationsPage.system',
      message: 'Demo notice',
      isRead: false,
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    markAsRead(OLD_ID, 'n1')
    setNotifPrefs(OLD_ID, { promotion: false })

    migrateUserData(OLD_ID, NEW_ID)

    expect(listHistory(NEW_ID)[0]?.webtoonId).toBe('wt-1')
    expect(listLikedWebtoonIds(NEW_ID)).toEqual(['wt-2'])
    const wallet = readWalletStore().byUserId[NEW_ID]
    expect(wallet?.balance).toBe(DEFAULT_SEED_BALANCE + 50 - 5)
    expect(wallet?.unlockedEpisodeKeys).toContain('1:4')
    expect(listBookmarks(NEW_ID).map((b) => b.webtoonId)).toEqual(['wt-3'])
    expect(listFollows(NEW_ID).map((row) => row.authorId)).toEqual(['a-1'])
    expect(readNotificationsStore().byUserId[NEW_ID]?.find((n) => n.id === 'n1')?.isRead).toBe(true)
    expect(getNotifPrefs(NEW_ID).promotion).toBe(false)
    expect(readPrefsStore().byUserId[OLD_ID]).toBeUndefined()

    expect(readEngagementStore().byUserId[OLD_ID]).toBeUndefined()
    expect(readWalletStore().byUserId[OLD_ID]).toBeUndefined()
    expect(readLibraryStore().byUserId[OLD_ID]).toBeUndefined()
    expect(readFollowsStore().byUserId[OLD_ID]).toBeUndefined()
    expect(readNotificationsStore().byUserId[OLD_ID]).toBeUndefined()
  })

  it('moves 18+ age confirm with the user id', () => {
    confirmAge(OLD_ID)
    migrateUserData(OLD_ID, NEW_ID)
    expect(readAgeConfirmStore().byUserId[NEW_ID]?.confirmedAt).toBeTruthy()
    expect(readAgeConfirmStore().byUserId[OLD_ID]).toBeUndefined()
    deleteUserData(NEW_ID)
    expect(readAgeConfirmStore().byUserId[NEW_ID]).toBeUndefined()
  })

  it('rewrites comment authorship and liker ids without changing counts', () => {
    const key = episodeCommentKey('1', 5)
    addComment(key, userA, 'Comment by old user')
    addComment(key, userB, 'Comment by other user')
    const [otherComment, ownComment] = [
      listComments(key).find((c) => c.userId === userB.id)!,
      listComments(key).find((c) => c.userId === OLD_ID)!,
    ]
    toggleCommentLike(key, ownComment.id, userB.id)
    toggleCommentLike(key, otherComment.id, OLD_ID)

    migrateUserData(OLD_ID, NEW_ID)

    const after = listComments(key)
    const migrated = after.find((c) => c.content === 'Comment by old user')!
    expect(migrated.userId).toBe(NEW_ID)
    expect(migrated.user.id).toBe(NEW_ID)
    expect(migrated.likedByUserIds).toEqual([userB.id])
    expect(migrated.likeCount).toBe(1)

    const other = after.find((c) => c.content === 'Comment by other user')!
    expect(other.likedByUserIds).toEqual([NEW_ID])
    expect(other.likeCount).toBe(1)
  })

  it('lets migrated data overwrite stale data under the new id', () => {
    demoTopUp(OLD_ID, 50, 'old account top-up')
    getWallet(NEW_ID)
    expect(readWalletStore().byUserId[NEW_ID]?.balance).toBe(DEFAULT_SEED_BALANCE)

    migrateUserData(OLD_ID, NEW_ID)
    expect(readWalletStore().byUserId[NEW_ID]?.balance).toBe(DEFAULT_SEED_BALANCE + 50)
    expect(readWalletStore().byUserId[OLD_ID]).toBeUndefined()
  })

  it('cascade-deletes user data, their comments with replies, and their likes', () => {
    recordHistory(OLD_ID, 'wt-1', 2)
    demoTopUp(OLD_ID, 50, 'seed')
    toggleBookmark(OLD_ID, 'wt-3')
    toggleFollow(OLD_ID, 'a-1')
    ensureNotifications(OLD_ID)
    setNotifPrefs(OLD_ID, { commentReply: false })

    const key = episodeCommentKey('1', 6)
    addComment(key, userA, 'Own comment')
    const ownComment = listComments(key).find((c) => c.userId === OLD_ID)!
    addReply(key, ownComment.id, userB, 'Reply by other user')
    addComment(key, userB, 'Standalone by other user')
    const standalone = listComments(key).find((c) => c.content === 'Standalone by other user')!
    toggleCommentLike(key, standalone.id, OLD_ID)

    deleteUserData(OLD_ID)

    expect(readEngagementStore().byUserId[OLD_ID]).toBeUndefined()
    expect(readWalletStore().byUserId[OLD_ID]).toBeUndefined()
    expect(readLibraryStore().byUserId[OLD_ID]).toBeUndefined()
    expect(readFollowsStore().byUserId[OLD_ID]).toBeUndefined()
    expect(readNotificationsStore().byUserId[OLD_ID]).toBeUndefined()
    expect(readPrefsStore().byUserId[OLD_ID]).toBeUndefined()

    const after = listComments(key)
    expect(after.find((c) => c.content === 'Own comment')).toBeUndefined()
    expect(after.find((c) => c.content === 'Reply by other user')).toBeUndefined()
    const kept = after.find((c) => c.content === 'Standalone by other user')!
    expect(kept.likedByUserIds).toEqual([])
    expect(kept.likeCount).toBe(0)
  })

  it('is a no-op for missing or identical ids', () => {
    demoTopUp(OLD_ID, 50, 'seed')
    migrateUserData(OLD_ID, OLD_ID)
    migrateUserData('', NEW_ID)
    deleteUserData('')
    expect(readWalletStore().byUserId[OLD_ID]?.balance).toBe(DEFAULT_SEED_BALANCE + 50)
  })

  it('migrates data on email change and cascades on delete via AuthContext', async () => {
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(AuthProvider, null, children)
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.register({
        username: 'migrator',
        displayName: 'Migrator',
        email: 'old@example.com',
        password: 'password',
      })
    })
    const oldId = result.current.user!.id
    demoTopUp(oldId, 50, 'seed top-up')
    toggleLike(oldId, 'wt-1')

    await act(async () => {
      await result.current.updateProfile({ email: 'new@example.com' })
    })
    const newId = result.current.user!.id
    expect(newId).not.toBe(oldId)
    expect(result.current.user?.email).toBe('new@example.com')
    expect(readWalletStore().byUserId[newId]?.balance).toBe(DEFAULT_SEED_BALANCE + 50)
    expect(listLikedWebtoonIds(newId)).toEqual(['wt-1'])
    expect(readWalletStore().byUserId[oldId]).toBeUndefined()
    expect(readEngagementStore().byUserId[oldId]).toBeUndefined()

    await act(async () => {
      await result.current.deleteAccount('password')
    })
    expect(result.current.user).toBeNull()
    expect(readWalletStore().byUserId[newId]).toBeUndefined()
    expect(readEngagementStore().byUserId[newId]).toBeUndefined()
  })
})
