import { IntegrationError } from './error.js'

export type PutObjectInput = {
  key: string
  contentType: string
  body: Uint8Array
}

export type ObjectStorePort = {
  putObject(input: PutObjectInput): Promise<void>
}

export const notConfiguredObjectStore: ObjectStorePort = {
  async putObject() {
    throw new IntegrationError('R2_NOT_CONFIGURED')
  },
}
