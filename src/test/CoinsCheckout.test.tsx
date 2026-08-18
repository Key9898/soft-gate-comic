import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from './utils'
import i18n from '../lib/i18n'
import CoinsPage from '../features/coins/CoinsPage'
import { coinPackages } from '../features/coins/components/coinData'

const openWizard = () => {
  fireEvent.click(screen.getByText(coinPackages[0].coins.toLocaleString()))
}

describe('Coins checkout honesty', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('shows the persistent demo note in the wizard', () => {
    render(<CoinsPage />)
    openWizard()
    expect(screen.getByText(/no real payment happens/i)).toBeInTheDocument()
  })

  it('keeps the demo note visible on the payment-details step', () => {
    render(<CoinsPage />)
    openWizard()
    fireEvent.click(screen.getByText('KBZPay'))
    expect(screen.getByText(/no real payment happens/i)).toBeInTheDocument()
    expect(screen.getByText(/demo transaction id|back to payment methods/i)).toBeInTheDocument()
  })

  it('shows localized phone validation errors from i18n keys', () => {
    render(<CoinsPage />)
    openWizard()
    fireEvent.click(screen.getByText('KBZPay'))
    const input = screen.getByLabelText(/mobile wallet number/i)
    fireEvent.change(input, { target: { value: '08' } })
    expect(screen.getByText(i18n.t('coinsPage.phoneStart09'))).toBeInTheDocument()
    fireEvent.change(input, { target: { value: '091' } })
    expect(screen.getByText(i18n.t('coinsPage.phoneTooShort'))).toBeInTheDocument()
  })

  it('renders no raw English method descriptions under mm locale', async () => {
    await i18n.changeLanguage('mm')
    render(<CoinsPage />)
    openWizard()
    expect(screen.queryByText('Any Local Banking App')).not.toBeInTheDocument()
    expect(screen.queryByText('Official KBZ mobile money')).not.toBeInTheDocument()
    expect(screen.getByText(i18n.t('coinsPage.methodKbzDesc'))).toBeInTheDocument()
  })

  it('localizes the price number under mm locale', async () => {
    await i18n.changeLanguage('mm')
    render(<CoinsPage />)
    const mmPrice = new Intl.NumberFormat('my-MM').format(coinPackages[0].price) + ' MMK'
    expect(screen.getAllByText(mmPrice).length).toBeGreaterThan(0)
  })
})

describe('Coins wizard shell (Impl 72)', () => {
  it('exposes the wizard as a labelled modal dialog with internal scroll', () => {
    render(<CoinsPage />)
    openWizard()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(document.getElementById(labelId!)).toBeTruthy()
    expect(dialog.className).toContain('max-h-[85dvh]')
    expect(dialog.querySelector('.overflow-y-auto.overscroll-contain')).toBeTruthy()
  })

  it('closes the wizard on Escape', async () => {
    render(<CoinsPage />)
    openWizard()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('has a page h1 for the Coins page', () => {
    render(<CoinsPage />)
    expect(screen.getByRole('heading', { level: 1, name: i18n.t('coinsPage.title') })).toBeTruthy()
  })
})
