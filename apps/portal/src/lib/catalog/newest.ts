import type { Webtoon } from '@softgate/shared'

export const NEW_RELEASE_CAP = 6

export const newestPublishedIds = (
  webtoons: Webtoon[],
  cap: number = NEW_RELEASE_CAP
): Set<string> => {
  const ids = [...webtoons]
    .filter((webtoon) => webtoon.status !== 'draft')
    .sort((a, b) => {
      const byDate = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (byDate !== 0) return byDate
      return a.id.localeCompare(b.id)
    })
    .slice(0, cap)
    .map((webtoon) => webtoon.id)

  return new Set(ids)
}
