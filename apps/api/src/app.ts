import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuthApp } from './auth/routes.js'
import { optionalReaderUserId } from './auth/session.js'
import { corsOrigin } from './cors.js'
import type { Env } from './env.js'
import { healthPayload } from './health.js'
import { persist } from './persist.js'
import { createWalletApp } from './wallet/routes.js'

export function createApp(env: Env) {
  const app = new Hono()

  app.use(
    '*',
    cors({
      origin: (origin) => corsOrigin(env, origin) ?? '',
      credentials: true,
    })
  )

  app.get('/health', (c) => c.json(healthPayload))

  app.get('/api/catalog', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    return c.json({ data: persist.getPublishedCatalog(userId) })
  })
  app.get('/api/settings', (c) => c.json({ data: persist.getPortalSettings() }))
  app.route('/api/auth', createAuthApp(env))
  app.route('/api/wallet', createWalletApp(env))

  return app
}
