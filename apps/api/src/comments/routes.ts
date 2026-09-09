import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../env.js'
import { persist } from '../persist.js'
import { optionalReaderUserId } from '../auth/session.js'
import {
  COMMENT_MAX_LENGTH,
  COMMENT_REPLY_BODY_EN,
  COMMENT_REPLY_TITLE_KEY,
  hrefFromCommentKey,
  isCommentKey,
} from './keys.js'
import type { MailPort } from '../ports/mail.js'
import type { PushPort } from '../ports/push.js'
import { deliverOutOfBand } from '../notify/deliver.js'

const addSchema = z.object({
  key: z.string(),
  content: z.string(),
  spoiler: z.boolean().optional(),
})

const replySchema = z.object({
  key: z.string(),
  parentId: z.string(),
  content: z.string(),
  spoiler: z.boolean().optional(),
})

const editSchema = z.object({
  key: z.string(),
  commentId: z.string(),
  content: z.string(),
})

const idSchema = z.object({
  key: z.string(),
  commentId: z.string(),
})

function jsonError(
  c: { json: (body: unknown, status: 400 | 401) => Response },
  code: string,
  status: 400 | 401
) {
  return c.json({ error: { code } }, status)
}

function isJsonContentType(contentType: string | undefined) {
  return (contentType ?? '').toLowerCase().includes('application/json')
}

export function createCommentsApp(env: Env, ports?: { mail: MailPort; push: PushPort }) {
  const comments = new Hono()

  comments.use('*', async (c, next) => {
    if (c.req.method === 'POST' && !isJsonContentType(c.req.header('content-type'))) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    await next()
  })

  comments.get('/', async (c) => {
    const key = (c.req.query('key') ?? '').trim()
    if (!isCommentKey(key)) return jsonError(c, 'VALIDATION_ERROR', 400)
    return c.json({ data: { comments: await persist.listComments(key) } })
  })

  comments.post('/add', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    const parsed = addSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const key = parsed.data.key.trim()
    const content = parsed.data.content.trim()
    if (!isCommentKey(key) || !content || content.length > COMMENT_MAX_LENGTH) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    return c.json({
      data: {
        comments: await persist.addComment(key, userId, content, parsed.data.spoiler === true),
      },
    })
  })

  comments.post('/reply', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    const parsed = replySchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const key = parsed.data.key.trim()
    const parentId = parsed.data.parentId.trim()
    const content = parsed.data.content.trim()
    if (!isCommentKey(key) || !parentId || !content || content.length > COMMENT_MAX_LENGTH) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    const commentsList = await persist.addReply(
      key,
      parentId,
      userId,
      content,
      parsed.data.spoiler === true
    )
    if (ports) {
      const parent = commentsList.find((row) => row.id === parentId)
      if (parent && parent.userId !== userId) {
        const prefs = await persist.getPrefs(parent.userId)
        if (prefs.notifPrefs.commentReply) {
          const parentUser = await persist.findUserById(parent.userId)
          if (parentUser) {
            await deliverOutOfBand({
              env,
              mail: ports.mail,
              push: ports.push,
              user: parentUser,
              notification: {
                id: 'comment-reply-out-of-band',
                type: 'comment_reply',
                titleKey: COMMENT_REPLY_TITLE_KEY,
                message: COMMENT_REPLY_BODY_EN,
                isRead: false,
                createdAt: new Date().toISOString(),
                href: hrefFromCommentKey(key),
              },
              sendEmail: true,
              sendPush: true,
            })
          }
        }
      }
    }
    return c.json({
      data: {
        comments: commentsList,
      },
    })
  })

  comments.post('/edit', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    const parsed = editSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const key = parsed.data.key.trim()
    const commentId = parsed.data.commentId.trim()
    const content = parsed.data.content.trim()
    if (!isCommentKey(key) || !commentId || !content || content.length > COMMENT_MAX_LENGTH) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    return c.json({
      data: { comments: await persist.updateComment(key, commentId, userId, content) },
    })
  })

  comments.post('/delete', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    const parsed = idSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const key = parsed.data.key.trim()
    const commentId = parsed.data.commentId.trim()
    if (!isCommentKey(key) || !commentId) return jsonError(c, 'VALIDATION_ERROR', 400)
    return c.json({
      data: { comments: await persist.deleteComment(key, commentId, userId) },
    })
  })

  comments.post('/like', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    const parsed = idSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const key = parsed.data.key.trim()
    const commentId = parsed.data.commentId.trim()
    if (!isCommentKey(key) || !commentId) return jsonError(c, 'VALIDATION_ERROR', 400)
    return c.json({
      data: { comments: await persist.toggleCommentLike(key, commentId, userId) },
    })
  })

  comments.post('/report', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    const parsed = idSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const key = parsed.data.key.trim()
    const commentId = parsed.data.commentId.trim()
    if (!isCommentKey(key) || !commentId) return jsonError(c, 'VALIDATION_ERROR', 400)
    return c.json({
      data: { comments: await persist.reportComment(key, commentId, userId) },
    })
  })

  return comments
}
