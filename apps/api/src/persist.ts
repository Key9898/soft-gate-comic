import { randomUUID } from 'node:crypto'
import {
  getSharedData,
  isEpisodeLocked,
  publishedCatalogFrom,
  type PublishedCatalog,
} from '@softgate/shared/catalog'
import { STUB_PORTAL_SETTINGS, type PortalSettings } from '@softgate/shared/settings'
import { STUB_ABOUT, type PortalAbout } from './about/fromAdmin.js'
import { STUB_PRESS, type PortalPress } from './press/fromAdmin.js'
import { STUB_PRIVACY, STUB_TERMS, type PortalLegalPage } from './legal/fromAdmin.js'
import { STUB_FAQ, type PortalFaq } from './faq/fromAdmin.js'
import { STUB_COOKIES, type PortalCookies } from './cookiePolicy/fromAdmin.js'
import type { ReaderPublicUser } from './auth/types.js'
import { isDatabaseConfigured, type Env } from './env.js'
import { episodeUnlockKey, redactLockedEpisodeImages } from './paywall.js'
import {
  COMMENT_MAX_LENGTH,
  COMMENT_REPLY_BODY_EN,
  COMMENT_REPLY_TITLE_KEY,
  episodeNumberFromCommentKey,
  hrefFromCommentKey,
  webtoonIdFromCommentKey,
} from './comments/keys.js'

export type PersistKind = 'stub' | 'prisma'

export type StubReaderUser = {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  passwordHash: string
  createdAt: string
  lastLoginAt?: string
}

export type AuthFlags = {
  allowRegistration?: boolean
  maintenanceMode?: boolean
}

export type StubWalletTxnType = 'purchase' | 'spend' | 'refund' | 'bonus' | 'demo_topup'

export type StubWalletTransaction = {
  id: string
  type: StubWalletTxnType
  amount: number
  description: string
  balance: number
  createdAt: string
  packageId?: string
  episodeKey?: string
}

export type StubWallet = {
  balance: number
  seeded: boolean
  transactions: StubWalletTransaction[]
  unlockedEpisodeKeys: string[]
}

export type StubWalletPublic = {
  balance: number
  transactions: StubWalletTransaction[]
  unlockedEpisodeKeys: string[]
}

export type StubUnlockResult =
  | { ok: true; wallet: StubWalletPublic }
  | {
      ok: false
      reason: 'ALREADY_UNLOCKED' | 'INSUFFICIENT_COINS' | 'NOT_LOCKED' | 'EPISODE_NOT_FOUND'
    }

export const STUB_SEED_BALANCE = 150

export type ReaderProfilePatch = {
  displayName?: string
  email?: string
  bio?: string
  avatar?: string
}

export type LibraryBookmark = {
  webtoonId: string
  addedAt: string
  notifyMuted?: boolean
  lastNotifiedEpisodeNumber?: number
}

export type LibraryHistoryRecord = {
  webtoonId: string
  episodeNumber: number
  lastReadAt: string
  scrollRatio?: number
  readEpisodeNumbers: number[]
}

export type LibrarySnapshot = {
  bookmarks: LibraryBookmark[]
  history: LibraryHistoryRecord[]
  likedWebtoonIds: string[]
}

export type PersistNotificationType = 'new_episode' | 'comment_reply' | 'system' | 'promotion'

export type PersistNotification = {
  id: string
  type: PersistNotificationType
  titleKey: string
  message: string
  isRead: boolean
  createdAt: string
  href?: string
  data?: {
    webtoonId?: string
    episodeNumber?: number
  }
}

export type PersistListedReader = {
  id: string
  email: string
  displayName: string
}

export type PersistLibrarySubscriber = {
  userId: string
  notifyMuted: boolean
  lastNotifiedEpisodeNumber?: number
}

export type PersistPushSubscription = {
  endpoint: string
  p256dh: string
  auth: string
}

export type PersistCampaignType = 'system' | 'promotion'

export type PersistCampaign = {
  id: string
  type: PersistCampaignType
  titleKey: string
  message: string
  href?: string
  inbox: number
  emailed: number
  pushed: number
  skippedPref: number
  createdAt: string
}

export function sortLibrarySnapshot(snapshot: LibrarySnapshot): LibrarySnapshot {
  return {
    bookmarks: [...snapshot.bookmarks].sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    ),
    history: [...snapshot.history].sort(
      (a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime()
    ),
    likedWebtoonIds: [...snapshot.likedWebtoonIds],
  }
}

export function toLibraryBookmark(row: {
  webtoonId: string
  addedAt: string
  notifyMuted: boolean
  lastNotifiedEpisodeNumber?: number | null
}): LibraryBookmark {
  const bookmark: LibraryBookmark = {
    webtoonId: row.webtoonId,
    addedAt: row.addedAt,
  }
  if (row.notifyMuted) bookmark.notifyMuted = true
  if (typeof row.lastNotifiedEpisodeNumber === 'number') {
    bookmark.lastNotifiedEpisodeNumber = row.lastNotifiedEpisodeNumber
  }
  return bookmark
}

