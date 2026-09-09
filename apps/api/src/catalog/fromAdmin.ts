import { Prisma } from '@prisma/client'
import { publishedCatalogFrom, type PublishedCatalog } from '@softgate/shared/catalog'

type Author = PublishedCatalog['authors'][number]
type Genre = PublishedCatalog['genres'][number]
type Webtoon = PublishedCatalog['webtoons'][number]
type Episode = PublishedCatalog['episodes'][number]
type CatalogCoinPackage = NonNullable<PublishedCatalog['coinPackages']>[number]
type ContentRating = Webtoon['contentRating']

const CONTENT_RATINGS: readonly ContentRating[] = ['all', '13', '16', '18']
const ALL_GENRE_SLUG = 'all'

export type AdminAuthorRow = {
  id: string
  name: unknown
  bio?: unknown | null
  avatar?: string | null
  followerCount: number
  status: 'active' | 'inactive'
}

export type AdminGenreRow = {
  id: string
  name: unknown
  slug: string
}

export type AdminWebtoonRow = {
  id: string
  title: unknown
  description: unknown
  coverImage?: string | null
  coverColor: string
  authorId: string
  tags: string[]
  status: 'ongoing' | 'completed' | 'hiatus' | 'draft'
  isPremium: boolean
  viewCount: number
  likeCount: number
  rating: number
  contentRating: string
  spotlight: boolean
  spotlightOrder?: number | null
  weeklyViewCount: number
  createdAt: Date | string
  updatedAt: Date | string
  genreIds?: string[]
  genreSlugs?: string[]
}

export type AdminEpisodeRow = {
  id: string
  webtoonId: string
  title: unknown
  description?: unknown | null
  images: string[]
  imageSizes?: unknown | null
  isPremium: boolean
  coinPrice: number
  viewCount: number
  likeCount: number
  episodeNumber: number
  status: 'published' | 'draft' | 'scheduled'
  freeAt?: Date | string | null
  scheduledAt?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export type AdminCoinPackageRow = {
  id: string
  coins: number
  price: number
  bonus?: number | null
  popular?: boolean | null
  bestValue?: boolean | null
}

export function asBilingual(value: unknown): { en: string; mm: string } {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const row = value as { en?: unknown; mm?: unknown }
    return {
      en: typeof row.en === 'string' ? row.en : '',
      mm: typeof row.mm === 'string' ? row.mm : '',
    }
  }
  return { en: '', mm: '' }
}

export function asImageSizes(
  value: unknown
): Array<{ width: number; height: number } | null> | undefined {
  if (!Array.isArray(value)) return undefined
  return value.map((item) => {
    if (item === null) return null
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const row = item as { width?: unknown; height?: unknown }
      if (typeof row.width === 'number' && typeof row.height === 'number') {
        return { width: row.width, height: row.height }
      }
    }
    return null
  })
}

const isContentRating = (value: string): value is ContentRating =>
  (CONTENT_RATINGS as readonly string[]).includes(value)

const toIso = (value: Date | string): string =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString()

const optionalIso = (value: Date | string | null | undefined): string | undefined => {
  if (value == null) return undefined
  return toIso(value)
}

const isAllGenre = (slug: string): boolean => slug.trim().toLowerCase() === ALL_GENRE_SLUG

const derivedWebtoonCountForAuthor = (webtoons: Webtoon[], authorId: string): number =>
  webtoons.filter((webtoon) => webtoon.author.id === authorId && webtoon.status !== 'draft').length

const derivedWebtoonCountForGenre = (webtoons: Webtoon[], genre: Genre): number => {
  if (isAllGenre(genre.slug)) {
    return webtoons.filter((webtoon) => webtoon.status !== 'draft').length
  }
  return webtoons.filter(
    (webtoon) => webtoon.status !== 'draft' && webtoon.genres.includes(genre.slug)
  ).length
}

const toAuthor = (row: AdminAuthorRow, webtoonCount: number): Author => {
  const author: Author = {
    id: row.id,
    name: asBilingual(row.name),
    followerCount: row.followerCount,
    webtoonCount,
    status: row.status,
  }
  if (row.avatar) author.avatar = row.avatar
  if (row.bio != null) author.bio = asBilingual(row.bio)
  return author
}

