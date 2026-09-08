import type { ApiDataEnvelope } from '@softgate/contracts'
import { persist, type PersistKind } from './persist.js'

export function healthPayload(): ApiDataEnvelope<{ ok: true; persist: PersistKind }> {
  return {
    data: {
      ok: true,
      persist: persist.kind,
    },
  }
}
