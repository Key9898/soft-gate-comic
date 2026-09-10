import { parseAboutHistories, type PortalAboutHistory } from '../../lib/about/history'
import { useAboutData } from './AboutDataContext'

export type AboutHistoriesState =
  | { status: 'mock' }
  | { status: 'loading' }
  | { status: 'ready'; histories: PortalAboutHistory[] }
  | { status: 'empty' }
  | { status: 'error'; retry: () => void }

export function useAboutHistories(): AboutHistoriesState {
  const about = useAboutData()
  if (about.status === 'mock') return { status: 'mock' }
  if (about.status === 'loading') return { status: 'loading' }
  if (about.status === 'error') return { status: 'error', retry: about.retry }
  const parsed = parseAboutHistories(about.data)
  if (!parsed) return { status: 'error', retry: about.retry }
  if (parsed.length === 0) return { status: 'empty' }
  return { status: 'ready', histories: parsed }
}