const slugsFor = (row: AdminWebtoonRow, genresById: Map<string, AdminGenreRow>): string[] => {
  if (row.genreSlugs) return row.genreSlugs.filter(Boolean)
  return (row.genreIds ?? [])
    .map((id) => genresById.get(id)?.slug)
    .filter((slug): slug is string => Boolean(slug))
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isPositiveInt = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1

const isNonNegativeInt = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0

export function coinPackagesFromAdminRows(rows: AdminCoinPackageRow[]): CatalogCoinPackage[] {
  const packs: CatalogCoinPackage[] = []
  for (const row of rows) {
    if (!isNonEmptyString(row.id) || !isPositiveInt(row.coins) || !isPositiveInt(row.price)) {
      continue
    }
    if (row.bonus != null && !isNonNegativeInt(row.bonus)) continue
    const pack: CatalogCoinPackage = { id: row.id, coins: row.coins, price: row.price }
    if (row.bonus && row.bonus > 0) pack.bonus = row.bonus
    if (row.popular) pack.popular = true
    if (row.bestValue) pack.bestValue = true
    packs.push(pack)
  }
  return packs
}

export function isMissingCoinPackageTable(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021'
}

export function publishedCatalogFromAdmin(input: {
  authors: AdminAuthorRow[]
  genres: AdminGenreRow[]
  webtoons: AdminWebtoonRow[]
  episodes: AdminEpisodeRow[]
  coinPackages?: CatalogCoinPackage[]
}): PublishedCatalog {
  const authorsById = new Map(input.authors.map((row) => [row.id, row]))
  const genresById = new Map(input.genres.map((row) => [row.id, row]))
  const ratedRows = input.webtoons.filter(
    (row) => isContentRating(row.contentRating) && authorsById.has(row.authorId)
  )

  const webtoons: Webtoon[] = ratedRows.map((row) => {
    const authorRow = authorsById.get(row.authorId)!
    const webtoon: Webtoon = {
      id: row.id,
      title: asBilingual(row.title),
      description: asBilingual(row.description),
      coverColor: row.coverColor,
      author: toAuthor(authorRow, 0),
      genres: slugsFor(row, genresById),
      tags: row.tags,
      status: row.status,
      isPremium: row.isPremium,
      viewCount: row.viewCount,
      likeCount: row.likeCount,
      episodeCount: 0,
      rating: row.rating,
      contentRating: row.contentRating,
      createdAt: toIso(row.createdAt),
      updatedAt: toIso(row.updatedAt),
      spotlight: row.spotlight,
      weeklyViewCount: row.weeklyViewCount,
    }
    if (row.coverImage) webtoon.coverImage = row.coverImage
    if (row.spotlightOrder != null) webtoon.spotlightOrder = row.spotlightOrder
    return webtoon
  })

  const titlesByWebtoonId = new Map(webtoons.map((webtoon) => [webtoon.id, webtoon.title]))

  const episodes: Episode[] = input.episodes.map((row) => {
    const episode: Episode = {
      id: row.id,
      webtoonId: row.webtoonId,
      webtoonTitle: titlesByWebtoonId.get(row.webtoonId) ?? { en: '', mm: '' },
      title: asBilingual(row.title),
      images: row.images,
      isPremium: row.isPremium,
      coinPrice: row.coinPrice,
      viewCount: row.viewCount,
      likeCount: row.likeCount,
      episodeNumber: row.episodeNumber,
      status: row.status,
      createdAt: toIso(row.createdAt),
      updatedAt: toIso(row.updatedAt),
    }
    if (row.description != null) episode.description = asBilingual(row.description)
    const imageSizes = asImageSizes(row.imageSizes ?? null)
    if (imageSizes) episode.imageSizes = imageSizes
    const freeAt = optionalIso(row.freeAt)
    if (freeAt) episode.freeAt = freeAt
    const scheduledAt = optionalIso(row.scheduledAt)
    if (scheduledAt) episode.scheduledAt = scheduledAt
    return episode
  })

  for (const webtoon of webtoons) {
    const authorRow = authorsById.get(webtoon.author.id)
    if (!authorRow) continue
    webtoon.episodeCount = episodes.filter(
      (episode) => episode.webtoonId === webtoon.id && episode.status !== 'draft'
    ).length
    webtoon.author = toAuthor(authorRow, derivedWebtoonCountForAuthor(webtoons, webtoon.author.id))
  }

  const authors: Author[] = input.authors.map((row) =>
    toAuthor(row, derivedWebtoonCountForAuthor(webtoons, row.id))
  )

  const genres: Genre[] = input.genres.map((row) => {
    const genre: Genre = {
      id: row.id,
      name: asBilingual(row.name),
      slug: row.slug,
    }
    genre.webtoonCount = derivedWebtoonCountForGenre(webtoons, genre)
    return genre
  })

  return publishedCatalogFrom({
    authors,
    genres,
    webtoons,
    episodes,
    coinPackages: input.coinPackages,
  })
}
