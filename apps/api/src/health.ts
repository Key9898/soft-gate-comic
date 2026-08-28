import type { ApiDataEnvelope } from '@softgate/contracts'
import { persist } from './persist.js'

export const healthPayload: ApiDataEnvelope<{ ok: true; persist: typeof persist.kind }> = {
  data: {
    ok: true,
    persist: persist.kind,
  },
}
