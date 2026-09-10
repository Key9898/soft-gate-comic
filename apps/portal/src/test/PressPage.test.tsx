import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from './utils'
import PressPage from '../features/info/PressPage'

describe('PressPage', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('renders Press H1, Newsroom eyebrow, and Press breadcrumb', () => {
    render(<PressPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Press' })).toBeInTheDocument()
    expect(screen.getByText('Newsroom')).toBeInTheDocument()
    const crumb = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(crumb).toHaveTextContent('Press')
  })

  it('renders the masthead title, boilerplate, and copy control', () => {
    render(<PressPage />)
    expect(screen.getByRole('heading', { name: 'About SoftGate Comic' })).toBeInTheDocument()
    expect(
      screen.getByText(/webtoon reading portal of SoftGate, designed for readers in Myanmar/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('renders ZIP as the primary kit download and singles without fake assets', () => {
    render(<PressPage />)
    const zip = screen.getByRole('link', { name: /download media kit/i })
    expect(zip).toHaveAttribute('href', '/press-kit/softgate-comic-press-kit.zip')
    expect(zip).toHaveAttribute('download')

    const downloadLinks = screen.getAllByRole('link', { name: /download/i })
    const hrefs = downloadLinks.map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(
      expect.arrayContaining([
        '/press-kit/softgate-comic-press-kit.zip',
        '/logo/logo.svg',
        '/logo/logo.png',
        '/favicon/icon-512.png',
      ])
    )
    expect(hrefs.join(' ')).not.toMatch(/\.jpg/i)
    expect(hrefs.join(' ')).not.toMatch(/\/favicon\/favicon\.svg/i)
    downloadLinks.forEach((link) => {
      expect(link).toHaveAttribute('download')
    })
  })

  it('renders the fact sheet with honest values and a website link', () => {
    render(<PressPage />)
    expect(screen.getByRole('heading', { name: /fact sheet/i })).toBeInTheDocument()
    expect(screen.getByText('SoftGate')).toBeInTheDocument()
    expect(screen.getByText('Insein, Yangon')).toBeInTheDocument()
    expect(screen.getByText('Demo portal — in development')).toBeInTheDocument()
    expect(screen.getByText('Myanmar')).toBeInTheDocument()
    const site = screen.getByRole('link', { name: 'https://softgatecomic.com' })
    expect(site).toHaveAttribute('href', 'https://softgatecomic.com')
  })

  it('renders a Demo news slot without fabricated coverage', () => {
    render(<PressPage />)
    expect(screen.getByRole('heading', { name: 'News' })).toBeInTheDocument()
    expect(screen.getByText(/no public press release yet/i)).toBeInTheDocument()
    expect(screen.getByText(/has not published public press releases/i)).toBeInTheDocument()
  })

  it('renders Demo stills for Home, hub, and Reader', () => {
    render(<PressPage />)
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Series hub' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reader' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Home' })).toHaveAttribute(
      'src',
      '/press-kit/still-home.png'
    )
    expect(screen.getByRole('img', { name: 'Series hub' })).toHaveAttribute(
      'src',
      '/press-kit/still-hub.png'
    )
    expect(screen.getByRole('img', { name: 'Reader' })).toHaveAttribute(
      'src',
      '/press-kit/still-reader.png'
    )
  })

  it('renders the founder media-desk card', () => {
    render(<PressPage />)
    expect(screen.getByRole('heading', { name: 'Nandar Aye' })).toBeInTheDocument()
    expect(screen.getByText('Founder')).toBeInTheDocument()
    expect(screen.getByText('Media desk (Demo)')).toBeInTheDocument()
  })

  it('renders jump TOC labeled On this page', () => {
    render(<PressPage />)
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument()
  })

  it('renders the media contact mailto CTA, no-SLA hours, and last updated date', () => {
    render(<PressPage />)
    const cta = screen.getByRole('link', { name: /press@softgatecomic\.com/i })
    expect(cta).toHaveAttribute('href', 'mailto:press@softgatecomic.com')
    expect(screen.getByText(/we do not publish a reply sla/i)).toBeInTheDocument()
    expect(screen.getByText(/last updated 10 september 2026/i)).toBeInTheDocument()
  })

  it('does not put overflow-hidden on the page root', () => {
    const { container } = render(<PressPage />)
    expect(container.firstElementChild).not.toHaveClass('overflow-hidden')
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<PressPage />)
    expect(container.textContent).not.toMatch(/press\.[a-zA-Z]/)
  })

  it('fails open to i18n copy when live press fetch fails', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('down')
      })
    )
    render(<PressPage />)
    expect(await screen.findByRole('heading', { name: 'About SoftGate Comic' })).toBeInTheDocument()
    expect(
      screen.getByText(/webtoon reading portal of SoftGate, designed for readers in Myanmar/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nandar Aye' })).toBeInTheDocument()
  })

  it('uses live press payload when fetch succeeds', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              data: {
                copy: {
                  boilerplateTitle: { en: 'Live SoftGate', mm: 'Live SoftGate' },
                  boilerplate: {
                    en: 'Live boilerplate from Admin.',
                    mm: 'Live boilerplate from Admin.',
                  },
                  newsSlotTitle: {
                    en: 'No public press release yet',
                    mm: 'အများသုံး press release မရှိသေး',
                  },
                  newsSlotCopy: { en: 'Empty news from Admin.', mm: 'Empty news from Admin.' },
                  factSheet: { en: 'Fact Sheet', mm: 'အချက်အလက်များ' },
                  newsTitle: { en: 'News', mm: 'သတင်းများ' },
                  newsIntro: { en: 'Intro', mm: 'Intro' },
                  mediaKit: { en: 'Brand Assets', mm: 'မီဒီယာကိရိယာ' },
                  mediaKitDesc: { en: 'Kit', mm: 'Kit' },
                  downloadZip: { en: 'Download media kit', mm: 'ဒေါင်းလုဒ်' },
                  zipHint: { en: 'Hint', mm: 'Hint' },
                  download: { en: 'Download', mm: 'ဒေါင်းလုဒ်' },
                  paletteTitle: { en: 'Brand colors', mm: 'အရောင်' },
                  usageTitle: { en: 'Logo use', mm: 'Logo' },
                  usageDoTitle: { en: 'Do', mm: 'လုပ်ပါ' },
                  usageDontTitle: { en: "Don't", mm: 'မလုပ်ပါနှင့်' },
                  usageDo1: { en: 'Do one', mm: 'Do one' },
                  usageDo2: { en: 'Do two', mm: 'Do two' },
                  usageDo3: { en: 'Do three', mm: 'Do three' },
                  usageDont1: { en: 'Dont one', mm: 'Dont one' },
                  usageDont2: { en: 'Dont two', mm: 'Dont two' },
                  usageDont3: { en: 'Dont three', mm: 'Dont three' },
                  trademark: { en: 'Trademark', mm: 'Trademark' },
                  screenshotsTitle: { en: 'Product images', mm: 'ပုံများ' },
                  stillsNote: { en: 'No stills from Admin.', mm: 'No stills from Admin.' },
                  spokespersonTitle: { en: 'Spokesperson', mm: 'ပြောရေးဆိုခွင့်ရှိသူ' },
                  deskBadge: { en: 'Media desk (Demo)', mm: 'မီဒီယာစားပွဲ (Demo)' },
                  deskNote: { en: 'Desk note', mm: 'Desk note' },
                  interviewCta: { en: 'Request an interview', mm: 'အင်တာဗျူး' },
                  contact: { en: 'Media Contact', mm: 'မီဒီယာ' },
                  contactDesc: { en: 'Email us', mm: 'Email us' },
                  contactHours: { en: 'We do not publish a reply SLA.', mm: 'SLA' },
                  otherInquiries: { en: 'Other', mm: 'Other' },
                  updated: { en: 'Last updated 10 September 2026', mm: 'နောက်ဆုံး' },
                },
                zipUrl: '/press-kit/softgate-comic-press-kit.zip',
                contactEmail: 'desk@softgatecomic.com',
                facts: [
                  {
                    key: 'legalName',
                    label: { en: 'Legal name', mm: 'တရားဝင်အမည်' },
                    value: { en: 'SoftGate', mm: 'SoftGate' },
                  },
                  {
                    key: 'hq',
                    label: { en: 'Headquarters', mm: 'ရုံးချုပ်' },
                    value: { en: 'Insein, Yangon', mm: 'အင်းစိန်' },
                  },
                  {
                    key: 'stage',
                    label: { en: 'Stage', mm: 'အဆင့်' },
                    value: { en: 'Demo portal — in development', mm: 'Demo' },
                  },
                  {
                    key: 'market',
                    label: { en: 'Focus market', mm: 'ဈေးကွက်' },
                    value: { en: 'Myanmar', mm: 'မြန်မာ' },
                  },
                  {
                    key: 'website',
                    label: { en: 'Website', mm: 'ဝဘ်ဆိုက်' },
                    value: { en: 'https://softgatecomic.com', mm: 'https://softgatecomic.com' },
                    href: 'https://softgatecomic.com',
                  },
                ],
                palette: [{ hex: '#0e9494', label: { en: 'CTA / theme', mm: 'CTA' } }],
                assets: [
                  {
                    name: { en: 'Primary logo (vector)', mm: 'logo' },
                    url: '/logo/logo.svg',
                    format: 'SVG',
                  },
                  {
                    name: { en: 'Primary logo', mm: 'logo' },
                    url: '/logo/logo.png',
                    format: 'PNG',
                  },
                  {
                    name: { en: 'Icon (square)', mm: 'icon' },
                    url: '/favicon/icon-512.png',
                    format: 'PNG',
                  },
                ],
                news: [],
                stills: [],
              },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
      )
    )
    render(<PressPage />)
    expect(await screen.findByRole('heading', { name: 'Live SoftGate' })).toBeInTheDocument()
    expect(screen.getByText('Live boilerplate from Admin.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /desk@softgatecomic\.com/i })).toHaveAttribute(
      'href',
      'mailto:desk@softgatecomic.com'
    )
    expect(screen.queryByRole('heading', { name: 'Home' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Nandar Aye' })).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('No stills from Admin.')).toBeInTheDocument()
    })
  })
})
