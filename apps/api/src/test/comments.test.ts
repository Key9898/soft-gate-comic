import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { testEnv } from './helpers.js'

const jsonHeaders = { 'Content-Type': 'application/json' }

const userA = {
  email: 'comment-a@example.com',
  password: 'password1',
  username: 'commenta',
  displayName: 'Comment A',
}

const userB = {
  email: 'comment-b@example.com',
  password: 'password1',
  username: 'commentb',
  displayName: 'Comment B',
}

function cookieHeader(res: Response) {
  return res.headers
    .getSetCookie()
    .map((part) => part.split(';')[0])
    .join('; ')
}

async function register(body: typeof userA) {
  const app = createApp(testEnv())
  const registered = await app.request('/api/auth/register', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(body),
  })
  expect(registered.status).toBe(200)
  return { app, cookie: cookieHeader(registered) }
}

type CommentsPayload = {
  data: {
    comments: Array<{
      id: string
      content: string
      userId: string
      parentId?: string
      reported?: boolean
      likeCount: number
    }>
  }
}

describe('comments stub', () => {
  beforeEach(async () => {
    await persist.clearAuth()
  })

  afterEach(async () => {
    await persist.clearAuth()
  })

  it('allows guest GET and rejects invalid keys', async () => {
    const app = createApp(testEnv())
    const empty = await app.request('/api/comments?key=1:1')
    expect(empty.status).toBe(200)
    expect(await empty.json()).toEqual({ data: { comments: [] } })

    const bad = await app.request('/api/comments?key=')
    expect(bad.status).toBe(400)
    expect(await bad.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })
  })

  it('rejects unauthenticated writes', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/comments/add', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ key: '1:1', content: 'Hi' }),
    })
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: { code: 'NOT_AUTHENTICATED' } })
  })

  it('posts, isolates keys, and lets guests read', async () => {
    const { app, cookie } = await register(userA)
    const posted = await app.request('/api/comments/add', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ key: '1:1', content: 'Episode note', spoiler: true }),
    })
    expect(posted.status).toBe(200)
    const body = (await posted.json()) as CommentsPayload
    expect(body.data.comments).toHaveLength(1)
    expect(body.data.comments[0]?.content).toBe('Episode note')
    expect(body.data.comments[0]?.spoiler).toBe(true)

    const series = await app.request('/api/comments?key=1:series')
    expect(await series.json()).toEqual({ data: { comments: [] } })

    const guest = await createApp(testEnv()).request('/api/comments?key=1:1')
    const guestBody = (await guest.json()) as CommentsPayload
    expect(guestBody.data.comments[0]?.content).toBe('Episode note')
  })

  it('owner-only edit and delete, cascade replies, like and report stay visible', async () => {
    const a = await register(userA)
    const b = await register(userB)

    const posted = await a.app.request('/api/comments/add', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: a.cookie },
      body: JSON.stringify({ key: '9:2', content: 'Parent' }),
    })
    const parentId = ((await posted.json()) as CommentsPayload).data.comments[0]!.id

    await b.app.request('/api/comments/reply', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: b.cookie },
      body: JSON.stringify({ key: '9:2', parentId, content: 'Reply' }),
    })

    const stolen = await b.app.request('/api/comments/edit', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: b.cookie },
      body: JSON.stringify({ key: '9:2', commentId: parentId, content: 'Nope' }),
    })
    const stolenBody = (await stolen.json()) as CommentsPayload
    expect(stolenBody.data.comments.some((c) => c.content === 'Parent')).toBe(true)

    const liked = await b.app.request('/api/comments/like', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: b.cookie },
      body: JSON.stringify({ key: '9:2', commentId: parentId }),
    })
    const likedParent = ((await liked.json()) as CommentsPayload).data.comments.find(
      (c) => c.id === parentId
    )
    expect(likedParent?.likeCount).toBe(1)

    const reported = await b.app.request('/api/comments/report', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: b.cookie },
      body: JSON.stringify({ key: '9:2', commentId: parentId }),
    })
    const reportedBody = (await reported.json()) as CommentsPayload
    const parent = reportedBody.data.comments.find((c) => c.id === parentId)
    expect(parent?.reported).toBe(true)
    expect(parent?.content).toBe('Parent')

    const deleted = await a.app.request('/api/comments/delete', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: a.cookie },
      body: JSON.stringify({ key: '9:2', commentId: parentId }),
    })
    expect(((await deleted.json()) as CommentsPayload).data.comments).toEqual([])
  })

  it('notifies the parent author on reply and skips self-reply and muted prefs', async () => {
    const a = await register(userA)
    const b = await register(userB)
    const aMe = await a.app.request('/api/auth/me', { headers: { Cookie: a.cookie } })
    const aId = ((await aMe.json()) as { data: { id: string } }).data.id

    const posted = await a.app.request('/api/comments/add', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: a.cookie },
      body: JSON.stringify({ key: '3:1', content: 'Ask' }),
    })
    const parentId = ((await posted.json()) as CommentsPayload).data.comments[0]!.id

    await b.app.request('/api/comments/reply', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: b.cookie },
      body: JSON.stringify({ key: '3:1', parentId, content: 'Answer' }),
    })

    const inbox = await persist.getNotifications(aId)
    expect(inbox.some((row) => row.type === 'comment_reply')).toBe(true)
    expect(inbox[0]?.titleKey).toBe('notificationsPage.commentReply')
    expect(inbox[0]?.href).toBe('/read/3/1')

    await a.app.request('/api/comments/reply', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: a.cookie },
      body: JSON.stringify({ key: '3:1', parentId, content: 'Self' }),
    })
    expect(
      (await persist.getNotifications(aId)).filter((row) => row.type === 'comment_reply')
    ).toHaveLength(1)

    await persist.patchNotifPrefs(aId, { commentReply: false })
    await b.app.request('/api/comments/reply', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: b.cookie },
      body: JSON.stringify({ key: '3:1', parentId, content: 'Muted' }),
    })
    expect(
      (await persist.getNotifications(aId)).filter((row) => row.type === 'comment_reply')
    ).toHaveLength(1)
  })

  it('cascades comments on deleteReaderUser', async () => {
    const a = await register(userA)
    const aMe = await a.app.request('/api/auth/me', { headers: { Cookie: a.cookie } })
    const aId = ((await aMe.json()) as { data: { id: string } }).data.id
    await a.app.request('/api/comments/add', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: a.cookie },
      body: JSON.stringify({ key: '4:1', content: 'Gone' }),
    })
    expect(await persist.deleteReaderUser(aId)).toBe('ok')
    expect(await persist.listComments('4:1')).toEqual([])
  })
})
