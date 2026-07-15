---
title: Frontend Backend API Contract v2
type: reference
date: 2026-07-06
tags: [api, contract, backend]
---

# Frontend ↔ Backend API Contract (v2)

Shared contract for the EDC Thailand AI Commerce frontend and backend teams.  
TypeScript source of truth: `src/types/chat.ts`, `src/types/product.ts`, `src/types/avatar.ts`.

**Phase 34** added production URL resolution, session/history on chat requests, optional streaming, and CDN asset helpers.

## Environment

| Variable               | Default                 | Description                                                       |
| ---------------------- | ----------------------- | ----------------------------------------------------------------- |
| `VITE_USE_MOCK_API`    | `true`                  | When `false`, frontend uses HTTP via `apiFetch`                   |
| `VITE_API_BASE_URL`    | `http://localhost:3000` | Backend origin — dev Vite proxy; production absolute API base     |
| `VITE_API_AUTH_HEADER` | —                       | Optional auth header name (e.g. `Authorization`)                  |
| `VITE_API_AUTH_VALUE`  | —                       | Optional auth header value                                        |
| `VITE_ASSET_CDN_BASE`  | —                       | Optional CDN prefix for relative product image paths              |
| `VITE_CHAT_STREAMING`  | `false`                 | When `true`, uses `POST /api/chat/stream` NDJSON adapter if wired |

### URL resolution

- **Dev + mock:** relative `/api/*` (no network).
- **Dev + real API:** relative `/api/*` proxied by Vite to `VITE_API_BASE_URL`.
- **Production build:** `resolveApiUrl()` prefixes `VITE_API_BASE_URL` when mock is off.

Implementation: [`src/lib/api/http/base.ts`](../../src/lib/api/http/base.ts).

## `GET /api/products`

**Response:** `ProductsResponse`

```ts
interface ProductsResponse {
  products: Product[]
}
```

`Product` image fields (`heroImage`, `galleryImages`, etc.) accept **absolute CDN URLs** or relative paths. Relative paths resolve via `resolveAssetUrl()` when `VITE_ASSET_CDN_BASE` is set.

## `POST /api/chat`

**Request:** `ChatRequest`

```ts
interface ChatHistoryItem {
  role: 'user' | 'avatar'
  content: string
}

interface ChatRequest {
  message: string
  locale: 'en' | 'my'
  productId?: string
  sessionId?: string // client-generated UUID, persisted in sessionStorage
  history?: ChatHistoryItem[] // last 10 turns sent by frontend
}
```

**Response:** `ChatResponse`

```ts
interface ChatResponse {
  reply: string
  scenario?: 'welcome' | 'company' | 'category' | 'recommendation' | 'closing'
  recommendedProductIds?: string[]
  videoUrl?: string
  avatarUrl?: string
  audioUrl?: string // separate narration when not baked into video
  sessionId?: string // backend may confirm or rotate
  cta?: BubbleCta // optional navigation / follow-up action in summary bubble
}
```

### Frontend behavior on response

| Field                   | Frontend action                                  |
| ----------------------- | ------------------------------------------------ |
| `reply`                 | Append avatar message bubble                     |
| `scenario`              | Update `journeyState`                            |
| `recommendedProductIds` | Highlight product cards in showroom              |
| `videoUrl`              | Play in Avatar video slot (overrides manifest)   |
| `avatarUrl`             | Show in Avatar display slot (overrides manifest) |
| `audioUrl`              | Play via `<audio>` when separate from video      |
| `sessionId`             | Persist to `sessionStorage`                      |
| `cta`                   | Optional CTA button in summary speech bubble     |

Business logic (what to reply, which products to recommend) is **backend-owned**.

## `POST /api/chat/stream` (optional)

Enabled when `VITE_CHAT_STREAMING=true`. NDJSON lines:

```json
{"delta":"partial text"}
{"done":{"reply":"full text","scenario":"welcome"}}
```

Adapter: [`src/lib/api/http/chatStream.ts`](../../src/lib/api/http/chatStream.ts).  
Store uses `appendAvatarReplyDelta` during stream; final `done` payload matches `ChatResponse`.

## Avatar media

Designer manifest: [avatar-manifest.md](avatar-manifest.md)  
Priority: API URLs > `public/avatar/manifest.json` > convention `/videos/{scenario}-{locale}.mp4`.

## Avatar scenarios

| Scenario         | Typical trigger                 |
| ---------------- | ------------------------------- |
| `welcome`        | First visit / generic greeting  |
| `company`        | User asks about EDC Thailand    |
| `category`       | User browses categories         |
| `recommendation` | Product recommendation          |
| `closing`        | Thank you / end of conversation |
