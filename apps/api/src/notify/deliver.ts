import { IntegrationError } from '../ports/error.js'
import type { MailPort } from '../ports/mail.js'
import type { PushPort } from '../ports/push.js'
import { readerNoticeEmail } from '../mail/templates/reader-notice.js'
import { persist, type PersistNotification, type StubReaderUser } from '../persist.js'
import type { Env } from '../env.js'

export type OutOfBandResult = {
  emailed: boolean
  pushed: boolean
}

export async function deliverOutOfBand(input: {
  env: Env
  mail: MailPort
  push: PushPort
  user: Pick<StubReaderUser, 'id' | 'email'>
  notification: PersistNotification
  sendEmail: boolean
  sendPush: boolean
}): Promise<OutOfBandResult> {
  const result: OutOfBandResult = { emailed: false, pushed: false }
  const rendered = readerNoticeEmail({
    clientUrl: input.env.CLIENT_URL,
    message: input.notification.message,
    href: input.notification.href,
  })

  if (input.sendEmail && input.user.email) {
    try {
      await input.mail.sendTransactional({
        to: input.user.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      })
      result.emailed = true
    } catch (error) {
      if (!(error instanceof IntegrationError)) {
        /* still skip */
      }
    }
  }

  if (input.sendPush) {
    const subscriptions = await persist.listPushSubscriptions(input.user.id)
    if (subscriptions.length > 0) {
      let any = false
      for (const subscription of subscriptions) {
        try {
          await input.push.send({
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
            payload: {
              title: 'SoftGate Comic',
              body: input.notification.message,
              href: input.notification.href,
            },
          })
          any = true
        } catch (error) {
          if (!(error instanceof IntegrationError)) {
            /* still skip this endpoint */
          }
        }
      }
      result.pushed = any
    }
  }

  return result
}
