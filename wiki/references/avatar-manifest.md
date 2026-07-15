---
title: Avatar Manifest — Designer Deliverables
type: reference
date: 2026-07-07
tags: [avatar, designer, manifest, cdn]
---

# Avatar Manifest

Designer delivers **MP4/WebM videos** (motion + audio + lip-sync baked in) plus a **JSON manifest** — not animation JSON (Lottie/Rive). The manifest is an index of URLs for performance and easy updates.

## File location

| File                                                               | Purpose                                             |
| ------------------------------------------------------------------ | --------------------------------------------------- |
| [`public/avatar/manifest.json`](../../public/avatar/manifest.json) | Committed template — update URLs when assets arrive |
| `public/videos/{scenario}-{locale}.mp4`                            | Convention fallback when manifest `video` is null   |
| `public/avatar/*`                                                  | Static portrait images per locale                   |

Loader: [`src/config/avatarManifest.ts`](../../src/config/avatarManifest.ts) — fetched on app `initialize()`.

## Schema (version 1)

```json
{
  "version": 1,
  "staticAvatar": {
    "default": null,
    "en": "/avatar/avatar-en.png",
    "my": "/avatar/avatar-my.png"
  },
  "posters": {
    "default": "/logo/logoEDCThailand2026.svg"
  },
  "scenarios": {
    "welcome": {
      "en": { "video": "https://cdn.example.com/welcome-en.mp4", "poster": null },
      "my": { "video": null, "poster": null }
    }
  }
}
```

### Fields

| Field                              | Type                      | Notes                                               |
| ---------------------------------- | ------------------------- | --------------------------------------------------- |
| `staticAvatar`                     | `locale → url \| null`    | Top strip portrait in `AvatarDisplay`               |
| `posters`                          | `locale \| default → url` | Video poster before play                            |
| `scenarios.{name}.{locale}.video`  | `url \| null`             | `null` → fallback `/videos/{scenario}-{locale}.mp4` |
| `scenarios.{name}.{locale}.poster` | `url \| null`             | Optional per-scenario poster                        |

### Scenarios

`welcome` | `company` | `category` | `recommendation` | `closing`

### Locales

`en` | `my` — 5 × 2 = **10 video clips** when fully delivered.

## Designer checklist

1. Export MP4 (H.264, 16:9, audio baked in) per scenario × locale.
2. Upload to CDN (Cloudinary, S3, etc.) or drop in `public/videos/`.
3. Update **only** `manifest.json` with CDN URLs — no component changes.
4. Optional static portrait PNG/WebP in `staticAvatar`.
5. Confirm naming: `{scenario}-{locale}.mp4` if using convention fallback.

## Playback notes

- Video unmutes after first user interaction (chat send, quick chip, ask avatar).
- Separate `audioUrl` from backend API supported when video has no audio track.
- API `videoUrl` / `avatarUrl` override manifest per chat response.

## Related

- [api-contract.md](api-contract.md) — backend media fields
- [implementation-phases.md](../architecture/implementation-phases.md#impl-phase-34) — Phase 34 integration work
