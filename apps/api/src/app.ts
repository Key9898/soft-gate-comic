import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuthApp } from './auth/routes.js'
import { optionalReaderUserId } from './auth/session.js'
import { corsOrigin } from './cors.js'
import type { Env } from './env.js'
import { healthPayload } from './health.js'
import { persist } from './persist.js'
import { createMail, type MailPort } from './ports/mail.js'
import { createPush, type PushPort } from './ports/push.js'
import { createWalletApp } from './wallet/routes.js'
import { createLibraryApp } from './library/routes.js'
import { createNotificationsApp } from './notifications/routes.js'
import { createPrefsApp } from './prefs/routes.js'
import { createCommentsApp } from './comments/routes.js'
import { createInternalNotificationsApp } from './internal/routes.js'

export function createApp(env: Env, options?: { mail?: MailPort; push?: PushPort }) {
  const app = new Hono()
  const mail = options?.mail ?? createMail(env)
  const push = options?.push ?? createPush(env)

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
  app.get('/api/settings', async (c) => c.json({ data: await persist.getPortalSettings() }))
  app.route('/api/auth', createAuthApp(env, { mail }))
  app.route('/api/wallet', createWalletApp(env))
  app.route('/api/library', createLibraryApp(env))
  app.route('/api/notifications', createNotificationsApp(env, { push }))
  app.route('/api/prefs', createPrefsApp(env))
  app.route('/api/comments', createCommentsApp(env, { mail, push }))
  app.route('/api/internal/notifications', createInternalNotificationsApp(env, { mail, push }))

  return app
}
