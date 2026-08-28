import type { TFunction } from 'i18next'
import type { LucideIcon } from 'lucide-react'
import { Clock, ListOrdered, Sparkles, Star } from 'lucide-react'
import type { CatalogSort } from '../../lib/catalog'

export type BrowseMasthead = {
  title: string | null
  deck: string
  icon: LucideIcon | null
}

export const getBrowseMasthead = ({
  sort,
  genreSlug,
  genreName,
  t,
}: {
  sort: CatalogSort
  genreSlug: string
  genreName?: string
  t: TFunction
}): BrowseMasthead => {
  if (sort === 'popular') {
    return { title: t('home.ranking'), deck: t('home.rankingDesc'), icon: ListOrdered }
  }
  if (sort === 'new') {
    return { title: t('home.newReleases'), deck: t('home.newReleasesDesc'), icon: Sparkles }
  }
  if (sort === 'recentlyUpdated') {
    return { title: t('categories.recentlyUpdated'), deck: t('home.updatedDesc'), icon: Clock }
  }
  if (sort === 'highestRated') {
    return {
      title: t('categories.highestRated'),
      deck: t('categories.highestRatedDesc'),
      icon: Star,
    }
  }
  if (genreSlug !== 'all') {
    return { title: genreName ?? null, deck: t('categories.browseDesc'), icon: null }
  }
  return { title: t('categories.browseByGenre'), deck: t('categories.browseDesc'), icon: null }
}
