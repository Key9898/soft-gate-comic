import { randomUUID } from 'node:crypto'
import {
  Prisma,
  PrismaClient,
  type ReaderNotification,
  type ReaderUser,
  type WalletTransaction,
} from '@prisma/client'
import { isEpisodeLocked } from '@softgate/shared/catalog'
import { STUB_PORTAL_SETTINGS } from '@softgate/shared/settings'
import { publishedCatalogFromAdmin } from './catalog/fromAdmin.js'
import { episodeUnlockKey, redactLockedEpisodeImages } from './paywall.js'
import {
  STUB_SEED_BALANCE,
  nextLibraryHistoryRecord,
  sortLibrarySnapshot,
  toLibraryBookmark,
  toPersistNotification,
  toPublicUser,
  defaultPrefsSnapshot,
  normalizeBrightness,
  clonePersistComment,
  sortComments,
  type AuthFlags,
  type LibrarySnapshot,
  type PersistComment,
  type PersistCommentUser,
  type PersistNotification,
  type PersistPort,
  type PersistReaderPrefs,
  type PrefsSnapshot,
  type StubReaderUser,
  type StubUnlockResult,
  type StubWallet,
  type StubWalletPublic,
  type StubWalletTransaction,
} from './persist.js'
import {
  COMMENT_MAX_LENGTH,
  COMMENT_REPLY_BODY_EN,
  COMMENT_REPLY_TITLE_KEY,
  episodeNumberFromCommentKey,
  hrefFromCommentKey,
  webtoonIdFromCommentKey,
} from './comments/keys.js'

type Tx = Prisma.TransactionClient

function toReaderUser(row: ReaderUser): StubReaderUser {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    displayName: row.displayName,
    avatar: row.avatar ?? undefined,
    bio: row.bio,
    passwordHash: row.passwordHash,
    createdAt: row.createdAt.toISOString(),
    lastLoginAt: row.lastLoginAt?.toISOString(),
  }
}

function toWalletTxn(row: WalletTransaction): StubWalletTransaction {
  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    description: row.description,
    balance: row.balance,
    createdAt: row.createdAt.toISOString(),
    packageId: row.packageId ?? undefined,
    episodeKey: row.episodeKey ?? undefined,
  }
}

function toPublicWallet(wallet: StubWallet): StubWalletPublic {
  return {
    balance: wallet.balance,
    transactions: [...wallet.transactions],
    unlockedEpisodeKeys: [...wallet.unlockedEpisodeKeys],
  }
}

async function loadWallet(tx: Tx, userId: string): Promise<StubWallet | undefined> {
  const wallet = await tx.wallet.findUnique({ where: { userId } })
  if (!wallet) return undefined
  const [transactions, unlocks] = await Promise.all([
    tx.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
    tx.walletUnlock.findMany({ where: { userId } }),
  ])
  return {
    balance: wallet.balance,
    seeded: wallet.seeded,
    transactions: transactions.map(toWalletTxn),
    unlockedEpisodeKeys: unlocks.map((row) => row.episodeKey),
  }
}

async function ensureWalletTx(tx: Tx, userId: string): Promise<StubWallet> {
  const existing = await loadWallet(tx, userId)
  if (existing?.seeded) return existing

  const createdAt = new Date()
  const seedId = `seed-${userId}`
  if (existing) {
    await tx.wallet.update({
      where: { userId },
      data: { balance: STUB_SEED_BALANCE, seeded: true },
    })
  } else {
    await tx.wallet.create({
      data: { userId, balance: STUB_SEED_BALANCE, seeded: true },
    })
  }
  await tx.walletTransaction.create({
    data: {
      id: seedId,
      userId,
      type: 'bonus',
      amount: STUB_SEED_BALANCE,
      description: 'Welcome demo balance',
      balance: STUB_SEED_BALANCE,
      createdAt,
    },
  })

  return {
    balance: STUB_SEED_BALANCE,
    seeded: true,
    transactions: [
      {
        id: seedId,
        type: 'bonus',
        amount: STUB_SEED_BALANCE,
        description: 'Welcome demo balance',
        balance: STUB_SEED_BALANCE,
        createdAt: createdAt.toISOString(),
      },
      ...(existing?.transactions ?? []),
    ],
    unlockedEpisodeKeys: existing?.unlockedEpisodeKeys ?? [],
  }
}

