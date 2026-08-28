import type { Env } from './env.js'

export function corsAllowlist(env: Env): string[] {
  return [env.CLIENT_URL, env.ADMIN_URL].filter((value): value is string => Boolean(value))
}

export function corsOrigin(env: Env, origin: string): string | undefined {
  if (!origin) return undefined
  return corsAllowlist(env).includes(origin) ? origin : undefined
}
