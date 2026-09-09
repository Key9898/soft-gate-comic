import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuthApp } from './auth/routes.js'
import { optionalReaderUserId } from './auth/session.js'
import { corsOrigin } from './cors.js'
import type { Env } from './env.js'
import { healthPayload } from './health.js'
import { persist } from './persist.js'
import type { MailPort } from './ports/mail.js'
import { createWalletApp } from './wallet/routes.js'
import { createLibraryApp } from './library/routes.js'
import { createNotificationsApp } from './notifications/routes.js'
import { createPrefsApp } from './prefs/routes.js'
import { createCommentsApp } from './comments/routes.js'

export function createApp(env: Env, options?: { mail?: MailPort }) {
  const app = new Hono()

  app.use(
    '*',
    cors({
      origin: (origin) => corsOrigin(env, origin) ?? '',
      credentials: true,
    })
  )

  app.get('/health', (c) => c.json(healthPayload()))

  app.get('/api/catalog', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    return c.json({ data: await persist.getPublishedCatalog(userId) })
  })
  app.get('/api/settings', (c) => c.json({ data: persist.getPortalSettings() }))
  app.route('/api/auth', createAuthApp(env, options))
  app.route('/api/wallet', createWalletApp(env))
  app.route('/api/library', createLibraryApp(env))
  app.route('/api/notifications', createNotificationsApp(env))
  app.route('/api/prefs', createPrefsApp(env))
  app.route('/api/comments', createCommentsApp(env))

  return app
}
