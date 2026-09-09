import { serve } from '@hono/node-server'
import { config } from 'dotenv'
import { createApp } from './app.js'
import { parseEnv } from './env.js'
import { openPersist, persist } from './persist.js'

config()

async function main() {
  const env = parseEnv(process.env)
  await openPersist(env)
  const app = createApp(env)
  serve({ fetch: app.fetch, port: env.PORT })
  console.log(`SoftGate API :${env.PORT} persist=${persist.kind}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