export function nextLibraryHistoryRecord(
  previous: LibraryHistoryRecord | undefined,
  webtoonId: string,
  episodeNumber: number,
  scrollRatio?: number
): LibraryHistoryRecord {
  const existing = previous ? previous.readEpisodeNumbers : []
  const readEpisodeNumbers = [...new Set([...existing, episodeNumber])].sort((a, b) => a - b)
  const sameEpisode = previous?.episodeNumber === episodeNumber
  const ratio =
    scrollRatio !== undefined
      ? Math.min(1, Math.max(0, scrollRatio))
      : sameEpisode
        ? (previous?.scrollRatio ?? 0)
        : 0
  return {
    webtoonId,
    episodeNumber,
    lastReadAt: new Date().toISOString(),
    scrollRatio: ratio,
    readEpisodeNumbers,
  }
}

export function sortNotifications(list: PersistNotification[]): PersistNotification[] {
  return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export type PersistCommentUser = {
  id: string
  username: string
  displayName: string
  avatar?: string
}

export type PersistComment = {
  id: string
  episodeKey: string
  userId: string
  user: PersistCommentUser
  content: string
  likeCount: number
  likedByUserIds: string[]
  createdAt: string
  isEdited?: boolean
  parentId?: string
  spoiler?: boolean
  reported?: boolean
}

export function sortComments(list: PersistComment[]): PersistComment[] {
  return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function clonePersistComment(comment: PersistComment): PersistComment {
  const next: PersistComment = {
    id: comment.id,
    episodeKey: comment.episodeKey,
    userId: comment.userId,
    user: { ...comment.user },
    content: comment.content,
    likeCount: comment.likedByUserIds.length,
    likedByUserIds: [...comment.likedByUserIds],
    createdAt: comment.createdAt,
  }
  if (comment.isEdited) next.isEdited = true
  if (comment.parentId) next.parentId = comment.parentId
  if (comment.spoiler) next.spoiler = true
  if (comment.reported) next.reported = true
  return next
}

export function toPersistNotification(row: {
  id: string
  type: PersistNotificationType
  titleKey: string
  message: string
  isRead: boolean
  createdAt: string
  href?: string | null
  webtoonId?: string | null
  episodeNumber?: number | null
}): PersistNotification {
  const item: PersistNotification = {
    id: row.id,
    type: row.type,
    titleKey: row.titleKey,
    message: row.message,
    isRead: row.isRead,
    createdAt: row.createdAt,
  }
  if (row.href) item.href = row.href
  const data: { webtoonId?: string; episodeNumber?: number } = {}
  if (row.webtoonId) data.webtoonId = row.webtoonId
  if (typeof row.episodeNumber === 'number') data.episodeNumber = row.episodeNumber
  if (data.webtoonId !== undefined || data.episodeNumber !== undefined) {
    item.data = data
  }
  return item
}

function clonePersistNotification(notification: PersistNotification): PersistNotification {
  return toPersistNotification({
    id: notification.id,
    type: notification.type,
    titleKey: notification.titleKey,
    message: notification.message,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
    href: notification.href,
    webtoonId: notification.data?.webtoonId,
    episodeNumber: notification.data?.episodeNumber,
  })
}

export type PersistFontSize = 'sm' | 'md' | 'lg'
export type PersistImageFit = 'fit' | 'full'

export type PersistNotifPrefs = {
  newEpisode: boolean
  commentReply: boolean
  promotion: boolean
}

export type PersistReaderPrefs = {
  darkMode: boolean
  brightness: number
  fontSize: PersistFontSize
  imageFit: PersistImageFit
}

export type PrefsSnapshot = {
  notifPrefs: PersistNotifPrefs
  readerPrefs: PersistReaderPrefs
}

export type PersistNotifPrefsPatch = Partial<PersistNotifPrefs>

export const DEFAULT_NOTIF_PREFS: PersistNotifPrefs = {
  newEpisode: true,
  commentReply: true,
  promotion: true,
}

export const DEFAULT_READER_PREFS: PersistReaderPrefs = {
  darkMode: true,
  brightness: 0.9,
  fontSize: 'md',
  imageFit: 'fit',
}

export function defaultPrefsSnapshot(): PrefsSnapshot {
  return {
    notifPrefs: { ...DEFAULT_NOTIF_PREFS },
    readerPrefs: { ...DEFAULT_READER_PREFS },
  }
}

export function normalizeBrightness(value: number): number {
  return Math.round(value * 100) / 100
}

export function clonePrefsSnapshot(snapshot: PrefsSnapshot): PrefsSnapshot {
  return {
    notifPrefs: { ...snapshot.notifPrefs },
    readerPrefs: { ...snapshot.readerPrefs },
  }
}

export type PersistPort = {
  kind: PersistKind
  ping(): Promise<{ ok: true }>
  getUnstrippedPublishedCatalog(): Promise<PublishedCatalog>
  getPublishedCatalog(userId?: string): Promise<PublishedCatalog>
  getPortalSettings(): Promise<PortalSettings>
  getAbout(): Promise<PortalAbout>
  getPress(): Promise<PortalPress>
  getPrivacy(): Promise<PortalLegalPage>
  getTerms(): Promise<PortalLegalPage>
  getFaq(): Promise<PortalFaq>
  getCookies(): Promise<PortalCookies>
  clearAuth(): Promise<void>
  setAuthFlags(flags: AuthFlags): void
  isRegistrationOpen(): Promise<boolean>
  findUserById(id: string): Promise<StubReaderUser | undefined>
  findUserByEmail(email: string): Promise<StubReaderUser | undefined>
  findUserByUsername(username: string): Promise<StubReaderUser | undefined>
  createUser(input: {
    email: string
    username: string
    displayName: string
    passwordHash: string
  }): Promise<StubReaderUser>
  touchLastLogin(id: string): Promise<void>
  saveRefreshJti(jti: string, userId: string): Promise<void>
  consumeRefreshJti(jti: string): Promise<string | undefined>
  revokeRefreshJti(jti: string): Promise<void>
  createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void>
  resetPasswordWithToken(
    tokenHash: string,
    passwordHash: string
  ): Promise<{ ok: true; email: string } | { ok: false }>
  updateReaderProfile(
    userId: string,
    patch: ReaderProfilePatch
  ): Promise<
    { ok: true; user: StubReaderUser } | { ok: false; reason: 'NOT_FOUND' | 'EMAIL_TAKEN' }
  >
  changeReaderPassword(userId: string, passwordHash: string): Promise<'ok' | 'not_found'>
  deleteReaderUser(userId: string): Promise<'ok' | 'not_found'>
  toPublicUser(user: StubReaderUser): ReaderPublicUser
  ensureWallet(userId: string): Promise<StubWallet>
  getWallet(userId: string): Promise<StubWalletPublic>
  setWalletBalance(userId: string, balance: number): Promise<void>
  demoTopUp(
    userId: string,
    coins: number,
    description: string,
    packageId?: string
  ): Promise<StubWalletPublic>
  unlockEpisode(userId: string, webtoonId: string, episodeNumber: number): Promise<StubUnlockResult>
  getLibrary(userId: string): Promise<LibrarySnapshot>
  toggleLibrarySubscribe(
    userId: string,
    webtoonId: string,
    lastNotifiedEpisodeNumber?: number
  ): Promise<LibrarySnapshot>
  setLibraryMute(userId: string, webtoonId: string, muted: boolean): Promise<LibrarySnapshot>
  stampLibraryNotified(
    userId: string,
    webtoonId: string,
    episodeNumber: number
  ): Promise<LibrarySnapshot>
  listLibrarySubscribers(webtoonId: string): Promise<PersistLibrarySubscriber[]>
  upsertLibraryHistory(
    userId: string,
    webtoonId: string,
    episodeNumber: number,
    scrollRatio?: number
  ): Promise<LibrarySnapshot>
  toggleLibraryLike(userId: string, webtoonId: string): Promise<LibrarySnapshot>
  removeLibraryBookmarks(userId: string, webtoonIds: string[]): Promise<LibrarySnapshot>
  removeLibraryHistory(userId: string, webtoonIds: string[]): Promise<LibrarySnapshot>
  removeLibraryLikes(userId: string, webtoonIds: string[]): Promise<LibrarySnapshot>
  getNotifications(userId: string): Promise<PersistNotification[]>
  upsertNotification(
    userId: string,
    notification: PersistNotification
  ): Promise<PersistNotification[]>
  markNotificationRead(userId: string, id: string): Promise<PersistNotification[]>
  markAllNotificationsRead(userId: string): Promise<PersistNotification[]>
  deleteNotification(userId: string, id: string): Promise<PersistNotification[]>
  clearReadNotifications(userId: string): Promise<PersistNotification[]>
  hasNotification(userId: string, id: string): Promise<boolean>
  listReaders(input: {
    q?: string
    limit: number
    offset: number
  }): Promise<{ total: number; readers: PersistListedReader[] }>
  listReaderIds(): Promise<string[]>
  listPushSubscriptions(userId: string): Promise<PersistPushSubscription[]>
  upsertPushSubscription(userId: string, subscription: PersistPushSubscription): Promise<void>
  deletePushSubscription(userId: string, endpoint: string): Promise<void>
  countUsersWithPush(): Promise<number>
  getCampaign(id: string): Promise<PersistCampaign | undefined>
  upsertCampaign(campaign: PersistCampaign): Promise<void>
  getPrefs(userId: string): Promise<PrefsSnapshot>
  patchNotifPrefs(userId: string, patch: PersistNotifPrefsPatch): Promise<PrefsSnapshot>
  setReaderPrefs(userId: string, reader: PersistReaderPrefs): Promise<PrefsSnapshot>
  listComments(episodeKey: string): Promise<PersistComment[]>
  addComment(
    episodeKey: string,
    userId: string,
    content: string,
    spoiler: boolean
  ): Promise<PersistComment[]>
  addReply(
    episodeKey: string,
    parentId: string,
    userId: string,
    content: string,
    spoiler: boolean
  ): Promise<PersistComment[]>
  updateComment(
    episodeKey: string,
    commentId: string,
    userId: string,
    content: string
  ): Promise<PersistComment[]>
  deleteComment(episodeKey: string, commentId: string, userId: string): Promise<PersistComment[]>
  toggleCommentLike(
    episodeKey: string,
    commentId: string,
    userId: string
  ): Promise<PersistComment[]>
  reportComment(episodeKey: string, commentId: string, userId: string): Promise<PersistComment[]>
}

export function toPublicUser(user: StubReaderUser): ReaderPublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.createdAt,
  }
}

