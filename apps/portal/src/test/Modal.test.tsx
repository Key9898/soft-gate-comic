import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from './utils'
import Modal from '../components/Modal'

describe('Modal', () => {
  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
  })

  it('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title">
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByText('Modal Title')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} showCloseButton={true}>
        <p>Content</p>
      </Modal>
    )
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={true}>
        <p>Content</p>
      </Modal>
    )
    const overlay = screen.getByText('Content').parentElement?.parentElement?.previousSibling
    if (overlay) {
      fireEvent.click(overlay)
      expect(handleClose).toHaveBeenCalled()
    }
  })

  it('does not call onClose when closeOnOverlayClick is false', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={false}>
        <p>Content</p>
      </Modal>
    )
    const overlay = screen.getByText('Content').parentElement?.parentElement?.previousSibling
    if (overlay) {
      fireEvent.click(overlay)
      expect(handleClose).not.toHaveBeenCalled()
    }
  })

  it('applies size classes', () => {
    const { container, rerender } = render(
      <Modal isOpen={true} onClose={() => {}} size="sm">
        <p>Small</p>
      </Modal>
    )
    expect(container.querySelector('.max-w-sm')).toBeInTheDocument()

    rerender(
      <Modal isOpen={true} onClose={() => {}} size="md">
        <p>Medium</p>
      </Modal>
    )
    expect(container.querySelector('.max-w-md')).toBeInTheDocument()

    rerender(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        <p>Large</p>
      </Modal>
    )
    expect(container.querySelector('.max-w-lg')).toBeInTheDocument()

    rerender(
      <Modal isOpen={true} onClose={() => {}} size="xl">
        <p>Extra Large</p>
      </Modal>
    )
    expect(container.querySelector('.max-w-xl')).toBeInTheDocument()

    rerender(
      <Modal isOpen={true} onClose={() => {}} size="full">
        <p>Full</p>
      </Modal>
    )
    expect(container.querySelector('.max-w-4xl')).toBeInTheDocument()
  })

  it('hides close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} showCloseButton={false} title="Title">
        <p>Content</p>
      </Modal>
    )
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={true}>
        <p>Content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalled()
  })

  it('does not call onClose when closeOnEscape is false', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={false}>
        <p>Content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).not.toHaveBeenCalled()
  })
})
