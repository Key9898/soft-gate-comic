import { IntegrationError } from './error.js'

export type SendTransactionalInput = {
  to: string
  subject: string
  text: string
}

export type MailPort = {
  sendTransactional(input: SendTransactionalInput): Promise<void>
}

export const notConfiguredMail: MailPort = {
  async sendTransactional() {
    throw new IntegrationError('MAIL_NOT_CONFIGURED')
  },
}
