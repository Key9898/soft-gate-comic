import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { isR2Configured, type Env } from '../env.js'
import { notConfiguredObjectStore, r2ObjectKey, type ObjectStorePort } from './object-store.js'

export type R2PutSend = (command: PutObjectCommand) => Promise<unknown>

function defaultSend(env: Env): R2PutSend {
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: env.R2_SECRET_ACCESS_KEY ?? '',
    },
  })
  return (command) => client.send(command)
}

export function createR2ObjectStore(env: Env, send?: R2PutSend): ObjectStorePort {
  const put = send ?? defaultSend(env)

  return {
    async putObject(input) {
      const key = r2ObjectKey(input.key)
      await put(
        new PutObjectCommand({
          Bucket: env.R2_BUCKET,
          Key: key,
          Body: input.body,
          ContentType: input.contentType,
        })
      )
    },
    publicUrl(key: string) {
      const base = env.R2_PUBLIC_BASE_URL
      if (!base) return undefined
      return `${base.replace(/\/+$/, '')}/${r2ObjectKey(key)}`
    },
  }
}

export function createObjectStore(env: Env, options?: { send?: R2PutSend }): ObjectStorePort {
  if (!isR2Configured(env)) return notConfiguredObjectStore
  return createR2ObjectStore(env, options?.send)
}
