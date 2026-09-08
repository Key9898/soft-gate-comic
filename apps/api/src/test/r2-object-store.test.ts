import { PutObjectCommand } from '@aws-sdk/client-s3'
import { describe, expect, it } from 'vitest'
import { IntegrationError } from '../ports/error.js'
import { createObjectStore, r2ObjectKey, type R2PutSend } from '../ports/object-store.js'
import { testEnv } from './helpers.js'

const png = {
  contentType: 'image/png',
  body: new Uint8Array([1, 2, 3]),
}

const r2Core = {
  R2_ACCOUNT_ID: 'acct',
  R2_ACCESS_KEY_ID: 'key',
  R2_SECRET_ACCESS_KEY: 'secret',
  R2_BUCKET: 'covers',
} as const

describe('r2ObjectKey', () => {
  it('prefixes relative keys with portal/', () => {
    expect(r2ObjectKey('covers/demo.png')).toBe('portal/covers/demo.png')
  })

  it('does not double the portal/ prefix', () => {
    expect(r2ObjectKey('portal/covers/demo.png')).toBe('portal/covers/demo.png')
  })

  it('namespaces admin-looking relative keys under portal/', () => {
    expect(r2ObjectKey('admin/x')).toBe('portal/admin/x')
  })

  it('allows two dots inside a file name', () => {
    expect(r2ObjectKey('file..png')).toBe('portal/file..png')
  })

  it('rejects empty, leading slash, backslash, and .. segments', () => {
    for (const key of ['', '  ', '/covers/x.png', 'a\\b', '../secret', 'a/../b']) {
      expect(() => r2ObjectKey(key)).toThrow(IntegrationError)
      try {
        r2ObjectKey(key)
      } catch (error) {
        expect(error).toMatchObject({ code: 'R2_INVALID_KEY' })
      }
    }
  })
})

describe('createObjectStore', () => {
  it('throws R2_NOT_CONFIGURED when R2 env is unset', async () => {
    const store = createObjectStore(testEnv())
    await expect(store.putObject({ key: 'covers/demo.png', ...png })).rejects.toMatchObject({
      code: 'R2_NOT_CONFIGURED',
    })
    expect(store.publicUrl('covers/demo.png')).toBeUndefined()
  })

  it('throws R2_NOT_CONFIGURED when core slots are partial', async () => {
    const store = createObjectStore(
      testEnv({
        R2_ACCOUNT_ID: 'acct',
        R2_ACCESS_KEY_ID: 'key',
        R2_SECRET_ACCESS_KEY: 'secret',
      })
    )
    await expect(store.putObject({ key: 'covers/demo.png', ...png })).rejects.toMatchObject({
      code: 'R2_NOT_CONFIGURED',
    })
  })

  it('puts under portal/ and does not double the prefix', async () => {
    const sent: PutObjectCommand[] = []
    const send: R2PutSend = async (command) => {
      sent.push(command)
    }
    const store = createObjectStore(testEnv(r2Core), { send })

    await store.putObject({ key: 'covers/demo.png', ...png })
    expect(sent[0]?.input.Key).toBe('portal/covers/demo.png')
    expect(sent[0]?.input.Bucket).toBe('covers')
    expect(sent[0]?.input.ContentType).toBe('image/png')
    expect(sent[0]?.input.ACL).toBeUndefined()

    sent.length = 0
    await store.putObject({ key: 'portal/covers/demo.png', ...png })
    expect(sent[0]?.input.Key).toBe('portal/covers/demo.png')

    sent.length = 0
    await store.putObject({ key: 'admin/x', ...png })
    expect(sent[0]?.input.Key).toBe('portal/admin/x')
  })

  it('rejects traversal keys before send', async () => {
    const sent: PutObjectCommand[] = []
    const send: R2PutSend = async (command) => {
      sent.push(command)
    }
    const store = createObjectStore(testEnv(r2Core), { send })

    for (const key of ['../secret', '', '/abs']) {
      await expect(store.putObject({ key, ...png })).rejects.toMatchObject({
        code: 'R2_INVALID_KEY',
      })
    }
    expect(sent).toHaveLength(0)
  })

  it('builds publicUrl from R2_PUBLIC_BASE_URL only', () => {
    const send: R2PutSend = async () => undefined
    const withBase = createObjectStore(
      testEnv({ ...r2Core, R2_PUBLIC_BASE_URL: 'https://cdn.example.com/' }),
      { send }
    )
    expect(withBase.publicUrl('covers/x.png')).toBe('https://cdn.example.com/portal/covers/x.png')

    const withoutBase = createObjectStore(testEnv(r2Core), { send })
    expect(withoutBase.publicUrl('covers/x.png')).toBeUndefined()
  })
})
