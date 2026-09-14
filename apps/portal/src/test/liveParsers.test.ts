import { describe, expect, it } from 'vitest'
import { parseCookies } from '../lib/cookies'
import { parseFaq } from '../lib/faq'
import { parseLegalPage } from '../lib/legal'
import { parsePress } from '../lib/press'

const bi = (text: string) => ({ en: text, mm: text })

const pressPayload = () => ({
  copy: { boilerplate: bi('Live boilerplate.') },
  zipUrl: '/press-kit/softgate-comic-press-kit.zip',
  contactEmail: 'desk@softgatecomic.com',
  facts: [{ key: 'legalName', label: bi('Legal name'), value: bi('SoftGate') }],
  palette: [{ hex: '#0e9494', label: bi('CTA') }],
  assets: [{ name: bi('Primary logo'), url: '/logo/logo.svg', format: 'SVG' }],
  news: [{ id: 'n1', title: bi('News'), body: bi('Body') }],
  stills: [{ id: 's1', title: bi('Home'), imageUrl: '/press-kit/still-home.png' }],
})

const legalPayload = () => ({
  seoDesc: bi('Live privacy SEO'),
  glance: [bi('Live glance.')],
  effectiveDate: '2026-10-01',
  sections: [
    {
      id: '1',
      slug: 'rights',
      kind: 'privacy-rights',
      headingLevel: 'h2',
      title: bi('Your Rights'),
      body: bi('Live rights body.'),
      bullets: [bi('Profile → Security')],
      sortOrder: 0,
    },
  ],
})

const cookiesPayload = () => ({
  effectiveDate: '2026-10-01',
  copy: { whatAreCookies: bi('What are cookies') },
  glance: [bi('Live cookies glance.')],
  rows: [
    {
      id: 'wallet',
      storageKey: 'softgate_wallet_v1',
      label: bi('Coin wallet'),
      description: bi('Live wallet row.'),
      sortOrder: 1,
    },
  ],
})

const faqPayload = () => ({
  items: [
    {
      id: 'live-1',
      category: 'general',
      question: bi('Live FAQ question?'),
      answer: bi('Live FAQ answer.'),
      relatedTo: '/coins',
      relatedLabel: bi('Coins'),
      sortOrder: 1,
    },
  ],
})

// A malformed-but-200 body reaches every parser the same way: the API envelope
// unwraps to something that is not the documented payload shape.
const MALFORMED: unknown[] = [null, undefined, {}, [], 'text', 42, { data: {} }]

describe('parsePress', () => {
  it('accepts a well-formed payload', () => {
    const press = parsePress(pressPayload())
    expect(press?.facts[0]?.value.en).toBe('SoftGate')
    expect(press?.assets).toHaveLength(1)
    expect(press?.news).toHaveLength(1)
    expect(press?.stills).toHaveLength(1)
  })

  it('accepts empty news and stills arrays', () => {
    const press = parsePress({ ...pressPayload(), news: [], stills: [] })
    expect(press).not.toBeNull()
    expect(press?.news).toEqual([])
    expect(press?.stills).toEqual([])
  })

  it('returns null for malformed payloads', () => {
    for (const payload of MALFORMED) expect(parsePress(payload)).toBeNull()
  })

  it('returns null when a required collection is not an array', () => {
    expect(parsePress({ ...pressPayload(), facts: 'nope' })).toBeNull()
    expect(parsePress({ ...pressPayload(), stills: null })).toBeNull()
  })

  it('drops malformed rows instead of failing the whole payload', () => {
    const press = parsePress({
      ...pressPayload(),
      facts: [{ key: 'ok', label: bi('Legal name'), value: bi('SoftGate') }, { key: 'broken' }],
      assets: [{ name: bi('Logo'), url: '/logo/logo.svg', format: 'SVG' }, { url: 42 }],
    })
    expect(press?.facts).toHaveLength(1)
    expect(press?.assets).toHaveLength(1)
  })

  it('drops a link whose URL scheme is not safe to render', () => {
    const press = parsePress({
      ...pressPayload(),
      facts: [
        {
          key: 'website',
          label: bi('Website'),
          value: bi('softgatecomic.com'),
          href: 'javascript:alert(1)',
        },
      ],
      assets: [{ name: bi('Logo'), url: 'javascript:alert(1)', format: 'SVG' }],
    })
    expect(press?.facts[0]?.href).toBeUndefined()
    expect(press?.assets).toHaveLength(0)
  })

  it('keeps a spokesperson only when it is well-formed', () => {
    const withPerson = parsePress({
      ...pressPayload(),
      spokesperson: { name: bi('Nandar Aye'), role: bi('Founder') },
    })
    expect(withPerson?.spokesperson?.name.en).toBe('Nandar Aye')

    const withBadPerson = parsePress({ ...pressPayload(), spokesperson: { name: 'Nandar Aye' } })
    expect(withBadPerson).not.toBeNull()
    expect(withBadPerson?.spokesperson).toBeUndefined()
  })
})