async function loadLibrarySnapshot(
  db: PrismaClient | Tx,
  userId: string
): Promise<LibrarySnapshot> {
  const [subscribes, historyRows, likes] = await Promise.all([
    db.librarySubscribe.findMany({ where: { userId } }),
    db.libraryHistory.findMany({ where: { userId } }),
    db.libraryLike.findMany({ where: { userId }, orderBy: { likedAt: 'desc' } }),
  ])
  return sortLibrarySnapshot({
    bookmarks: subscribes.map((row) =>
      toLibraryBookmark({
        webtoonId: row.webtoonId,
        addedAt: row.addedAt.toISOString(),
        notifyMuted: row.notifyMuted,
        lastNotifiedEpisodeNumber: row.lastNotifiedEpisodeNumber,
      })
    ),
    history: historyRows.map((row) => ({
      webtoonId: row.webtoonId,
      episodeNumber: row.episodeNumber,
      lastReadAt: row.lastReadAt.toISOString(),
      ...(row.scrollRatio == null ? {} : { scrollRatio: row.scrollRatio }),
      readEpisodeNumbers: [...row.readEpisodeNumbers],
    })),
    likedWebtoonIds: likes.map((row) => row.webtoonId),
  })
}

function fromNotificationRow(row: ReaderNotification): PersistNotification {
  return toPersistNotification({
    id: row.id,
    type: row.type,
    titleKey: row.titleKey,
    message: row.message,
    isRead: row.isRead,
    createdAt: row.createdAt.toISOString(),
    href: row.href,
    webtoonId: row.webtoonId,
    episodeNumber: row.episodeNumber,
  })
}

async function loadNotifications(
  db: PrismaClient | Tx,
  userId: string
): Promise<PersistNotification[]> {
  const rows = await db.readerNotification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(fromNotificationRow)
}

function notificationWriteData(notification: PersistNotification) {
  return {
    type: notification.type,
    titleKey: notification.titleKey,
    message: notification.message,
    isRead: notification.isRead,
    createdAt: new Date(notification.createdAt),
    href: notification.href ?? null,
    webtoonId: notification.data?.webtoonId ?? null,
    episodeNumber: notification.data?.episodeNumber ?? null,
  }
}

function fromPrefsRow(row: {
  newEpisode: boolean
  commentReply: boolean
  promotion: boolean
  darkMode: boolean
  brightness: number
  fontSize: PersistReaderPrefs['fontSize']
  imageFit: PersistReaderPrefs['imageFit']
}): PrefsSnapshot {
  return {
    notifPrefs: {
      newEpisode: row.newEpisode,
      commentReply: row.commentReply,
      promotion: row.promotion,
    },
    readerPrefs: {
      darkMode: row.darkMode,
      brightness: normalizeBrightness(row.brightness),
      fontSize: row.fontSize,
      imageFit: row.imageFit,
    },
  }
}

type CommentWithJoins = {
  id: string
  episodeKey: string
  userId: string
  content: string
  parentId: string | null
  spoiler: boolean
  reported: boolean
  isEdited: boolean
  createdAt: Date
  user: { id: string; username: string; displayName: string; avatar: string | null }
  likes: { userId: string }[]
}

function commentUserFromRow(user: CommentWithJoins['user']): PersistCommentUser {
  const next: PersistCommentUser = {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
  }
  if (user.avatar) next.avatar = user.avatar
  return next
}

function fromCommentRow(row: CommentWithJoins): PersistComment {
  const likedByUserIds = row.likes.map((like) => like.userId)
  return clonePersistComment({
    id: row.id,
    episodeKey: row.episodeKey,
    userId: row.userId,
    user: commentUserFromRow(row.user),
    content: row.content,
    likeCount: likedByUserIds.length,
    likedByUserIds,
    createdAt: row.createdAt.toISOString(),
    isEdited: row.isEdited || undefined,
    parentId: row.parentId ?? undefined,
    spoiler: row.spoiler || undefined,
    reported: row.reported || undefined,
  })
}

