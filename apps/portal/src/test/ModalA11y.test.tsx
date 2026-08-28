import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../components/Modal'
import LibraryDeleteConfirmDialog from '../features/library/components/LibraryDeleteConfirmDialog'

const ModalHarness = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <>
    <button type="button">trigger</button>
    <Modal isOpen={open} onClose={onClose} title="Dialog Title">
      <p>Dialog body</p>
    </Modal>
  </>
)

describe('Modal a11y (APG dialog pattern)', () => {
  it('exposes role=dialog with aria-modal and labelled title', () => {
    render(<ModalHarness open={true} onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId!)).toHaveTextContent('Dialog Title')
  })

  it('moves focus into the dialog on open and restores it on close', () => {
    const { rerender } = render(<ModalHarness open={false} onClose={() => {}} />)
    const trigger = screen.getByRole('button', { name: 'trigger' })
    trigger.focus()

    rerender(<ModalHarness open={true} onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.contains(document.activeElement)).toBe(true)

    rerender(<ModalHarness open={false} onClose={() => {}} />)
    expect(document.activeElement).toBe(trigger)
  })

  it('locks body scroll while open and restores it on close', () => {
    const { rerender } = render(<ModalHarness open={false} onClose={() => {}} />)
    rerender(<ModalHarness open={true} onClose={() => {}} />)
    expect(document.body.style.position).toBe('fixed')
    rerender(<ModalHarness open={false} onClose={() => {}} />)
    expect(document.body.style.position).not.toBe('fixed')
  })

  it('gives modal content an internal scroll container', () => {
    render(<ModalHarness open={true} onClose={() => {}} />)
    const body = screen.getByText('Dialog body').parentElement!
    expect(body.className).toContain('overflow-y-auto')
    expect(body.className).toContain('max-h-')
  })
})

const DialogHarness = ({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}) => (
  <LibraryDeleteConfirmDialog
    isOpen={open}
    title="Remove book?"
    message="This cannot be undone."
    cancelLabel="Cancel"
    confirmLabel="Remove"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
)

describe('LibraryDeleteConfirmDialog a11y', () => {
  it('exposes dialog semantics labelled by the heading', () => {
    render(<DialogHarness open={true} onCancel={() => {}} onConfirm={() => {}} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(document.getElementById(labelId!)).toHaveTextContent('Remove book?')
  })

  it('focuses Cancel initially and closes on Escape', () => {
    const onCancel = vi.fn()
    render(<DialogHarness open={true} onCancel={onCancel} onConfirm={() => {}} />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('wraps Tab focus inside the dialog', () => {
    render(<DialogHarness open={true} onCancel={() => {}} onConfirm={() => {}} />)
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    const confirm = screen.getByRole('button', { name: 'Remove' })

    cancel.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(confirm)

    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(cancel)
  })
})
