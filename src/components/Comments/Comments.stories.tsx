import type { Meta, StoryObj } from '@storybook/react'
import Comments from './Comments'

const meta = {
  title: 'Components/Comments',
  component: Comments,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Comments>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    comments: [
      {
        id: '1',
        userId: '2',
        user: {
          id: '2',
          username: 'webtoon_fan',
          displayName: 'Webtoon Fan',
        },
        content:
          'This episode was absolutely amazing! The plot twist at the end caught me completely off guard.',
        likeCount: 156,
        isLiked: false,
        createdAt: '2026-04-25T10:30:00Z',
        replies: [
          {
            id: '1-1',
            userId: '3',
            user: {
              id: '3',
              username: 'manga_lover',
              displayName: 'Manga Lover',
            },
            content: 'I know right! That twist was insane!',
            likeCount: 24,
            isLiked: true,
            createdAt: '2026-04-25T11:45:00Z',
          },
        ],
      },
      {
        id: '2',
        userId: '4',
        user: {
          id: '4',
          username: 'reader_123',
          displayName: 'Book Lover',
        },
        content:
          'The art style in this chapter is incredible. The artist really outdid themselves.',
        likeCount: 89,
        isLiked: true,
        createdAt: '2026-04-25T14:20:00Z',
      },
    ],
    currentUserId: '1',
    currentUserName: 'You',
  },
}

export const EmptyComments: Story = {
  args: {
    comments: [],
    currentUserId: '1',
    currentUserName: 'You',
  },
}

export const WithManyReplies: Story = {
  args: {
    comments: [
      {
        id: '1',
        userId: '2',
        user: {
          id: '2',
          username: 'webtoon_fan',
          displayName: 'Webtoon Fan',
        },
        content: 'What did everyone think about the latest chapter?',
        likeCount: 45,
        isLiked: false,
        createdAt: '2026-04-25T10:30:00Z',
        replies: [
          {
            id: '1-1',
            userId: '3',
            user: {
              id: '3',
              username: 'manga_lover',
              displayName: 'Manga Lover',
            },
            content: 'It was great! Loved the character development.',
            likeCount: 12,
            isLiked: false,
            createdAt: '2026-04-25T11:45:00Z',
          },
          {
            id: '1-2',
            userId: '4',
            user: {
              id: '4',
              username: 'reader_123',
              displayName: 'Book Lover',
            },
            content: 'The artwork was stunning!',
            likeCount: 8,
            isLiked: true,
            createdAt: '2026-04-25T12:00:00Z',
          },
          {
            id: '1-3',
            userId: '5',
            user: {
              id: '5',
              username: 'story_fan',
              displayName: 'Story Fan',
            },
            content: 'Cannot wait for the next episode!',
            likeCount: 5,
            isLiked: false,
            createdAt: '2026-04-25T13:30:00Z',
          },
        ],
      },
    ],
    currentUserId: '1',
    currentUserName: 'You',
  },
}

export const OwnComments: Story = {
  args: {
    comments: [
      {
        id: '1',
        userId: '1',
        user: {
          id: '1',
          username: 'you',
          displayName: 'You',
        },
        content: 'This is my comment. I can edit or delete it.',
        likeCount: 10,
        isLiked: false,
        createdAt: '2026-04-25T10:30:00Z',
        isEdited: true,
      },
    ],
    currentUserId: '1',
    currentUserName: 'You',
  },
}
