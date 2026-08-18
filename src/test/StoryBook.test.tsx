import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from './utils'
import StoryBook from '../features/info/components/StoryBook'
import { getPublishedStoryChapters } from '../lib/info/storyChapters'

describe('StoryBook', () => {
  it('renders chapter 1 in the episode reader and hides unpublished copy', () => {
    const { container } = render(<StoryBook chapters={getPublishedStoryChapters()} />)
    expect(screen.getByRole('heading', { name: 'Why we started' })).toBeInTheDocument()
    expect(screen.getByText(/In 2026 we started SoftGate Comic/)).toBeInTheDocument()
    expect(screen.queryByText('Staff draft')).not.toBeInTheDocument()
    expect(screen.queryByText('This chapter is not published.')).not.toBeInTheDocument()
    expect(container.querySelector('.story-reader')).toBeTruthy()
    expect(screen.getByText('Episodes')).toBeInTheDocument()
    expect(container.querySelector('.story-book-volume')).toBeNull()
    expect(container.querySelector('.story-book-spine')).toBeNull()
    expect(container.querySelector('.story-book-flip')).toBeNull()
    expect(container.querySelector('.story-book-pager')).toBeNull()
    expect(container.querySelector('.hero-book-scene')).toBeNull()
    expect(container.querySelector('.hero-book-enter')).toBeNull()
    expect(container.querySelector('a')).toBeNull()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/about/our-story-splash.jpg"]')).toBeTruthy()
  })

  it('hides the splash after paging to the next episode', () => {
    const { container } = render(<StoryBook chapters={getPublishedStoryChapters()} />)
    expect(container.querySelector('img[src="/about/our-story-splash.jpg"]')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Next chapter' }))
    expect(container.querySelector('img[src="/about/our-story-splash.jpg"]')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Myanmar-first reading' })).toBeInTheDocument()
  })

  it('pages forward with toolbar turns without wrapping', () => {
    render(<StoryBook chapters={getPublishedStoryChapters()} />)
    const next = screen.getByRole('button', { name: 'Next chapter' })
    const prev = screen.getByRole('button', { name: 'Previous chapter' })
    expect(prev).toBeDisabled()
    expect(next).not.toBeDisabled()

    for (let step = 0; step < 5; step += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Next chapter' }))
    }
    expect(screen.getByRole('heading', { name: 'What we are aiming for' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next chapter' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous chapter' })).not.toBeDisabled()
  })

  it('advances with ArrowRight only when the story region is focused', () => {
    render(<StoryBook chapters={getPublishedStoryChapters()} />)
    const region = screen.getByLabelText('Our Story')

    fireEvent.keyDown(document.body, { key: 'ArrowRight' })
    expect(screen.getByRole('heading', { name: 'Why we started' })).toBeInTheDocument()

    region.focus()
    fireEvent.keyDown(region, { key: 'ArrowRight' })
    expect(screen.getByRole('heading', { name: 'Myanmar-first reading' })).toBeInTheDocument()
  })

  it('renders nothing when there are no chapters', () => {
    const { container } = render(<StoryBook chapters={[]} />)
    expect(screen.queryByLabelText('Our Story')).not.toBeInTheDocument()
    expect(container.querySelector('.story-reader')).toBeNull()
  })
})
