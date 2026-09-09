export const NEW_EPISODE_TITLE_KEY = 'notificationsPage.newEpisode'

export function newEpisodeInboxId(webtoonId: string, episodeNumber: number) {
  return `sub-${webtoonId}-${episodeNumber}`
}

export function newEpisodeMessageEn(title: string, episodeNumber: number) {
  return `${title} — Episode ${episodeNumber} is ready to read.`
}
