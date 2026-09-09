import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../env.js'
import { persist } from '../persist.js'
import { optionalReaderUserId } from '../auth/session.js'
import { COMMENT_MAX_LENGTH, isCommentKey } from './keys.js'

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

export function createCommentsApp(env: Env) {
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
    return c.json({
      data: {
        comments: await persist.addReply(
          key,
          parentId,
          userId,
          content,
          parsed.data.spoiler === true
        ),
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
