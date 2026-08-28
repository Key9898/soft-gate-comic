import { mockStoryChapters, type StoryChapter } from '@softgate/shared'

export function getPublishedStoryChapters(): StoryChapter[] {
  return mockStoryChapters
    .filter((chapter) => chapter.published)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
}
