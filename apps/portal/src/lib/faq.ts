import { unwrapApiData } from '@softgate/contracts'
import { useEffect, useState } from 'react'
import { isMockApi } from './api/isMockApi'
import {
  FAQ_ITEMS,
  isFaqCategoryId,
  type FaqCatalogItem,
  type FaqCategoryId,
} from './info/faqCatalog'

export type BilingualText = { en: string; mm: string }

export type PortalFaqItem = {
  id: string
  category: string
  question: BilingualText
  answer: BilingualText
  relatedTo?: string
  relatedLabel?: BilingualText
  sortOrder: number
}

export type PortalFaq = {
  items: PortalFaqItem[]
}

export type FaqViewItem = {
  id: string
  category: FaqCategoryId
  question: string
  answer: string
  related?: { to: string; label: string }[]
}

export function pickFaqText(text: BilingualText, language: string): string {
  return language.startsWith('mm') ? text.mm : text.en
}

export function catalogFaqToView(
  item: FaqCatalogItem,
  translate: (key: string) => string
): FaqViewItem {
  return {
    id: item.id,
    category: item.category,
    question: translate(item.qKey),
    answer: translate(item.aKey),
    related: item.related?.map((related) => ({
      to: related.to,
      label: translate(related.labelKey),
    })),
  }
}

export function liveFaqToView(item: PortalFaqItem, language: string): FaqViewItem | null {
  if (!isFaqCategoryId(item.category)) return null
  const related =
    item.relatedTo && item.relatedLabel
      ? [{ to: item.relatedTo, label: pickFaqText(item.relatedLabel, language) }]
      : item.relatedTo
        ? [{ to: item.relatedTo, label: item.relatedTo }]
        : undefined
  return {
    id: item.id,
    category: item.category,
    question: pickFaqText(item.question, language),
    answer: pickFaqText(item.answer, language),
    related,
  }
}

export function catalogFaqViews(translate: (key: string) => string): FaqViewItem[] {
  return FAQ_ITEMS.map((item) => catalogFaqToView(item, translate))
}

export function liveFaqViews(faq: PortalFaq, language: string): FaqViewItem[] {
  return faq.items
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
    .map((item) => liveFaqToView(item, language))
    .filter((item): item is FaqViewItem => item !== null)
}

export function useFaq(): PortalFaq | null {
  const mock = isMockApi()
  const [live, setLive] = useState<PortalFaq | null>(null)

  useEffect(() => {
    if (mock) return
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    let cancelled = false
    fetch(`${baseUrl}/api/faq`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch faq')
        return res.json()
      })
      .then((payload: unknown) => {
        const data = unwrapApiData<PortalFaq>(payload)
        if (!cancelled && data) setLive(data)
      })
      .catch(() => {
        if (!cancelled) setLive(null)
      })
    return () => {
      cancelled = true
    }
  }, [mock])

  return live
}
