import { afterEach, describe, it, expect, vi } from 'vitest'
import { render, screen } from './utils'
import PrivacyPage from '../features/info/PrivacyPage'
import TermsPage from '../features/info/TermsPage'
import CookiesPage from '../features/info/CookiesPage'

const expectSharedLegalChrome = (
  container: HTMLElement,
  current: 'Privacy Policy' | 'Terms of Service' | 'Cookie Policy'
) => {
  expect(screen.getByRole('heading', { name: /at a glance/i })).toBeInTheDocument()
  expect(container.querySelector('.radial-wash-primary')).toBeTruthy()
  expect(container.textContent).toMatch(/Last updated September 10, 2026/i)
  expect(screen.getAllByRole('link', { name: 'support@softgatecomic.com' }).length).toBeGreaterThan(
    0
  )
  expect(screen.getAllByRole('link', { name: 'Contact page' }).length).toBeGreaterThan(0)
  expect(screen.queryByRole('link', { name: current })).not.toBeInTheDocument()
  const others = (['Privacy Policy', 'Terms of Service', 'Cookie Policy'] as const).filter(
    (label) => label !== current
  )
  for (const label of others) {
    const links = screen.getAllByRole('link', { name: label })
    expect(links.length).toBeGreaterThanOrEqual(2)
  }
  expect(container.textContent).not.toMatch(/cookie settings|GPC|Do Not Sell/i)
  const toc = screen.getByRole('navigation', { name: 'Table of Contents' })
  expect(toc.className).toMatch(/scrollbar-thin-primary/)
  expect(toc.className).not.toMatch(/scrollbar-hide/)
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('PrivacyPage', () => {
  it('renders the h1 and TOC anchor links', () => {
    render(<PrivacyPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
    const toc = screen.getByRole('navigation', { name: 'Table of Contents' })
    expect(toc.querySelector('a[href="#glance"]')).toBeInTheDocument()
    expect(toc.querySelector('a[href="#collect"]')).toBeInTheDocument()
    expect(toc.querySelector('a[href="#children"]')).toBeInTheDocument()
  })

  it('states the local-storage honesty note and no data sharing', () => {
    render(<PrivacyPage />)
    expect(screen.getAllByText(/does not send your data to any server/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/we do not share your data with anyone/i).length).toBeGreaterThan(0)
  })

  it('links rights to Profile Security and Contact', () => {
    const { container } = render(<PrivacyPage />)
    expectSharedLegalChrome(container, 'Privacy Policy')
    expect(screen.getByRole('link', { name: 'Profile → Security' })).toHaveAttribute(
      'href',
      '/profile?tab=security'
    )
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<PrivacyPage />)
    expect(container.textContent).not.toMatch(/static\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/legal\.[a-zA-Z]/)
  })
})

describe('TermsPage', () => {
  it('renders the h1 and TOC anchor links', () => {
    render(<TermsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument()
    const toc = screen.getByRole('navigation', { name: 'Table of Contents' })
    expect(toc.querySelector('a[href="#eligibility"]')).toBeInTheDocument()
    expect(toc.querySelector('a[href="#coins"]')).toBeInTheDocument()
    expect(toc.querySelector('a[href="#changes"]')).toBeInTheDocument()
  })

  it('renders the coins section with the demo honesty line', () => {
    render(<TermsPage />)
    expect(screen.getByRole('heading', { name: 'Coins & Virtual Items' })).toBeInTheDocument()
    expect(screen.getByText(/no real payment is taken/i)).toBeInTheDocument()
    expect(screen.getByText(/no real-world monetary value/i)).toBeInTheDocument()
  })

  it('renders eligibility, comments, and anti-piracy items', () => {
    render(<TermsPage />)
    expect(screen.getByRole('heading', { name: 'Eligibility & Age' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Your Comments' })).toBeInTheDocument()
    expect(screen.getByText(/scrape, bulk-download, or re-upload/i)).toBeInTheDocument()
  })

  it('covers changes, guests, Myanmar law, and shared chrome', () => {
    const { container } = render(<TermsPage />)
    expectSharedLegalChrome(container, 'Terms of Service')
    expect(screen.getByRole('heading', { name: 'Changes to These Terms' })).toBeInTheDocument()
    expect(screen.getAllByText(/guests may browse/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/governed by Myanmar law/i).length).toBeGreaterThan(0)
    expect(container.textContent).not.toMatch(/arbitration/i)
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<TermsPage />)
    expect(container.textContent).not.toMatch(/static\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/legal\.[a-zA-Z]/)
  })
})

describe('CookiesPage', () => {
  it('renders the h1 and TOC anchor links', () => {
    render(<CookiesPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Cookie Policy' })).toBeInTheDocument()
    const toc = screen.getByRole('navigation', { name: 'Table of Contents' })
    expect(toc.querySelector('a[href="#storage"]')).toBeInTheDocument()
    expect(toc.querySelector('a[href="#managing"]')).toBeInTheDocument()
  })

  it('states the no-tracking-cookies truth and storage table', () => {
    const { container } = render(<CookiesPage />)
    expect(screen.getByText(/does not set any tracking cookies/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'What We Store In Your Browser' })
    ).toBeInTheDocument()
    expect(screen.getByText('Coin wallet')).toBeInTheDocument()
    expect(screen.getByText('History, likes & ratings')).toBeInTheDocument()
    expect(screen.getByText('Demo accounts')).toBeInTheDocument()
    expect(screen.getByText('Demo catalog')).toBeInTheDocument()
    expect(screen.getByText('18+ age confirm')).toBeInTheDocument()
    expect(screen.getByText('Notification preferences')).toBeInTheDocument()
    expect(screen.getByText('Episode reports')).toBeInTheDocument()
    expect(screen.getByText('Author follows')).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/Reading progress/)
    expect(container.textContent).not.toMatch(/still in-app until that fan-out/i)
    expect(container.textContent).not.toMatch(/New-episode (rows|notices) are still in-app/i)
  })

  it('declares analytics and marketing as none', () => {
    render(<CookiesPage />)
    expect(screen.getByText(/does not use analytics cookies/i)).toBeInTheDocument()
    expect(screen.getByText(/no advertising or marketing cookies/i)).toBeInTheDocument()
  })

  it('uses shared legal chrome without a cookie preference center', () => {
    const { container } = render(<CookiesPage />)
    expectSharedLegalChrome(container, 'Cookie Policy')
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<CookiesPage />)
    expect(container.textContent).not.toMatch(/static\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/legal\.[a-zA-Z]/)
  })
})

const bi = (en: string, mm = en) => ({ en, mm })

const LIVE_COOKIE_COPY = {
  cookiesTitle: bi('Cookie Policy'),
  cookiesSeoDesc: bi('Live cookies SEO'),
  whatAreCookies: bi('What Are Cookies'),
  whatAreCookiesDesc: bi('Live what are cookies body.'),
  howWeUseCookies: bi('Cookies & Local Storage We Use'),
  howWeUseCookiesDesc: bi('Live how we use cookies.'),
  essentialCookies: bi('Essential Storage'),
  essentialCookiesDesc: bi('Live essential.'),
  functionalCookies: bi('Functional Storage'),
  functionalCookiesDesc: bi('Live functional.'),
  analyticsCookies: bi('Analytics'),
  analyticsCookiesDesc: bi('Live analytics none.'),
  marketingCookies: bi('Marketing & Advertising'),
  marketingCookiesDesc: bi('Live marketing none.'),
  storageDetails: bi('What We Store In Your Browser'),
  storageDetailsDesc: bi('Live storage details.'),
  managingCookies: bi('Managing Your Data'),
  managingCookiesDesc: bi('Live managing.'),
  thirdPartyCookies: bi('Third-Party Cookies'),
  thirdPartyCookiesDesc: bi('Live third party.'),
  updatesPolicy: bi('Policy Updates'),
  updatesPolicyDesc: bi('Live updates.'),
}

describe('Cookies live consume', () => {
  it('fails open to i18n copy when live cookies fetch fails', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        if (!String(input).includes('/api/cookies')) {
          return new Response(JSON.stringify({ error: { code: 'NOT_FOUND' } }), { status: 404 })
        }
        throw new Error('down')
      })
    )
    render(<CookiesPage />)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Cookie Policy' })
    ).toBeInTheDocument()
    expect(screen.getByText(/does not set any tracking cookies/i)).toBeInTheDocument()
    expect(screen.getByText('Coin wallet')).toBeInTheDocument()
  })

  it('uses live cookies payload when fetch succeeds', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        if (!String(input).includes('/api/cookies')) {
          return new Response(JSON.stringify({ error: { code: 'NOT_FOUND' } }), { status: 404 })
        }
        return new Response(
          JSON.stringify({
            data: {
              effectiveDate: '2026-10-01',
              copy: LIVE_COOKIE_COPY,
              glance: [bi('Live cookies glance does not set any tracking cookies.')],
              rows: [
                {
                  id: 'wallet',
                  storageKey: 'softgate_wallet_v1',
                  label: bi('Live coin wallet'),
                  description: bi('Live wallet row.'),
                  sortOrder: 1,
                },
              ],
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      })
    )
    render(<CookiesPage />)
    expect(
      await screen.findByText('Live cookies glance does not set any tracking cookies.')
    ).toBeInTheDocument()
    expect(screen.getByText(/Last updated October 1, 2026/i)).toBeInTheDocument()
    expect(screen.getByText('Live what are cookies body.')).toBeInTheDocument()
    expect(screen.getByText('Live coin wallet')).toBeInTheDocument()
    expect(screen.queryByText('Demo catalog')).not.toBeInTheDocument()
  })
})