async function loadComments(db: PrismaClient | Tx, episodeKey: string): Promise<PersistComment[]> {
  const rows = await db.readerComment.findMany({
    where: { episodeKey },
    include: { user: true, likes: true },
  })
  return sortComments(rows.map(fromCommentRow))
}

async function maybeNotifyCommentReply(
  db: PrismaClient | Tx,
  parent: { userId: string },
  actorId: string,
  episodeKey: string
) {
  if (parent.userId === actorId) return
  const prefs = await db.readerUserPrefs.findUnique({ where: { userId: parent.userId } })
  const commentReply = prefs?.commentReply ?? true
  if (!commentReply) return
  const episodeNumber = episodeNumberFromCommentKey(episodeKey)
  const id = `c-reply-${randomUUID()}`
  await db.readerNotification.upsert({
    where: { userId_id: { userId: parent.userId, id } },
    create: {
      userId: parent.userId,
      id,
      type: 'comment_reply',
      titleKey: COMMENT_REPLY_TITLE_KEY,
      message: COMMENT_REPLY_BODY_EN,
      isRead: false,
      createdAt: new Date(),
      href: hrefFromCommentKey(episodeKey),
      webtoonId: webtoonIdFromCommentKey(episodeKey),
      episodeNumber: episodeNumber ?? null,
    },
    update: {},
  })
}

export type PrismaPersistPort = PersistPort & { close(): Promise<void> }

