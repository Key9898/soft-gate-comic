import {
  parseAboutMembers,
  parseAboutMeta,
  type PortalAboutMember,
  type PortalAboutMeta,
} from '../../lib/about/team'
import { useAboutData } from './AboutDataContext'

export type AboutTeamState =
  | { status: 'mock' }
  | { status: 'loading' }
  | { status: 'ready'; members: PortalAboutMember[]; meta: PortalAboutMeta | null }
  | { status: 'empty'; meta: PortalAboutMeta | null }
  | { status: 'error'; retry: () => void }

export function useAboutTeam(): AboutTeamState {
  const about = useAboutData()
  if (about.status === 'mock') return { status: 'mock' }
  if (about.status === 'loading') return { status: 'loading' }
  if (about.status === 'error') return { status: 'error', retry: about.retry }
  const members = parseAboutMembers(about.data)
  if (!members) return { status: 'error', retry: about.retry }
  const meta = parseAboutMeta(about.data)
  if (members.length === 0) return { status: 'empty', meta }
  return { status: 'ready', members, meta }
}
