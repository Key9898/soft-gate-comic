import { IntegrationError } from './error.js'

export const R2_KEY_PREFIX = 'portal/'

export type PutObjectInput = {
  key: string
  contentType: string
  body: Uint8Array
}

export type ObjectStorePort = {
  putObject(input: PutObjectInput): Promise<void>
  publicUrl(key: string): string | undefined
}

export function r2ObjectKey(key: string): string {
  const trimmed = key.trim()
  if (!trimmed || trimmed.startsWith('/') || trimmed.includes('\\')) {
    throw new IntegrationError('R2_INVALID_KEY')
  }
  if (trimmed.split('/').some((segment) => segment === '..')) {
    throw new IntegrationError('R2_INVALID_KEY')
  }
  if (trimmed.startsWith(R2_KEY_PREFIX)) return trimmed
  return `${R2_KEY_PREFIX}${trimmed}`
}

export const notConfiguredObjectStore: ObjectStorePort = {
  async putObject() {
    throw new IntegrationError('R2_NOT_CONFIGURED')
  },
  publicUrl() {
    return undefined
  },
}

export { createObjectStore, type R2PutSend } from './r2-object-store.js'
