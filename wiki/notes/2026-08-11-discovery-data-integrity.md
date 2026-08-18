---
title: Impl 14 — Discovery pipelines data integrity
type: note
date: 2026-08-11
tags: [mock-data, localStorage, related, impl-14]
impl: 14
---

# Impl 14 — Discovery pipelines — data integrity

- Stub episodes for webtoons 2–9 (3 each); webtoon 1 keeps 5; `episodeCount` matches reality
- `syncMockGenreCounts()` derives `Genre.webtoonCount`
- `SHARED_DATA_SCHEMA_VERSION = 2` envelope for localStorage; mismatch → fresh mock
- Related titles: shared genre token, exclude self/draft, max 6; hide if empty
