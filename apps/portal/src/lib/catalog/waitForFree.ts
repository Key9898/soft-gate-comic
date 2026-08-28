import {
  parseFreeAt,
  type WaitForFreeEpisode,
  hasWaitSchedule,
  isEpisodeLocked,
  isWaitFreeNow,
} from '@softgate/shared'
import { formatCatalogDate } from './formatCatalogDate'

export type { WaitForFreeEpisode }
export { hasWaitSchedule, isEpisodeLocked, isWaitFreeNow, parseFreeAt }

export const formatWaitFreeAt = (iso: string): string => {
  const ms = parseFreeAt(iso)
  if (ms === null) return iso
  const date = formatCatalogDate(iso)
  const hours = String(new Date(ms).getUTCHours()).padStart(2, '0')
  const minutes = String(new Date(ms).getUTCMinutes()).padStart(2, '0')
  return `${date}, ${hours}:${minutes} UTC`
}
