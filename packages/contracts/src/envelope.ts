import { z } from 'zod'

export const apiDataEnvelopeSchema = z.object({
  data: z.unknown(),
})

export type ApiDataEnvelope<T> = {
  data: T
}

export function unwrapApiData<T>(payload: unknown): T | null {
  if (payload == null) return null

  if (typeof payload === 'object' && 'data' in payload) {
    const inner = (payload as ApiDataEnvelope<unknown>).data
    if (inner != null && typeof inner === 'object' && 'data' in inner) {
      return unwrapApiData<T>(inner)
    }
    return inner as T
  }

  return payload as T
}