export function createPrismaPersist(databaseUrl: string): PrismaPersistPort {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
  })
  let authFlags: AuthFlags = {}

  const adapter: PrismaPersistPort = {
    kind: 'prisma',
    async ping() {
      await prisma.$connect()
      return { ok: true as const }
    },
    async close() {
      await prisma.$disconnect()
    },
    async getUnstrippedPublishedCatalog() {
      const [authors, genres, webtoons, episodes] = await Promise.all([
        prisma.author.findMany(),
        prisma.genre.findMany(),
        prisma.webtoon.findMany({
          include: { genres: { include: { genre: true } } },
        }),
        prisma.episode.findMany(),
      ])
      return publishedCatalogFromAdmin({
        authors,
        genres,
        webtoons: webtoons.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          coverImage: row.coverImage,
          coverColor: row.coverColor,
          authorId: row.authorId,
          tags: row.tags,
          status: row.status,
          isPremium: row.isPremium,
          viewCount: row.viewCount,
          likeCount: row.likeCount,
          rating: row.rating,
          contentRating: row.contentRating,
          spotlight: row.spotlight,
          spotlightOrder: row.spotlightOrder,
          weeklyViewCount: row.weeklyViewCount,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          genreIds: row.genres.map((item) => item.genreId),
          genreSlugs: row.genres.map((item) => item.genre.slug),
        })),
        episodes,
      })
    },
    async getPublishedCatalog(userId?: string) {
      const catalog = await adapter.getUnstrippedPublishedCatalog()
      if (!userId) return redactLockedEpisodeImages(catalog, new Set())
      const unlocks = await prisma.walletUnlock.findMany({ where: { userId } })
      return redactLockedEpisodeImages(catalog, new Set(unlocks.map((row) => row.episodeKey)))
    },
    getPortalSettings() {
      return STUB_PORTAL_SETTINGS
    },
    async clearAuth() {
      await prisma.$transaction([
        prisma.readerPasswordReset.deleteMany(),
        prisma.readerNotification.deleteMany(),
        prisma.readerUserPrefs.deleteMany(),
        prisma.libraryLike.deleteMany(),
        prisma.libraryHistory.deleteMany(),
        prisma.librarySubscribe.deleteMany(),
        prisma.walletUnlock.deleteMany(),
        prisma.walletTransaction.deleteMany(),
        prisma.refreshToken.deleteMany(),
        prisma.wallet.deleteMany(),
        prisma.readerUser.deleteMany(),
      ])
      authFlags = {}
    },
    setAuthFlags(flags: AuthFlags) {
      authFlags = { ...authFlags, ...flags }
    },
    isRegistrationOpen() {
      const settings = adapter.getPortalSettings()
      const allowRegistration = authFlags.allowRegistration ?? settings.allowRegistration
      const maintenanceMode = authFlags.maintenanceMode ?? settings.maintenanceMode
      return allowRegistration && !maintenanceMode
    },
    async findUserById(id: string) {
      const row = await prisma.readerUser.findUnique({ where: { id } })
      return row ? toReaderUser(row) : undefined
    },
    async findUserByEmail(email: string) {
      const row = await prisma.readerUser.findUnique({
        where: { email: email.trim().toLowerCase() },
      })
      return row ? toReaderUser(row) : undefined
    },
    async findUserByUsername(username: string) {
      const row = await prisma.readerUser.findFirst({
        where: { username: { equals: username.trim(), mode: 'insensitive' } },
      })
      return row ? toReaderUser(row) : undefined
    },
    async createUser(input) {
      const row = await prisma.readerUser.create({
        data: {
          id: randomUUID(),
          email: input.email.trim().toLowerCase(),
          username: input.username.trim(),
          displayName: input.displayName.trim(),
          bio: '',
          passwordHash: input.passwordHash,
          createdAt: new Date(),
        },
      })
      return toReaderUser(row)
    },
    async touchLastLogin(id: string) {
      await prisma.readerUser.update({
        where: { id },
        data: { lastLoginAt: new Date() },
      })
    },
    async saveRefreshJti(jti: string, userId: string) {
      await prisma.refreshToken.upsert({
        where: { jti },
        create: { jti, userId },
        update: { userId },
      })
    },
    async consumeRefreshJti(jti: string) {
      const row = await prisma.refreshToken.findUnique({ where: { jti } })
      if (!row) return undefined
      await prisma.refreshToken.delete({ where: { jti } })
      return row.userId
    },
    async revokeRefreshJti(jti: string) {
      await prisma.refreshToken.deleteMany({ where: { jti } })
    },
    async createPasswordResetToken(userId, tokenHash, expiresAt) {
      await prisma.$transaction([
        prisma.readerPasswordReset.deleteMany({ where: { userId } }),
        prisma.readerPasswordReset.create({
          data: { id: randomUUID(), userId, tokenHash, expiresAt },
        }),
      ])
    },
    async resetPasswordWithToken(tokenHash, passwordHash) {
      return prisma.$transaction(async (tx) => {
        const row = await tx.readerPasswordReset.findUnique({
          where: { tokenHash },
          include: { user: true },
        })
        if (!row || row.expiresAt.getTime() <= Date.now()) {
          if (row) await tx.readerPasswordReset.delete({ where: { id: row.id } })
          return { ok: false as const }
        }
        await tx.readerUser.update({
          where: { id: row.userId },
          data: { passwordHash },
        })
        await tx.readerPasswordReset.delete({ where: { id: row.id } })
        await tx.refreshToken.deleteMany({ where: { userId: row.userId } })
        return { ok: true as const, email: row.user.email }
      })
    },
    async updateReaderProfile(userId, patch) {
      const user = await prisma.readerUser.findUnique({ where: { id: userId } })
      if (!user) return { ok: false as const, reason: 'NOT_FOUND' as const }
      const nextEmail = patch.email?.trim().toLowerCase()
      if (nextEmail && nextEmail !== user.email) {
        const taken = await prisma.readerUser.findFirst({
          where: { email: nextEmail, NOT: { id: userId } },
        })
        if (taken) return { ok: false as const, reason: 'EMAIL_TAKEN' as const }
      }
      const data: Prisma.ReaderUserUpdateInput = {}
      if (patch.displayName !== undefined) data.displayName = patch.displayName
      if (nextEmail) data.email = nextEmail
      if (patch.bio !== undefined) data.bio = patch.bio
      if (patch.avatar !== undefined) data.avatar = patch.avatar
      try {
        const row = await prisma.readerUser.update({ where: { id: userId }, data })
        return { ok: true as const, user: toReaderUser(row) }
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          return { ok: false as const, reason: 'EMAIL_TAKEN' as const }
        }
        throw error
      }
    },
    async changeReaderPassword(userId, passwordHash) {
      const user = await prisma.readerUser.findUnique({ where: { id: userId } })
      if (!user) return 'not_found'
      await prisma.readerUser.update({
        where: { id: userId },
        data: { passwordHash },
      })
      return 'ok'
    },
    async deleteReaderUser(userId) {
      const user = await prisma.readerUser.findUnique({ where: { id: userId } })
      if (!user) return 'not_found'
      const own = await prisma.readerComment.findMany({ where: { userId }, select: { id: true } })
      const ownIds = own.map((row) => row.id)
      await prisma.$transaction([
        prisma.readerCommentLike.deleteMany({
          where: { OR: [{ userId }, { commentId: { in: ownIds } }] },
        }),
        prisma.readerComment.deleteMany({
          where: { OR: [{ userId }, { parentId: { in: ownIds } }] },
        }),
        prisma.readerPasswordReset.deleteMany({ where: { userId } }),
        prisma.readerNotification.deleteMany({ where: { userId } }),
        prisma.readerUserPrefs.deleteMany({ where: { userId } }),
        prisma.libraryLike.deleteMany({ where: { userId } }),
        prisma.libraryHistory.deleteMany({ where: { userId } }),
        prisma.librarySubscribe.deleteMany({ where: { userId } }),
        prisma.walletUnlock.deleteMany({ where: { userId } }),
        prisma.walletTransaction.deleteMany({ where: { userId } }),
        prisma.refreshToken.deleteMany({ where: { userId } }),
        prisma.wallet.deleteMany({ where: { userId } }),
        prisma.readerUser.deleteMany({ where: { id: userId } }),
      ])
      return 'ok'
    },
    toPublicUser,
    async ensureWallet(userId: string) {
      return prisma.$transaction((tx) => ensureWalletTx(tx, userId))
    },
    async getWallet(userId: string) {
      return toPublicWallet(await adapter.ensureWallet(userId))
    },
    async setWalletBalance(userId: string, balance: number) {
      await prisma.$transaction(async (tx) => {
        await ensureWalletTx(tx, userId)
        await tx.wallet.update({ where: { userId }, data: { balance } })
      })
    },
    async demoTopUp(userId, coins, description, packageId) {
      return prisma.$transaction(async (tx) => {
        const wallet = await ensureWalletTx(tx, userId)
        const balance = wallet.balance + coins
        const createdAt = new Date()
        const id = `topup-${randomUUID()}`
        await tx.wallet.update({ where: { userId }, data: { balance } })
        await tx.walletTransaction.create({
          data: {
            id,
            userId,
            type: 'demo_topup',
            amount: coins,
            description,
            balance,
            createdAt,
            packageId,
          },
        })
        const txn: StubWalletTransaction = {
          id,
          type: 'demo_topup',
          amount: coins,
          description,
          balance,
          createdAt: createdAt.toISOString(),
          packageId,
        }
        return toPublicWallet({
          ...wallet,
          balance,
          transactions: [txn, ...wallet.transactions],
        })
      })
    },
    async unlockEpisode(userId, webtoonId, episodeNumber): Promise<StubUnlockResult> {
      const catalog = await adapter.getUnstrippedPublishedCatalog()
      const episode = catalog.episodes.find(
        (row) => row.webtoonId === webtoonId && row.episodeNumber === episodeNumber
      )
      if (!episode) return { ok: false, reason: 'EPISODE_NOT_FOUND' }
      if (!isEpisodeLocked(episode, false)) {
        return { ok: false, reason: 'NOT_LOCKED' }
      }

      const key = episodeUnlockKey(webtoonId, episodeNumber)

      return prisma.$transaction(async (tx) => {
        const wallet = await ensureWalletTx(tx, userId)
        if (wallet.unlockedEpisodeKeys.includes(key)) {
          return { ok: false, reason: 'ALREADY_UNLOCKED' }
        }
        if (wallet.balance < episode.coinPrice) {
          return { ok: false, reason: 'INSUFFICIENT_COINS' }
        }

        const balance = wallet.balance - episode.coinPrice
        const createdAt = new Date()
        const id = `unlock-${randomUUID()}`
        await tx.wallet.update({ where: { userId }, data: { balance } })
        await tx.walletTransaction.create({
          data: {
            id,
            userId,
            type: 'spend',
            amount: -episode.coinPrice,
            description: `Unlock episode ${episodeNumber}`,
            balance,
            createdAt,
            episodeKey: key,
          },
        })
        await tx.walletUnlock.create({ data: { userId, episodeKey: key } })
        const txn: StubWalletTransaction = {
          id,
          type: 'spend',
          amount: -episode.coinPrice,
          description: `Unlock episode ${episodeNumber}`,
          balance,
          createdAt: createdAt.toISOString(),
          episodeKey: key,
        }
        return {
          ok: true as const,
          wallet: toPublicWallet({
            ...wallet,
            balance,
            transactions: [txn, ...wallet.transactions],
            unlockedEpisodeKeys: [key, ...wallet.unlockedEpisodeKeys],
          }),
        }
      })
    },
    async getLibrary(userId) {
      return loadLibrarySnapshot(prisma, userId)
    },
    async toggleLibrarySubscribe(userId, webtoonId, lastNotifiedEpisodeNumber) {
      return prisma.$transaction(async (tx) => {
        const existing = await tx.librarySubscribe.findUnique({
          where: { userId_webtoonId: { userId, webtoonId } },
        })
        if (existing) {
          await tx.librarySubscribe.delete({
            where: { userId_webtoonId: { userId, webtoonId } },
          })
        } else {
          await tx.librarySubscribe.create({
            data: {
              userId,
              webtoonId,
              addedAt: new Date(),
              lastNotifiedEpisodeNumber,
            },
          })
        }
        return loadLibrarySnapshot(tx, userId)
      })
    },
    async setLibraryMute(userId, webtoonId, muted) {
      return prisma.$transaction(async (tx) => {
        const existing = await tx.librarySubscribe.findUnique({
          where: { userId_webtoonId: { userId, webtoonId } },
        })
        if (existing) {
          await tx.librarySubscribe.update({
            where: { userId_webtoonId: { userId, webtoonId } },
            data: { notifyMuted: muted },
          })
        }
        return loadLibrarySnapshot(tx, userId)
      })
    },
    async stampLibraryNotified(userId, webtoonId, episodeNumber) {
      return prisma.$transaction(async (tx) => {
        const existing = await tx.librarySubscribe.findUnique({
          where: { userId_webtoonId: { userId, webtoonId } },
        })
        if (existing) {
          await tx.librarySubscribe.update({
            where: { userId_webtoonId: { userId, webtoonId } },
            data: { lastNotifiedEpisodeNumber: episodeNumber },
          })
        }
        return loadLibrarySnapshot(tx, userId)
      })
    },
    async upsertLibraryHistory(userId, webtoonId, episodeNumber, scrollRatio) {
      return prisma.$transaction(async (tx) => {
        const existing = await tx.libraryHistory.findUnique({
          where: { userId_webtoonId: { userId, webtoonId } },
        })
        const previous = existing
          ? {
              webtoonId: existing.webtoonId,
              episodeNumber: existing.episodeNumber,
              lastReadAt: existing.lastReadAt.toISOString(),
              ...(existing.scrollRatio == null ? {} : { scrollRatio: existing.scrollRatio }),
              readEpisodeNumbers: [...existing.readEpisodeNumbers],
            }
          : undefined
        const next = nextLibraryHistoryRecord(previous, webtoonId, episodeNumber, scrollRatio)
        await tx.libraryHistory.upsert({
          where: { userId_webtoonId: { userId, webtoonId } },
          create: {
            userId,
            webtoonId,
            episodeNumber: next.episodeNumber,
            lastReadAt: new Date(next.lastReadAt),
            scrollRatio: next.scrollRatio,
            readEpisodeNumbers: next.readEpisodeNumbers,
          },
          update: {
            episodeNumber: next.episodeNumber,
            lastReadAt: new Date(next.lastReadAt),
            scrollRatio: next.scrollRatio,
            readEpisodeNumbers: next.readEpisodeNumbers,
          },
        })
        return loadLibrarySnapshot(tx, userId)
      })
    },
    async toggleLibraryLike(userId, webtoonId) {
      return prisma.$transaction(async (tx) => {
        const existing = await tx.libraryLike.findUnique({
          where: { userId_webtoonId: { userId, webtoonId } },
        })
        if (existing) {
          await tx.libraryLike.delete({
            where: { userId_webtoonId: { userId, webtoonId } },
          })
        } else {
          await tx.libraryLike.create({
            data: { userId, webtoonId, likedAt: new Date() },
          })
        }
        return loadLibrarySnapshot(tx, userId)
      })
    },
    async removeLibraryBookmarks(userId, webtoonIds) {
      return prisma.$transaction(async (tx) => {
        await tx.librarySubscribe.deleteMany({
          where: { userId, webtoonId: { in: webtoonIds } },
        })
        return loadLibrarySnapshot(tx, userId)
      })
    },
    async removeLibraryHistory(userId, webtoonIds) {
      return prisma.$transaction(async (tx) => {
        await tx.libraryHistory.deleteMany({
          where: { userId, webtoonId: { in: webtoonIds } },
        })
        return loadLibrarySnapshot(tx, userId)
      })
    },
    async removeLibraryLikes(userId, webtoonIds) {
      return prisma.$transaction(async (tx) => {
        await tx.libraryLike.deleteMany({
          where: { userId, webtoonId: { in: webtoonIds } },
        })
        return loadLibrarySnapshot(tx, userId)
      })
    },
    async getNotifications(userId) {
      return loadNotifications(prisma, userId)
    },
    async upsertNotification(userId, notification) {
      const data = notificationWriteData(notification)
      await prisma.readerNotification.upsert({
        where: { userId_id: { userId, id: notification.id } },
        create: { userId, id: notification.id, ...data },
        update: data,
      })
      return loadNotifications(prisma, userId)
    },
    async markNotificationRead(userId, id) {
      await prisma.readerNotification.updateMany({
        where: { userId, id },
        data: { isRead: true },
      })
      return loadNotifications(prisma, userId)
    },
    async markAllNotificationsRead(userId) {
      await prisma.readerNotification.updateMany({
        where: { userId },
        data: { isRead: true },
      })
      return loadNotifications(prisma, userId)
    },
    async deleteNotification(userId, id) {
      await prisma.readerNotification.deleteMany({
        where: { userId, id },
      })
      return loadNotifications(prisma, userId)
    },
    async clearReadNotifications(userId) {
      await prisma.readerNotification.deleteMany({
        where: { userId, isRead: true },
      })
      return loadNotifications(prisma, userId)
    },
    async getPrefs(userId) {
      const row = await prisma.readerUserPrefs.findUnique({ where: { userId } })
      return row ? fromPrefsRow(row) : defaultPrefsSnapshot()
    },
    async patchNotifPrefs(userId, patch) {
      const current = await adapter.getPrefs(userId)
      const next = {
        notifPrefs: { ...current.notifPrefs, ...patch },
        readerPrefs: current.readerPrefs,
      }
      const row = await prisma.readerUserPrefs.upsert({
        where: { userId },
        create: {
          userId,
          ...next.notifPrefs,
          darkMode: next.readerPrefs.darkMode,
          brightness: next.readerPrefs.brightness,
          fontSize: next.readerPrefs.fontSize,
          imageFit: next.readerPrefs.imageFit,
        },
        update: next.notifPrefs,
      })
      return fromPrefsRow(row)
    },
    async setReaderPrefs(userId, reader) {
      const current = await adapter.getPrefs(userId)
      const readerPrefs: PersistReaderPrefs = {
        darkMode: reader.darkMode,
        brightness: normalizeBrightness(reader.brightness),
        fontSize: reader.fontSize,
        imageFit: reader.imageFit,
      }
      const row = await prisma.readerUserPrefs.upsert({
        where: { userId },
        create: {
          userId,
          ...current.notifPrefs,
          ...readerPrefs,
        },
        update: readerPrefs,
      })
      return fromPrefsRow(row)
    },
    async listComments(episodeKey) {
      return loadComments(prisma, episodeKey)
    },
    async addComment(episodeKey, userId, content, spoiler) {
      const user = await prisma.readerUser.findUnique({ where: { id: userId } })
      const trimmed = content.trim()
      if (!user || !trimmed || trimmed.length > COMMENT_MAX_LENGTH) {
        return loadComments(prisma, episodeKey)
      }
      await prisma.readerComment.create({
        data: {
          id: `c-${Date.now()}-${randomUUID().slice(0, 8)}`,
          episodeKey,
          userId,
          content: trimmed,
          spoiler,
          createdAt: new Date(),
        },
      })
      return loadComments(prisma, episodeKey)
    },
    async addReply(episodeKey, parentId, userId, content, spoiler) {
      const user = await prisma.readerUser.findUnique({ where: { id: userId } })
      const trimmed = content.trim()
      if (!user || !trimmed || trimmed.length > COMMENT_MAX_LENGTH) {
        return loadComments(prisma, episodeKey)
      }
      const parent = await prisma.readerComment.findFirst({
        where: { id: parentId, episodeKey },
      })
      if (!parent) return loadComments(prisma, episodeKey)
      await prisma.$transaction(async (tx) => {
        await tx.readerComment.create({
          data: {
            id: `c-${Date.now()}-${randomUUID().slice(0, 8)}`,
            episodeKey,
            userId,
            content: trimmed,
            parentId: parent.parentId ?? parent.id,
            spoiler,
            createdAt: new Date(),
          },
        })
        await maybeNotifyCommentReply(tx, parent, userId, episodeKey)
      })
      return loadComments(prisma, episodeKey)
    },
    async updateComment(episodeKey, commentId, userId, content) {
      const trimmed = content.trim()
      if (!trimmed || trimmed.length > COMMENT_MAX_LENGTH) {
        return loadComments(prisma, episodeKey)
      }
      await prisma.readerComment.updateMany({
        where: { id: commentId, episodeKey, userId },
        data: { content: trimmed, isEdited: true },
      })
      return loadComments(prisma, episodeKey)
    },
    async deleteComment(episodeKey, commentId, userId) {
      const target = await prisma.readerComment.findFirst({
        where: { id: commentId, episodeKey, userId },
      })
      if (!target) return loadComments(prisma, episodeKey)
      await prisma.readerComment.deleteMany({
        where: {
          episodeKey,
          OR: [{ id: target.id }, { parentId: target.id }],
        },
      })
      return loadComments(prisma, episodeKey)
    },
    async toggleCommentLike(episodeKey, commentId, userId) {
      const comment = await prisma.readerComment.findFirst({
        where: { id: commentId, episodeKey },
      })
      if (!comment) return loadComments(prisma, episodeKey)
      const existing = await prisma.readerCommentLike.findUnique({
        where: { commentId_userId: { commentId, userId } },
      })
      if (existing) {
        await prisma.readerCommentLike.delete({
          where: { commentId_userId: { commentId, userId } },
        })
      } else {
        await prisma.readerCommentLike.create({ data: { commentId, userId } })
      }
      return loadComments(prisma, episodeKey)
    },
    async reportComment(episodeKey, commentId, userId) {
      const user = await prisma.readerUser.findUnique({ where: { id: userId } })
      if (!user) return loadComments(prisma, episodeKey)
      await prisma.readerComment.updateMany({
        where: { id: commentId, episodeKey },
        data: { reported: true },
      })
      return loadComments(prisma, episodeKey)
    },
  }

  return adapter
}
