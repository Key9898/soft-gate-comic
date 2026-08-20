import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import CreatorsPage from '../features/info/CreatorsPage'

describe('CreatorsPage', () => {
  it('uses Publish with Us as the page heading and breadcrumb, Creators as the eyebrow', () => {
    render(<CreatorsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Publish with Us' })).toBeInTheDocument()
    const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(breadcrumb).toHaveTextContent('Publish with Us')
    expect(screen.getByText('Creators')).toBeInTheDocument()
  })

  it('renders fact chips for editorial intake', () => {
    const { container } = render(<CreatorsPage />)
    const facts = container.querySelector('dl')
    expect(facts?.textContent).toContain('Editorial intake')
    expect(facts?.textContent).toContain('Myanmar')
    expect(facts?.textContent).toContain('English and Myanmar')
    expect(facts?.textContent).toContain('Demo portal')
  })

  it('renders the format handbook with 800px and 3:4 cover', () => {
    render(<CreatorsPage />)
    expect(screen.getByRole('heading', { name: /format handbook/i })).toBeInTheDocument()
    expect(screen.getAllByText(/800px/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/3:4/).length).toBeGreaterThan(0)
    expect(screen.getByText(/at least 3 finished episodes/i)).toBeInTheDocument()
  })

  it('renders pitch checklist, after-you-send, and payout honesty', () => {
    render(<CreatorsPage />)
    expect(screen.getByRole('heading', { name: /what to put in your pitch/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /after you send/i })).toBeInTheDocument()
    expect(screen.getByText(/do not publish a reply SLA/i)).toBeInTheDocument()
    expect(screen.queryByText(/10 business days/i)).not.toBeInTheDocument()
    expect(screen.getAllByText(/payouts are not live/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/local demo wallet/i)).toBeInTheDocument()
  })

  it('has send-your-pitch CTAs to contact with submit intent', () => {
    render(<CreatorsPage />)
    const ctas = screen.getAllByRole('link', { name: /send your pitch/i })
    expect(ctas.length).toBeGreaterThanOrEqual(2)
    for (const cta of ctas) {
      expect(cta).toHaveAttribute('href', '/contact?intent=submit')
    }
    expect(screen.getAllByText(/do not send unsolicited files/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/contact admin/i)).not.toBeInTheDocument()
  })

  it('renders three how-it-works step headings', () => {
    render(<CreatorsPage />)
    expect(screen.getByRole('heading', { name: /prepare your series/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /check the format/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /contact our team/i })).toBeInTheDocument()
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<CreatorsPage />)
    expect(container.textContent).not.toMatch(/creators\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/info\.[a-zA-Z]/)
  })

  it('has a jump TOC to the format handbook', () => {
    render(<CreatorsPage />)
    expect(screen.getByRole('navigation', { name: /on this page/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^format$/i })).toHaveAttribute(
      'href',
      '/creators#creators-specs'
    )
  })

  it('shows handbook 3:4 and 800px visuals, demo covers, and do-not-send', () => {
    const { container } = render(<CreatorsPage />)
    expect(container.querySelector('.book-media.aspect-\\[3\\/4\\], .book-media')).toBeTruthy()
    expect(screen.getAllByText(/800px/i).length).toBeGreaterThan(0)
    expect(container.querySelector('img[src="/webtoon-covers/the-last-horizon.png"]')).toBeTruthy()
    expect(container.querySelector('img[src="/webtoon-covers/love-in-seoul.png"]')).toBeTruthy()
    expect(container.querySelector('img[src="/webtoon-covers/shadow-knight.png"]')).toBeTruthy()
    expect(screen.getByText(/demo catalog covers/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /do not send/i })).toBeInTheDocument()
    expect(screen.getByText(/sending a pitch is not exclusive/i)).toBeInTheDocument()
    expect(screen.getByText(/do i have to be exclusive/i)).toBeInTheDocument()
  })

  it('marks the support inbox as not translated', () => {
    render(<CreatorsPage />)
    expect(screen.getByText('support@softgatecomic.com')).toHaveAttribute('translate', 'no')
  })
})
