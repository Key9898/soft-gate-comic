import { describe, expect, it } from 'vitest'
import { IntegrationError } from '../ports/error.js'
import { notConfiguredMail } from '../ports/mail.js'
import { notConfiguredObjectStore } from '../ports/object-store.js'
import { persist, type PersistPort } from '../persist.js'

describe('named integration ports', () => {
  it('keeps persist as the stub PersistPort', () => {
    const port: PersistPort = persist
    expect(port.kind).toBe('stub')
  })

  it('throws R2_NOT_CONFIGURED from the object-store stub', async () => {
    await expect(
      notConfiguredObjectStore.putObject({
        key: 'covers/demo.png',
        contentType: 'image/png',
        body: new Uint8Array(),
      })
    ).rejects.toMatchObject({
      name: 'IntegrationError',
      code: 'R2_NOT_CONFIGURED',
    })
    await expect(
      notConfiguredObjectStore.putObject({
        key: 'covers/demo.png',
        contentType: 'image/png',
        body: new Uint8Array(),
      })
    ).rejects.toBeInstanceOf(IntegrationError)
  })

  it('throws MAIL_NOT_CONFIGURED from the mail stub', async () => {
    await expect(
      notConfiguredMail.sendTransactional({
        to: 'reader@softgate.example',
        subject: 'Demo',
        text: 'Not wired',
      })
    ).rejects.toMatchObject({
      name: 'IntegrationError',
      code: 'MAIL_NOT_CONFIGURED',
    })
  })
})
