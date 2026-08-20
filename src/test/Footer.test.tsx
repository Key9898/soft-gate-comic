import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import Footer from '../components/Footer/Footer'

describe('Footer Support', () => {
  it('lists Help Center, FAQ, and Contact', () => {
    render(<Footer />)
    const supportHeading = screen.getByRole('heading', { name: 'Support' })
    const supportList = supportHeading.nextElementSibling
    expect(supportList).not.toBeNull()
    const hrefs = Array.from(supportList!.querySelectorAll('a')).map((link) =>
      link.getAttribute('href')
    )
    expect(hrefs).toEqual(['/help', '/faq', '/contact'])
  })
})
