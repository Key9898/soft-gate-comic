import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import CreatorsPage from '../features/info/CreatorsPage'

describe('CreatorsPage', () => {
  it('renders the masthead title', () => {
    render(<CreatorsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Publish with Us' })).toBeInTheDocument()
  })

  it('renders three how-it-works step headings', () => {
    render(<CreatorsPage />)
    expect(screen.getByRole('heading', { name: /prepare your series/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /check the format/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /contact our team/i })).toBeInTheDocument()
  })

  it('renders format checklist and what-we-look-for panels', () => {
    render(<CreatorsPage />)
    expect(screen.getByRole('heading', { name: /format checklist/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /what we look for/i })).toBeInTheDocument()
    expect(screen.getByText(/at least 3 finished episodes/i)).toBeInTheDocument()
  })

  it('has a single submission CTA linking to /contact', () => {
    render(<CreatorsPage />)
    const cta = screen.getByRole('link', { name: /contact admin/i })
    expect(cta).toHaveAttribute('href', '/contact')
    expect(screen.getByText(/do not send unsolicited files/i)).toBeInTheDocument()
  })

  it('renders breadcrumb with current page label', () => {
    render(<CreatorsPage />)
    const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(breadcrumb).toHaveTextContent('Publish with Us')
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<CreatorsPage />)
    expect(container.textContent).not.toMatch(/creators\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/info\.[a-zA-Z]/)
  })
})
