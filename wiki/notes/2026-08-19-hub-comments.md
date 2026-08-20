---
title: Impl 144 — Hub series comments
type: note
date: 2026-08-19
tags: [hub, comments, webtoon, softgate]
impl: 144
---

# Impl 144 — Hub series comments

Series hub `/webtoon/:id` has a series discussion thread. Key is `{id}:series`. Episode Reader stays `{id}:{episodeNumber}`. Same `softgate_comments_v1` schema **1**. Empty seed. Guest reads; write uses `comments.loginToComment` + `/login` `from`. Heading is Series discussion (`h2`); inner Comments `h3` keeps the count.

## Deferred

Daily, wait-for-free.

## Related

- [series-hub.md](../conventions/series-hub.md)
- [client-comments-notifications.md](../conventions/client-comments-notifications.md)
