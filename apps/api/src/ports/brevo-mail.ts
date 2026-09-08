import { BrevoClient } from '@getbrevo/brevo'
import { isMailConfigured, type Env } from '../env.js'
import { notConfiguredMail, type MailPort, type SendTransactionalInput } from './mail.js'

export type BrevoSendRequest = {
  to: { email: string }[]
  sender: { name: string; email: string }
  subject: string
  htmlContent: string
  textContent: string
}

export type BrevoSend = (request: BrevoSendRequest) => Promise<unknown>

function lazyDefaultSend(env: Env): BrevoSend {
  let client: BrevoClient | undefined
  return async (request) => {
    client ??= new BrevoClient({ apiKey: env.BREVO_API_KEY ?? '' })
    await client.transactionalEmails.sendTransacEmail(request)
  }
}

export function createBrevoMail(env: Env, send?: BrevoSend): MailPort {
  const put = send ?? lazyDefaultSend(env)

  return {
    async sendTransactional(input: SendTransactionalInput) {
      await put({
        to: [{ email: input.to }],
        sender: { name: 'SoftGate Comic', email: env.BREVO_FROM_EMAIL ?? '' },
        subject: input.subject,
        htmlContent: input.html,
        textContent: input.text,
      })
    },
  }
}

export function createMail(env: Env, options?: { send?: BrevoSend }): MailPort {
  if (!isMailConfigured(env)) return notConfiguredMail
  return createBrevoMail(env, options?.send)
}
