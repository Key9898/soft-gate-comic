import webpush from 'web-push'
import { isPushConfigured, type Env } from '../env.js'
import { IntegrationError } from './error.js'

export type PushSendInput = {
  endpoint: string
  keys: { p256dh: string; auth: string }
  payload: { title: string; body: string; href?: string }
}

export type PushPort = {
  send(input: PushSendInput): Promise<void>
}

export type PushSend = (input: PushSendInput) => Promise<void>

export const notConfiguredPush: PushPort = {
  async send() {
    throw new IntegrationError('PUSH_NOT_CONFIGURED')
  },
}

function liveSend(env: Env): PushSend {
  webpush.setVapidDetails(
    env.VAPID_SUBJECT ?? '',
    env.VAPID_PUBLIC_KEY ?? '',
    env.VAPID_PRIVATE_KEY ?? ''
  )
  return async (input) => {
    await webpush.sendNotification(
      { endpoint: input.endpoint, keys: input.keys },
      JSON.stringify(input.payload)
    )
  }
}

export function createPush(env: Env, send?: PushSend): PushPort {
  if (!isPushConfigured(env)) return notConfiguredPush
  const put = send ?? liveSend(env)
  return {
    async send(input) {
      await put(input)
    },
  }
}
