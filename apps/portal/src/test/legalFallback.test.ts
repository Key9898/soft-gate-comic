import { describe, expect, it } from 'vitest'
import i18n from '../lib/i18n'
import { fallbackCookies, fallbackLegalPage } from '../lib/info/legalFallback'
import { parseCookies } from '../lib/cookies'
import { parseLegalPage } from '../lib/legal'

const t = (key: string) => i18n.t(key)

// i18next echoes the key back when it is missing, so a key that survives as its
// own value is a typo in the fallback spec.
const looksLikeKey = (value: string) => /^(static|legal)\.[A-Za-z]/.test(value)

describe('fallbackLegalPage', () => {
  for (const doc of ['privacy', 'terms'] as const) {
    it(`produces a ${doc} page the live parser accepts`, () => {
      const page = fallbackLegalPage(doc, t)
      // The fallback and the API payload must satisfy the same contract, or the
      // single render tree would only be correct for one of them.
      expect(parseLegalPage(page)).toEqual(page)
    })

    it(`resolves every ${doc} translation key`, () => {
      const page = fallbackLegalPage(doc, t)
      const strings = [
        page.seoDesc.en,
        ...page.glance.map((item) => item.en),
        ...page.sections.flatMap((section) => [
          section.title.en,
          section.body.en,
          ...section.bullets.map((item) => item.en),
        ]),
      ]
      expect(strings.filter(looksLikeKey)).toEqual([])
    })

    it(`gives every ${doc} section a unique slug`, () => {
      const slugs = fallbackLegalPage(doc, t).sections.map((section) => section.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
    })
  }

  it('marks the privacy rights section so the rights links render', () => {
    const rights = fallbackLegalPage('privacy', t).sections.find(
      (section) => section.slug === 'rights'
    )
    expect(rights?.kind).toBe('privacy-rights')
    // LegalCmsSections reads bullets positionally and needs all five slots.
    expect(rights?.bullets).toHaveLength(5)
  })

  it('keeps the terms coins section as a bullet list', () => {
    const coins = fallbackLegalPage('terms', t).sections.find((section) => section.slug === 'coins')
    expect(coins?.kind).toBe('bullets')
    expect(coins?.bullets.length).toBeGreaterThan(0)
  })
})

describe('fallbackCookies', () => {
  it('produces a payload the live parser accepts', () => {
    const page = fallbackCookies(t)
    expect(parseCookies(page)).toEqual(page)
  })

  it('resolves every translation key', () => {
    const page = fallbackCookies(t)
    const strings = [
      ...Object.values(page.copy).map((item) => item.en),
      ...page.glance.map((item) => item.en),
      ...page.rows.flatMap((row) => [row.label.en, row.description.en]),
    ]
    expect(strings.filter(looksLikeKey)).toEqual([])
  })

  it('gives every storage row a unique id', () => {
    const ids = fallbackCookies(t).rows.map((row) => row.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  // The reader writes softgate_episode_reactions_v1 (see lib/reader/reactions.ts)
  // whenever a reader taps an end-of-episode emoji reaction. The Cookies page's
  // "What We Store In Your Browser" table is a hardcoded list, so shipping a new
  // storage key without a matching row here would silently under-disclose it.
  it('lists a storage row for the episode reaction picks', () => {
    const rows = fallbackCookies(t).rows
    expect(rows.some((row) => row.storageKey === 'reactions')).toBe(true)
  })
})
