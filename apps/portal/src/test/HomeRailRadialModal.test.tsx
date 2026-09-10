import { describe, expect, it, vi } from 'vitest'
import type { ComponentProps } from 'react'
import { mockGenres, mockWebtoons } from '@softgate/shared'
import { fireEvent, render, screen, within } from './utils'
import HomeRailRadialModal from '../features/home/components/HomeRailRadialModal'

const emptyIds = new Set<string>()
const noop = () => {}
const rail = mockWebtoons.slice(0, 4)

const renderModal = (overrides: Partial<ComponentProps<typeof HomeRailRadialModal>> = {}) => {
  const onClose = overrides.onClose ?? vi.fn()
  render(
    <HomeRailRadialModal
      open
      onClose={onClose}
      title="Popular"
      webtoons={rail}
      variant="ranking"
      lang="en"
      genres={mockGenres}
      newestIds={emptyIds}
      loadedImages={emptyIds}
      failedImages={emptyIds}
      onImageLoad={noop}
      onImageError={noop}
      {...overrides}
    />
  )
  return { onClose }
}

describe('HomeRailRadialModal', () => {
  it('does not render when closed', () => {
    renderModal({ open: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens a ranked dialog with the first title centered', () => {
    renderModal()
    const dialog = screen.getByRole('dialog', { name: 'Popular' })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getAllByTestId('rank-mark')).toHaveLength(4)
    const center = within(dialog).getByTestId('home-radial-center')
    expect(center).toHaveClass('home-radial-slot', 'is-center')
    expect(center.querySelector('a')).toHaveAttribute('href', `/webtoon/${rail[0].id}`)
  })

  it('rotates Next and Previous around the list', () => {
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    const afterNext = screen.getByTestId('home-radial-center')
    expect(afterNext.querySelector('a')).toHaveAttribute('href', `/webtoon/${rail[1].id}`)
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    const afterWrap = screen.getByTestId('home-radial-center')
    expect(afterWrap.querySelector('a')).toHaveAttribute('href', `/webtoon/${rail[3].id}`)
  })

  it('omits rank marks on Updated and New variants', () => {
    const { rerender } = render(
      <HomeRailRadialModal
        open
        onClose={vi.fn()}
        title="Updated"
        webtoons={rail}
        variant="updated"
        lang="en"
        genres={mockGenres}
        newestIds={emptyIds}
        loadedImages={emptyIds}
        failedImages={emptyIds}
        onImageLoad={noop}
        onImageError={noop}
      />
    )
    expect(screen.getByRole('dialog', { name: 'Updated' })).toBeInTheDocument()
    expect(screen.queryByTestId('rank-mark')).not.toBeInTheDocument()
    rerender(
      <HomeRailRadialModal
        open
        onClose={vi.fn()}
        title="New Releases"
        webtoons={rail}
        variant="new"
        lang="en"
        genres={mockGenres}
        newestIds={emptyIds}
        loadedImages={emptyIds}
        failedImages={emptyIds}
        onImageLoad={noop}
        onImageError={noop}
      />
    )
    expect(screen.getByRole('dialog', { name: 'New Releases' })).toBeInTheDocument()
    expect(screen.queryByTestId('rank-mark')).not.toBeInTheDocument()
  })

  it('closes on Escape and overlay click', () => {
    const { onClose } = renderModal()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByTestId('home-radial-backdrop'))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('hides wrap controls for a single title', () => {
    renderModal({ webtoons: rail.slice(0, 1) })
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
    expect(screen.getByTestId('home-radial-center').querySelector('a')).toHaveAttribute(
      'href',
      `/webtoon/${rail[0].id}`
    )
  })
})
