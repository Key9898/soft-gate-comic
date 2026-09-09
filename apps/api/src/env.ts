import { randomBytes } from 'node:crypto'
import { z } from 'zod'

export const DEV_JWT_STUB = 'dev-only-not-for-production'

const optionalNonEmpty = z.string().min(1).optional()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int().min(1).max(65535),
  CLIENT_URL: z.string().url(),
  ADMIN_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(16),
  DATABASE_URL: optionalNonEmpty,
  R2_ACCOUNT_ID: optionalNonEmpty,
  R2_ACCESS_KEY_ID: optionalNonEmpty,
  R2_SECRET_ACCESS_KEY: optionalNonEmpty,
  R2_BUCKET: optionalNonEmpty,
  R2_PUBLIC_BASE_URL: z.string().url().optional(),
  BREVO_API_KEY: optionalNonEmpty,
  BREVO_FROM_EMAIL: z.string().email().optional(),
  ADMIN_SERVICE_TOKEN: optionalNonEmpty,
  VAPID_PUBLIC_KEY: optionalNonEmpty,
  VAPID_PRIVATE_KEY: optionalNonEmpty,
  VAPID_SUBJECT: optionalNonEmpty,
})

export type Env = z.infer<typeof envSchema>

const emptyToUndef = (value: string | undefined): string | undefined => {
  if (value == null || value.trim() === '') return undefined
  return value
}

export function parseEnv(raw: NodeJS.ProcessEnv): Env {
  const nodeEnv =
    raw.NODE_ENV === 'production' || raw.NODE_ENV === 'test' ? raw.NODE_ENV : 'development'

  let jwtSecret = emptyToUndef(raw.JWT_SECRET)
  if (!jwtSecret && nodeEnv !== 'production') {
    jwtSecret = randomBytes(32).toString('hex')
  }

  const parsed = envSchema.parse({
    NODE_ENV: nodeEnv,
    PORT: emptyToUndef(raw.PORT) ?? '3000',
    CLIENT_URL: raw.CLIENT_URL,
    ADMIN_URL: emptyToUndef(raw.ADMIN_URL),
    JWT_SECRET: jwtSecret,
    DATABASE_URL: emptyToUndef(raw.DATABASE_URL),
    R2_ACCOUNT_ID: emptyToUndef(raw.R2_ACCOUNT_ID),
    R2_ACCESS_KEY_ID: emptyToUndef(raw.R2_ACCESS_KEY_ID),
    R2_SECRET_ACCESS_KEY: emptyToUndef(raw.R2_SECRET_ACCESS_KEY),
    R2_BUCKET: emptyToUndef(raw.R2_BUCKET),
    R2_PUBLIC_BASE_URL: emptyToUndef(raw.R2_PUBLIC_BASE_URL),
    BREVO_API_KEY: emptyToUndef(raw.BREVO_API_KEY),
    BREVO_FROM_EMAIL: emptyToUndef(raw.BREVO_FROM_EMAIL),
    ADMIN_SERVICE_TOKEN: emptyToUndef(raw.ADMIN_SERVICE_TOKEN),
    VAPID_PUBLIC_KEY: emptyToUndef(raw.VAPID_PUBLIC_KEY),
    VAPID_PRIVATE_KEY: emptyToUndef(raw.VAPID_PRIVATE_KEY),
    VAPID_SUBJECT: emptyToUndef(raw.VAPID_SUBJECT),
  })

  if (parsed.NODE_ENV === 'production' && parsed.JWT_SECRET === DEV_JWT_STUB) {
    throw new Error('JWT_SECRET stub is not allowed in production')
  }

  return parsed
}

export function isDatabaseConfigured(env: Env): boolean {
  return Boolean(env.DATABASE_URL)
}

export function isR2Configured(env: Env): boolean {
  return Boolean(
    env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET
  )
}

export function isMailConfigured(env: Env): boolean {
  return Boolean(env.BREVO_API_KEY && env.BREVO_FROM_EMAIL)
}

export function isPushConfigured(env: Env): boolean {
  return Boolean(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY && env.VAPID_SUBJECT)
}