describe('parseLegalPage', () => {
  it('accepts a well-formed payload', () => {
    const page = parseLegalPage(legalPayload())
    expect(page?.effectiveDate).toBe('2026-10-01')
    expect(page?.sections[0]?.slug).toBe('rights')
    expect(page?.sections[0]?.bullets).toHaveLength(1)
  })

  it('returns null for malformed payloads', () => {
    for (const payload of MALFORMED) expect(parseLegalPage(payload)).toBeNull()
  })

  it('returns null when sections is not an array', () => {
    expect(parseLegalPage({ ...legalPayload(), sections: null })).toBeNull()
  })

  it('drops malformed sections instead of failing the whole page', () => {
    const page = parseLegalPage({
      ...legalPayload(),
      sections: [...legalPayload().sections, { id: 'broken' }],
    })
    expect(page?.sections).toHaveLength(1)
  })

  it('falls back to safe defaults for an unknown kind or heading level', () => {
    const page = parseLegalPage({
      ...legalPayload(),
      sections: [{ ...legalPayload().sections[0], kind: 'marquee', headingLevel: 'h7' }],
    })
    expect(page?.sections[0]?.kind).toBe('body')
    expect(page?.sections[0]?.headingLevel).toBe('h2')
  })
})

describe('parseCookies', () => {
  it('accepts a well-formed payload', () => {
    const cookies = parseCookies(cookiesPayload())
    expect(cookies?.effectiveDate).toBe('2026-10-01')
    expect(cookies?.rows[0]?.label.en).toBe('Coin wallet')
  })

  it('returns null for malformed payloads', () => {
    for (const payload of MALFORMED) expect(parseCookies(payload)).toBeNull()
  })

  it('returns null when copy is missing or not an object', () => {
    expect(parseCookies({ ...cookiesPayload(), copy: undefined })).toBeNull()
    expect(parseCookies({ ...cookiesPayload(), copy: [] })).toBeNull()
  })

  it('drops malformed rows instead of failing the whole payload', () => {
    const cookies = parseCookies({
      ...cookiesPayload(),
      rows: [...cookiesPayload().rows, { id: 'broken' }],
    })
    expect(cookies?.rows).toHaveLength(1)
  })
})

describe('parseFaq', () => {
  it('accepts a well-formed payload', () => {
    const faq = parseFaq(faqPayload())
    expect(faq?.items[0]?.question.en).toBe('Live FAQ question?')
    expect(faq?.items[0]?.relatedLabel?.en).toBe('Coins')
  })

  it('accepts an empty item list as a real published-nothing state', () => {
    expect(parseFaq({ items: [] })).toEqual({ items: [] })
  })

  it('returns null for malformed payloads', () => {
    for (const payload of MALFORMED.filter((value) => !Array.isArray(value))) {
      if (payload && typeof payload === 'object' && 'items' in payload) continue
      expect(parseFaq(payload)).toBeNull()
    }
    expect(parseFaq({ items: 'nope' })).toBeNull()
  })

  it('drops malformed items instead of failing the whole payload', () => {
    const faq = parseFaq({ items: [...faqPayload().items, { id: 'broken' }] })
    expect(faq?.items).toHaveLength(1)
  })
})