describe('Privacy and Terms live consume', () => {
  it('fails open to i18n copy when live privacy fetch fails', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('down')
      })
    )
    render(<PrivacyPage />)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Privacy Policy' })
    ).toBeInTheDocument()
    expect(screen.getAllByText(/does not send your data to any server/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'Profile → Security' })).toHaveAttribute(
      'href',
      '/profile?tab=security'
    )
  })

  it('uses live privacy payload when fetch succeeds', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              data: {
                seoDesc: { en: 'Live privacy SEO', mm: 'Live privacy SEO' },
                glance: [
                  { en: 'Live glance does not send your data to any server.', mm: 'Live glance' },
                ],
                effectiveDate: '2026-10-01',
                sections: [
                  {
                    id: '1',
                    slug: 'rights',
                    kind: 'privacy-rights',
                    headingLevel: 'h2',
                    title: { en: 'Your Rights', mm: 'သင့်အခွင့်အရေးများ' },
                    body: { en: 'Live rights body.', mm: 'Live rights body.' },
                    bullets: [
                      { en: 'Profile → Security', mm: 'Profile → လုံခြုံရေး' },
                      { en: 'Signed-in readers can delete.', mm: 'ဖျက်နိုင်ပါသည်။' },
                      { en: 'Anyone can clear site data.', mm: 'ရှင်းလင်းနိုင်ပါသည်။' },
                      { en: 'Guests have no account.', mm: 'ဧည့်သည်။' },
                      { en: 'Contact page', mm: 'ဆက်သွယ်ရန် စာမျက်နှာ' },
                    ],
                    sortOrder: 0,
                  },
                ],
              },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
      )
    )
    render(<PrivacyPage />)
    expect(
      await screen.findByText('Live glance does not send your data to any server.')
    ).toBeInTheDocument()
    expect(screen.getByText(/Last updated October 1, 2026/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Profile → Security' })).toHaveAttribute(
      'href',
      '/profile?tab=security'
    )
    expect(screen.getAllByRole('link', { name: 'Contact page' }).length).toBeGreaterThan(0)
  })

  it('uses live terms coins copy when fetch succeeds', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              data: {
                seoDesc: { en: 'Live terms SEO', mm: 'Live terms SEO' },
                glance: [{ en: 'Live terms glance.', mm: 'Live terms glance.' }],
                effectiveDate: '2026-09-10',
                sections: [
                  {
                    id: 'coins-1',
                    slug: 'coins',
                    kind: 'bullets',
                    headingLevel: 'h2',
                    title: { en: 'Coins & Virtual Items', mm: 'Coin များ' },
                    body: { en: 'Live coins intro.', mm: 'Live coins intro.' },
                    bullets: [
                      {
                        en: 'Live coins have no real-world monetary value.',
                        mm: 'Live coins have no real-world monetary value.',
                      },
                    ],
                    sortOrder: 0,
                  },
                ],
              },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
      )
    )
    render(<TermsPage />)
    expect(await screen.findByText('Live coins intro.')).toBeInTheDocument()
    expect(screen.getByText(/Live coins have no real-world monetary value/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Coins & Virtual Items' })).toBeInTheDocument()
  })
})
