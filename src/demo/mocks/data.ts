import {
  mockAuthors as sharedAuthors,
  mockGenres as sharedGenres,
  mockWebtoons as sharedWebtoons,
  mockEpisodes as sharedEpisodes,
  mockComments as sharedComments,
  mockUsers as sharedUsers,
} from '@softgate/shared'
import type { Author, Genre, Webtoon, Episode, Comment, User } from '@softgate/shared'

export type { Author, Genre, Webtoon, Episode, Comment, User }

export const mockAuthors = sharedAuthors
export const mockGenres = sharedGenres
export const mockWebtoons = sharedWebtoons
export const mockEpisodes = sharedEpisodes
export const mockComments = sharedComments
export const mockUsers = sharedUsers
