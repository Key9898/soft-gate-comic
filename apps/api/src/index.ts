import { serve } from '@hono/node-server'
import { config } from 'dotenv'
import { createApp } from './app.js'
import { parseEnv } from './env.js'

config()

const env = parseEnv(process.env)
const app = createApp(env)

serve({ fetch: app.fetch, port: env.PORT })