function cloneWallet(wallet: StubWallet): StubWallet {
  return {
    ...wallet,
    transactions: [...wallet.transactions],
    unlockedEpisodeKeys: [...wallet.unlockedEpisodeKeys],
  }
}

function toPublicWallet(wallet: StubWallet): StubWalletPublic {
  return {
    balance: wallet.balance,
    transactions: [...wallet.transactions],
    unlockedEpisodeKeys: [...wallet.unlockedEpisodeKeys],
  }
}

export function createStubPersist(): PersistPort {
  const usersById = new Map<string, StubReaderUser>()
  const userIdByEmail = new Map<string, string>()
  const userIdByUsername = new Map<string, string>()
  const refreshUserByJti = new Map<string, string>()
  const passwordResetsByHash = new Map<string, { userId: string; expiresAt: number }>()
  const walletsByUserId = new Map<string, StubWallet>()
  const libraryBookmarksByUserId = new Map<string, Map<string, LibraryBookmark>>()
  const libraryHistoryByUserId = new Map<string, Map<string, LibraryHistoryRecord>>()
  const libraryLikesByUserId = new Map<string, string[]>()
  const notificationsByUserId = new Map<string, Map<string, PersistNotification>>()
  const prefsByUserId = new Map<string, PrefsSnapshot>()
  const commentsByKey = new Map<string, PersistComment[]>()
  const pushByUserId = new Map<string, Map<string, PersistPushSubscription>>()
  const campaignsById = new Map<string, PersistCampaign>()
  let authFlags: AuthFlags = {}

  const libraryFor = (userId: string) => {
    let bookmarks = libraryBookmarksByUserId.get(userId)
    if (!bookmarks) {
      bookmarks = new Map()
      libraryBookmarksByUserId.set(userId, bookmarks)
    }
    let history = libraryHistoryByUserId.get(userId)
    if (!history) {
      history = new Map()
      libraryHistoryByUserId.set(userId, history)
    }
    let likes = libraryLikesByUserId.get(userId)
    if (!likes) {
      likes = []
      libraryLikesByUserId.set(userId, likes)
    }
    return { bookmarks, history, likes }
  }

  const notificationsOf = (userId: string): PersistNotification[] => {
    const map = notificationsByUserId.get(userId)
    if (!map) return []
    return sortNotifications([...map.values()].map(clonePersistNotification))
  }

  const notificationMapOf = (userId: string) => {
    let map = notificationsByUserId.get(userId)
    if (!map) {
      map = new Map()
      notificationsByUserId.set(userId, map)
    }
    return map
  }

  const snapshotOf = (userId: string): LibrarySnapshot => {
    const { bookmarks, history, likes } = libraryFor(userId)
    return sortLibrarySnapshot({
      bookmarks: [...bookmarks.values()].map((row) =>
        toLibraryBookmark({
          webtoonId: row.webtoonId,
          addedAt: row.addedAt,
          notifyMuted: row.notifyMuted === true,
          lastNotifiedEpisodeNumber: row.lastNotifiedEpisodeNumber,
        })
      ),
      history: [...history.values()].map((row) => ({
        ...row,
        readEpisodeNumbers: [...row.readEpisodeNumbers],
      })),
      likedWebtoonIds: [...likes],
    })
  }

  const commentsOf = (episodeKey: string): PersistComment[] =>
    sortComments((commentsByKey.get(episodeKey) ?? []).map(clonePersistComment))

  const commentUserOf = (user: StubReaderUser): PersistCommentUser => {
    const next: PersistCommentUser = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
    }
    if (user.avatar) next.avatar = user.avatar
    return next
  }

  const writeComments = (episodeKey: string, list: PersistComment[]) => {
    if (list.length === 0) commentsByKey.delete(episodeKey)
    else commentsByKey.set(episodeKey, list)
  }

  const maybeNotifyCommentReply = (parent: PersistComment, actorId: string, episodeKey: string) => {
    if (parent.userId === actorId) return
    const prefs = prefsByUserId.get(parent.userId) ?? defaultPrefsSnapshot()
    if (!prefs.notifPrefs.commentReply) return
    const episodeNumber = episodeNumberFromCommentKey(episodeKey)
    const notification: PersistNotification = {
      id: `c-reply-${randomUUID()}`,
      type: 'comment_reply',
      titleKey: COMMENT_REPLY_TITLE_KEY,
      message: COMMENT_REPLY_BODY_EN,
      isRead: false,
      createdAt: new Date().toISOString(),
      href: hrefFromCommentKey(episodeKey),
      data: {
        webtoonId: webtoonIdFromCommentKey(episodeKey),
        ...(episodeNumber !== undefined ? { episodeNumber } : {}),
      },
    }
    notificationMapOf(parent.userId).set(notification.id, clonePersistNotification(notification))
  }

  const purgeUserComments = (userId: string) => {
    for (const [episodeKey, list] of commentsByKey) {
      const ownIds = new Set(list.filter((c) => c.userId === userId).map((c) => c.id))
      const kept = list
        .filter((c) => c.userId !== userId && !(c.parentId && ownIds.has(c.parentId)))
        .map((c) => {
          if (!c.likedByUserIds.includes(userId)) return c
          const likedByUserIds = c.likedByUserIds.filter((id) => id !== userId)
          return { ...c, likedByUserIds, likeCount: likedByUserIds.length }
        })
      writeComments(episodeKey, kept)
    }
  }

  const stub: PersistPort = {
    kind: 'stub',
    async ping() {
      return { ok: true as const }
    },
    async getUnstrippedPublishedCatalog() {
      return publishedCatalogFrom(getSharedData())
    },
    async getPublishedCatalog(userId?: string) {
      const catalog = await stub.getUnstrippedPublishedCatalog()
      const keys = userId ? (walletsByUserId.get(userId)?.unlockedEpisodeKeys ?? []) : []
      return redactLockedEpisodeImages(catalog, new Set(keys))
    },
    async getPortalSettings() {
      return STUB_PORTAL_SETTINGS
    },
    async getAbout() {
      return STUB_ABOUT
    },
    async getPress() {
      return STUB_PRESS
    },
    async getPrivacy() {
      return STUB_PRIVACY
    },
    async getTerms() {
      return STUB_TERMS
    },
    async getFaq() {
      return STUB_FAQ
    },
    async getCookies() {
      return STUB_COOKIES
    },
    async clearAuth() {
      usersById.clear()
      userIdByEmail.clear()
      userIdByUsername.clear()
      refreshUserByJti.clear()
      passwordResetsByHash.clear()
      walletsByUserId.clear()
      libraryBookmarksByUserId.clear()
      libraryHistoryByUserId.clear()
      libraryLikesByUserId.clear()
      notificationsByUserId.clear()
      prefsByUserId.clear()
      commentsByKey.clear()
      pushByUserId.clear()
      campaignsById.clear()
      authFlags = {}
    },
    setAuthFlags(flags: AuthFlags) {
      authFlags = { ...authFlags, ...flags }
    },
    async isRegistrationOpen() {
      const settings = await stub.getPortalSettings()
      const allowRegistration = authFlags.allowRegistration ?? settings.allowRegistration
      const maintenanceMode = authFlags.maintenanceMode ?? settings.maintenanceMode
      return allowRegistration && !maintenanceMode
    },
    async findUserById(id: string) {
      return usersById.get(id)
    },
    async findUserByEmail(email: string) {
      const id = userIdByEmail.get(email.trim().toLowerCase())
      return id ? usersById.get(id) : undefined
    },
    async findUserByUsername(username: string) {
      const id = userIdByUsername.get(username.trim().toLowerCase())
      return id ? usersById.get(id) : undefined
    },
    async createUser(input) {
      const id = randomUUID()
      const email = input.email.trim().toLowerCase()
      const username = input.username.trim()
      const user: StubReaderUser = {
        id,
        email,
        username,
        displayName: input.displayName.trim(),
        bio: '',
        passwordHash: input.passwordHash,
        createdAt: new Date().toISOString(),
      }
      usersById.set(id, user)
      userIdByEmail.set(email, id)
      userIdByUsername.set(username.toLowerCase(), id)
      return user
    },
    async touchLastLogin(id: string) {
      const user = usersById.get(id)
      if (!user) return
      usersById.set(id, { ...user, lastLoginAt: new Date().toISOString() })
    },
    async saveRefreshJti(jti: string, userId: string) {
      refreshUserByJti.set(jti, userId)
    },
    async consumeRefreshJti(jti: string) {
      const userId = refreshUserByJti.get(jti)
      if (!userId) return undefined
      refreshUserByJti.delete(jti)
      return userId
    },
    async revokeRefreshJti(jti: string) {
      refreshUserByJti.delete(jti)
    },
    async createPasswordResetToken(userId, tokenHash, expiresAt) {
      for (const [hash, row] of passwordResetsByHash) {
        if (row.userId === userId) passwordResetsByHash.delete(hash)
      }
      passwordResetsByHash.set(tokenHash, { userId, expiresAt: expiresAt.getTime() })
    },
    async resetPasswordWithToken(tokenHash, passwordHash) {
      const row = passwordResetsByHash.get(tokenHash)
      if (!row || row.expiresAt <= Date.now()) {
        passwordResetsByHash.delete(tokenHash)
        return { ok: false }
      }
      const user = usersById.get(row.userId)
      if (!user) {
        passwordResetsByHash.delete(tokenHash)
        return { ok: false }
      }
      usersById.set(row.userId, { ...user, passwordHash })
      passwordResetsByHash.delete(tokenHash)
      for (const [jti, userId] of refreshUserByJti) {
        if (userId === row.userId) refreshUserByJti.delete(jti)
      }
      return { ok: true, email: user.email }
    },
    async updateReaderProfile(userId, patch) {
      const user = usersById.get(userId)
      if (!user) return { ok: false, reason: 'NOT_FOUND' }
      const nextEmail = patch.email?.trim().toLowerCase()
      if (nextEmail && nextEmail !== user.email) {
        if (userIdByEmail.has(nextEmail)) return { ok: false, reason: 'EMAIL_TAKEN' }
        userIdByEmail.delete(user.email)
        userIdByEmail.set(nextEmail, userId)
      }
      const next: StubReaderUser = {
        ...user,
        displayName: patch.displayName !== undefined ? patch.displayName : user.displayName,
        email: nextEmail || user.email,
        bio: patch.bio !== undefined ? patch.bio : user.bio,
        avatar: patch.avatar !== undefined ? patch.avatar : user.avatar,
      }
      usersById.set(userId, next)
      return { ok: true, user: next }
    },
    async changeReaderPassword(userId, passwordHash) {
      const user = usersById.get(userId)
      if (!user) return 'not_found'
      usersById.set(userId, { ...user, passwordHash })
      return 'ok'
    },
    async deleteReaderUser(userId) {
      const user = usersById.get(userId)
      if (!user) return 'not_found'
      for (const [hash, row] of passwordResetsByHash) {
        if (row.userId === userId) passwordResetsByHash.delete(hash)
      }
      for (const [jti, id] of refreshUserByJti) {
        if (id === userId) refreshUserByJti.delete(jti)
      }
      purgeUserComments(userId)
      notificationsByUserId.delete(userId)
      prefsByUserId.delete(userId)
      pushByUserId.delete(userId)
      libraryLikesByUserId.delete(userId)
      libraryHistoryByUserId.delete(userId)
      libraryBookmarksByUserId.delete(userId)
      walletsByUserId.delete(userId)
      userIdByEmail.delete(user.email)
      userIdByUsername.delete(user.username.toLowerCase())
      usersById.delete(userId)
      return 'ok'
    },
    toPublicUser,
    async ensureWallet(userId: string) {
      const existing = walletsByUserId.get(userId)
      if (existing?.seeded) return cloneWallet(existing)
      const seeded: StubWallet = {
        balance: STUB_SEED_BALANCE,
        seeded: true,
        transactions: [
          {
            id: `seed-${userId}`,
            type: 'bonus',
            amount: STUB_SEED_BALANCE,
            description: 'Welcome demo balance',
            balance: STUB_SEED_BALANCE,
            createdAt: new Date().toISOString(),
          },
        ],
        unlockedEpisodeKeys: existing?.unlockedEpisodeKeys ?? [],
      }
      walletsByUserId.set(userId, seeded)
      return cloneWallet(seeded)
    },
    async getWallet(userId: string) {
      return toPublicWallet(await stub.ensureWallet(userId))
    },
    async setWalletBalance(userId: string, balance: number) {
      const wallet = await stub.ensureWallet(userId)
      walletsByUserId.set(userId, { ...wallet, balance })
    },
    async demoTopUp(userId, coins, description, packageId) {
      const wallet = await stub.ensureWallet(userId)
      const balance = wallet.balance + coins
      const txn: StubWalletTransaction = {
        id: `topup-${randomUUID()}`,
        type: 'demo_topup',
        amount: coins,
        description,
        balance,
        createdAt: new Date().toISOString(),
        packageId,
      }
      const next: StubWallet = {
        ...wallet,
        balance,
        transactions: [txn, ...wallet.transactions],
      }
      walletsByUserId.set(userId, next)
      return toPublicWallet(next)
    },
    async unlockEpisode(userId, webtoonId, episodeNumber) {
      const catalog = await stub.getUnstrippedPublishedCatalog()
      const episode = catalog.episodes.find(
        (row) => row.webtoonId === webtoonId && row.episodeNumber === episodeNumber
      )
      if (!episode) return { ok: false, reason: 'EPISODE_NOT_FOUND' }

      const key = episodeUnlockKey(webtoonId, episodeNumber)
      const wallet = await stub.ensureWallet(userId)
      if (wallet.unlockedEpisodeKeys.includes(key)) {
        return { ok: false, reason: 'ALREADY_UNLOCKED' }
      }
      if (!isEpisodeLocked(episode, false)) {
        return { ok: false, reason: 'NOT_LOCKED' }
      }
      if (wallet.balance < episode.coinPrice) {
        return { ok: false, reason: 'INSUFFICIENT_COINS' }
      }

      const balance = wallet.balance - episode.coinPrice
      const txn: StubWalletTransaction = {
        id: `unlock-${randomUUID()}`,
        type: 'spend',
        amount: -episode.coinPrice,
        description: `Unlock episode ${episodeNumber}`,
        balance,
        createdAt: new Date().toISOString(),
        episodeKey: key,
      }
      const next: StubWallet = {
        ...wallet,
        balance,
        transactions: [txn, ...wallet.transactions],
        unlockedEpisodeKeys: [key, ...wallet.unlockedEpisodeKeys],
      }
      walletsByUserId.set(userId, next)
      return { ok: true, wallet: toPublicWallet(next) }
    },
    async getLibrary(userId) {
      return snapshotOf(userId)
    },
    async toggleLibrarySubscribe(userId, webtoonId, lastNotifiedEpisodeNumber) {
      const { bookmarks } = libraryFor(userId)
      if (bookmarks.has(webtoonId)) {
        bookmarks.delete(webtoonId)
        return snapshotOf(userId)
      }
      const bookmark: LibraryBookmark = {
        webtoonId,
        addedAt: new Date().toISOString(),
      }
      if (typeof lastNotifiedEpisodeNumber === 'number') {
        bookmark.lastNotifiedEpisodeNumber = lastNotifiedEpisodeNumber
      }
      bookmarks.set(webtoonId, bookmark)
      return snapshotOf(userId)
    },
    async setLibraryMute(userId, webtoonId, muted) {
      const { bookmarks } = libraryFor(userId)
      const current = bookmarks.get(webtoonId)
      if (!current) return snapshotOf(userId)
      bookmarks.set(webtoonId, { ...current, notifyMuted: muted })
      return snapshotOf(userId)
    },
    async stampLibraryNotified(userId, webtoonId, episodeNumber) {
      const { bookmarks } = libraryFor(userId)
      const current = bookmarks.get(webtoonId)
      if (!current) return snapshotOf(userId)
      bookmarks.set(webtoonId, { ...current, lastNotifiedEpisodeNumber: episodeNumber })
      return snapshotOf(userId)
    },
    async listLibrarySubscribers(webtoonId) {
      const out: PersistLibrarySubscriber[] = []
      for (const [userId, bookmarks] of libraryBookmarksByUserId) {
        const row = bookmarks.get(webtoonId)
        if (!row) continue
        const subscriber: PersistLibrarySubscriber = {
          userId,
          notifyMuted: row.notifyMuted === true,
        }
        if (typeof row.lastNotifiedEpisodeNumber === 'number') {
          subscriber.lastNotifiedEpisodeNumber = row.lastNotifiedEpisodeNumber
        }
        out.push(subscriber)
      }
      return out
    },
    async upsertLibraryHistory(userId, webtoonId, episodeNumber, scrollRatio) {
      const { history } = libraryFor(userId)
      history.set(
        webtoonId,
        nextLibraryHistoryRecord(history.get(webtoonId), webtoonId, episodeNumber, scrollRatio)
      )
      return snapshotOf(userId)
    },
    async toggleLibraryLike(userId, webtoonId) {
      const state = libraryFor(userId)
      const exists = state.likes.includes(webtoonId)
      state.likes = exists
        ? state.likes.filter((id) => id !== webtoonId)
        : [webtoonId, ...state.likes.filter((id) => id !== webtoonId)]
      libraryLikesByUserId.set(userId, state.likes)
      return snapshotOf(userId)
    },
    async removeLibraryBookmarks(userId, webtoonIds) {
      const { bookmarks } = libraryFor(userId)
      for (const id of webtoonIds) bookmarks.delete(id)
      return snapshotOf(userId)
    },
    async removeLibraryHistory(userId, webtoonIds) {
      const { history } = libraryFor(userId)
      for (const id of webtoonIds) history.delete(id)
      return snapshotOf(userId)
    },
    async removeLibraryLikes(userId, webtoonIds) {
      const drop = new Set(webtoonIds)
      const state = libraryFor(userId)
      state.likes = state.likes.filter((id) => !drop.has(id))
      libraryLikesByUserId.set(userId, state.likes)
      return snapshotOf(userId)
    },
    async getNotifications(userId) {
      return notificationsOf(userId)
    },
    async upsertNotification(userId, notification) {
      notificationMapOf(userId).set(notification.id, clonePersistNotification(notification))
      return notificationsOf(userId)
    },
    async markNotificationRead(userId, id) {
      const map = notificationsByUserId.get(userId)
      const current = map?.get(id)
      if (current && map) map.set(id, { ...current, isRead: true })
      return notificationsOf(userId)
    },
    async markAllNotificationsRead(userId) {
      const map = notificationsByUserId.get(userId)
      if (map) {
        for (const [id, row] of map) {
          map.set(id, { ...row, isRead: true })
        }
      }
      return notificationsOf(userId)
    },
    async deleteNotification(userId, id) {
      notificationsByUserId.get(userId)?.delete(id)
      return notificationsOf(userId)
    },
    async clearReadNotifications(userId) {
      const map = notificationsByUserId.get(userId)
      if (map) {
        for (const [id, row] of map) {
          if (row.isRead) map.delete(id)
        }
      }
      return notificationsOf(userId)
    },
    async hasNotification(userId, id) {
      return notificationsByUserId.get(userId)?.has(id) === true
    },
    async listReaders(input) {
      const q = (input.q ?? '').trim().toLowerCase()
      const all = [...usersById.values()]
        .filter((user) => {
          if (!q) return true
          return (
            user.email.toLowerCase().includes(q) ||
            user.displayName.toLowerCase().includes(q) ||
            user.username.toLowerCase().includes(q)
          )
        })
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
      const readers = all.slice(input.offset, input.offset + input.limit).map((user) => ({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      }))
      return { total: all.length, readers }
    },
    async listReaderIds() {
      return [...usersById.keys()]
    },
    async listPushSubscriptions(userId) {
      return [...(pushByUserId.get(userId)?.values() ?? [])].map((row) => ({ ...row }))
    },
    async upsertPushSubscription(userId, subscription) {
      let map = pushByUserId.get(userId)
      if (!map) {
        map = new Map()
        pushByUserId.set(userId, map)
      }
      map.set(subscription.endpoint, { ...subscription })
    },
    async deletePushSubscription(userId, endpoint) {
      pushByUserId.get(userId)?.delete(endpoint)
    },
    async countUsersWithPush() {
      let count = 0
      for (const map of pushByUserId.values()) {
        if (map.size > 0) count += 1
      }
      return count
    },
    async getCampaign(id) {
      const row = campaignsById.get(id)
      return row ? { ...row } : undefined
    },
    async upsertCampaign(campaign) {
      campaignsById.set(campaign.id, { ...campaign })
    },
    async getPrefs(userId) {
      const existing = prefsByUserId.get(userId)
      return existing ? clonePrefsSnapshot(existing) : defaultPrefsSnapshot()
    },
    async patchNotifPrefs(userId, patch) {
      const current = prefsByUserId.get(userId) ?? defaultPrefsSnapshot()
      const next: PrefsSnapshot = {
        notifPrefs: { ...current.notifPrefs, ...patch },
        readerPrefs: { ...current.readerPrefs },
      }
      prefsByUserId.set(userId, next)
      return clonePrefsSnapshot(next)
    },
    async setReaderPrefs(userId, reader) {
      const current = prefsByUserId.get(userId) ?? defaultPrefsSnapshot()
      const next: PrefsSnapshot = {
        notifPrefs: { ...current.notifPrefs },
        readerPrefs: {
          darkMode: reader.darkMode,
          brightness: normalizeBrightness(reader.brightness),
          fontSize: reader.fontSize,
          imageFit: reader.imageFit,
        },
      }
      prefsByUserId.set(userId, next)
      return clonePrefsSnapshot(next)
    },
    async listComments(episodeKey) {
      return commentsOf(episodeKey)
    },
    async addComment(episodeKey, userId, content, spoiler) {
      const user = usersById.get(userId)
      const trimmed = content.trim()
      if (!user || !trimmed || trimmed.length > COMMENT_MAX_LENGTH) return commentsOf(episodeKey)
      const comment: PersistComment = {
        id: `c-${Date.now()}-${randomUUID().slice(0, 8)}`,
        episodeKey,
        userId,
        user: commentUserOf(user),
        content: trimmed,
        likeCount: 0,
        likedByUserIds: [],
        createdAt: new Date().toISOString(),
        ...(spoiler ? { spoiler: true } : {}),
      }
      writeComments(episodeKey, [comment, ...(commentsByKey.get(episodeKey) ?? [])])
      return commentsOf(episodeKey)
    },
    async addReply(episodeKey, parentId, userId, content, spoiler) {
      const user = usersById.get(userId)
      const trimmed = content.trim()
      if (!user || !trimmed || trimmed.length > COMMENT_MAX_LENGTH) return commentsOf(episodeKey)
      const existing = commentsByKey.get(episodeKey) ?? []
      const parent = existing.find((c) => c.id === parentId)
      if (!parent) return commentsOf(episodeKey)
      const reply: PersistComment = {
        id: `c-${Date.now()}-${randomUUID().slice(0, 8)}`,
        episodeKey,
        userId,
        user: commentUserOf(user),
        content: trimmed,
        likeCount: 0,
        likedByUserIds: [],
        createdAt: new Date().toISOString(),
        parentId: parent.parentId ?? parent.id,
        ...(spoiler ? { spoiler: true } : {}),
      }
      writeComments(episodeKey, [reply, ...existing])
      maybeNotifyCommentReply(parent, userId, episodeKey)
      return commentsOf(episodeKey)
    },
    async updateComment(episodeKey, commentId, userId, content) {
      const trimmed = content.trim()
      if (!trimmed || trimmed.length > COMMENT_MAX_LENGTH) return commentsOf(episodeKey)
      const existing = commentsByKey.get(episodeKey) ?? []
      writeComments(
        episodeKey,
        existing.map((c) =>
          c.id === commentId && c.userId === userId ? { ...c, content: trimmed, isEdited: true } : c
        )
      )
      return commentsOf(episodeKey)
    },
    async deleteComment(episodeKey, commentId, userId) {
      const existing = commentsByKey.get(episodeKey) ?? []
      const target = existing.find((c) => c.id === commentId && c.userId === userId)
      if (!target) return commentsOf(episodeKey)
      writeComments(
        episodeKey,
        existing.filter((c) => c.id !== target.id && c.parentId !== target.id)
      )
      return commentsOf(episodeKey)
    },
    async toggleCommentLike(episodeKey, commentId, userId) {
      const existing = commentsByKey.get(episodeKey) ?? []
      writeComments(
        episodeKey,
        existing.map((c) => {
          if (c.id !== commentId) return c
          const liked = c.likedByUserIds.includes(userId)
            ? c.likedByUserIds.filter((id) => id !== userId)
            : [...c.likedByUserIds, userId]
          return { ...c, likedByUserIds: liked, likeCount: liked.length }
        })
      )
      return commentsOf(episodeKey)
    },
    async reportComment(episodeKey, commentId, userId) {
      if (!usersById.has(userId)) return commentsOf(episodeKey)
      const existing = commentsByKey.get(episodeKey) ?? []
      writeComments(
        episodeKey,
        existing.map((c) => (c.id === commentId ? { ...c, reported: true } : c))
      )
      return commentsOf(episodeKey)
    },
  }

  return stub
}

export let persist: PersistPort = createStubPersist()

export function resetPersistToStub() {
  persist = createStubPersist()
}

export async function openPersist(env: Env): Promise<PersistPort> {
  if (!isDatabaseConfigured(env)) {
    persist = createStubPersist()
    return persist
  }

  const { createPrismaPersist } = await import('./persist-prisma.js')
  const adapter = createPrismaPersist(env.DATABASE_URL!)
  try {
    await adapter.ping()
  } catch (error) {
    await adapter.close()
    throw error
  }
  persist = adapter
  return persist
}
