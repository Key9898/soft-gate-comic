import { isEpisodeLocked, type PublishedCatalog } from '@softgate/shared/catalog'

export function episodeUnlockKey(webtoonId: string, episodeNumber: number) {
  return `${webtoonId}:${episodeNumber}`
}

export function redactLockedEpisodeImages(
  catalog: PublishedCatalog,
  unlockedKeys: ReadonlySet<string>,
  now: number = Date.now()
): PublishedCatalog {
  return {
    ...catalog,
    episodes: catalog.episodes.map((episode) => {
      const unlocked = unlockedKeys.has(episodeUnlockKey(episode.webtoonId, episode.episodeNumber))
      if (!isEpisodeLocked(episode, unlocked, now)) return episode
      return { ...episode, images: [] }
    }),
  }
}
