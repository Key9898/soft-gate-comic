import type { Env } from '../env.js'
import { DEV_JWT_STUB, parseEnv } from '../env.js'

export function testEnv(overrides: Partial<NodeJS.ProcessEnv> = {}): Env {
  return parseEnv({
    NODE_ENV: 'test',
    PORT: '3000',
    CLIENT_URL: 'http://localhost:5173',
    JWT_SECRET: DEV_JWT_STUB,
    ...overrides,
  })
}
