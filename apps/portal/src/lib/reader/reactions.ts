export const EPISODE_REACTIONS_KEY = 'softgate_episode_reactions_v1'
export const EPISODE_REACTIONS_SCHEMA = 1 as const

/** Fixed set, in display order. A constant rather than a prop so a stored pick keeps
 *  meaning across episodes. */
export const REACTIONS = ['😍', '😭', '😂', '😱', '🔥'] as const
export type Reaction = (typeof REACTIONS)[number]

type ReactionStore = {
  schemaVersion: typeof EPISODE_REACTIONS_SCHEMA
  picks: Record<string, Reaction>
}

const COUNT_MIN = 12
const COUNT_SPAN = 469

function emptyStore(): ReactionStore {
  return { schemaVersion: EPISODE_REACTIONS_SCHEMA, picks: {} }
}

export function episodeReactionKey(webtoonId: string, episodeNumber: number): string {
  return `${webtoonId}:${episodeNumber}`
}

function isReaction(value: unknown): value is Reaction {
  return typeof value === 'string' && (REACTIONS as readonly string[]).includes(value)
}

function readStore(): ReactionStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(EPISODE_REACTIONS_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<ReactionStore>
    if (obj.schemaVersion !== EPISODE_REACTIONS_SCHEMA || !obj.picks) return emptyStore()
    const picks: Record<string, Reaction> = {}
    for (const [key, value] of Object.entries(obj.picks)) {
      if (isReaction(value)) picks[key] = value
    }
    return { schemaVersion: EPISODE_REACTIONS_SCHEMA, picks }
  } catch {
    return emptyStore()
  }
}

function writeStore(store: ReactionStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(EPISODE_REACTIONS_KEY, JSON.stringify(store))
}

export function readReaction(webtoonId: string, episodeNumber: number): Reaction | undefined {
  return readStore().picks[episodeReactionKey(webtoonId, episodeNumber)]
}

export function toggleReaction(
  webtoonId: string,
  episodeNumber: number,
  reaction: Reaction
): Reaction | undefined {
  const key = episodeReactionKey(webtoonId, episodeNumber)
  const store = readStore()
  const cleared = store.picks[key] === reaction
  const picks = { ...store.picks }
  if (cleared) {
    delete picks[key]
  } else {
    picks[key] = reaction
  }
  writeStore({ schemaVersion: EPISODE_REACTIONS_SCHEMA, picks })
  return cleared ? undefined : reaction
}

/** FNV-1a. The reader server-renders, so the Demo count has to be a pure function of the
 *  episode and emoji — a random seed would differ between the server and client passes
 *  and produce a hydration mismatch. */
function hash(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function reactionCount(
  webtoonId: string,
  episodeNumber: number,
  reaction: Reaction,
  picked: boolean
): number {
  const seed = hash(`${webtoonId}:${episodeNumber}:${reaction}`)
  return COUNT_MIN + (seed % COUNT_SPAN) + (picked ? 1 : 0)
}
