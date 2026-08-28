import { useState } from 'react'

export type LegalFontSize = 'sm' | 'base' | 'lg' | 'xl'
export type LegalReadingTheme = 'default' | 'sepia'

export const LEGAL_FONT_SIZES: LegalFontSize[] = ['sm', 'base', 'lg', 'xl']

export const LEGAL_SIZE_CLASSES: Record<LegalFontSize, string> = {
  sm: 'text-xs sm:text-sm leading-relaxed',
  base: 'text-sm sm:text-base leading-relaxed',
  lg: 'text-base sm:text-lg leading-relaxed',
  xl: 'text-lg sm:text-xl leading-relaxed',
}

export const LEGAL_THEME_CLASSES: Record<LegalReadingTheme, string> = {
  default: 'bg-white border-gray-100 text-gray-800',
  sepia: 'bg-sepia-50 text-sepia-900 border-sepia-200',
}

const STORAGE_KEY = 'softgate.legalReadability'

interface StoredReadability {
  fontSize: LegalFontSize
  readingTheme: LegalReadingTheme
}

const readStored = (): Partial<StoredReadability> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Partial<StoredReadability>
  } catch {
    return {}
  }
}

const isFontSize = (value: unknown): value is LegalFontSize =>
  typeof value === 'string' && (LEGAL_FONT_SIZES as string[]).includes(value)

const isReadingTheme = (value: unknown): value is LegalReadingTheme =>
  value === 'default' || value === 'sepia'

export const useLegalReadability = () => {
  const [fontSize, setFontSizeState] = useState<LegalFontSize>(() => {
    const stored = readStored().fontSize
    return isFontSize(stored) ? stored : 'base'
  })
  const [readingTheme, setReadingThemeState] = useState<LegalReadingTheme>(() => {
    const stored = readStored().readingTheme
    return isReadingTheme(stored) ? stored : 'default'
  })

  const persist = (next: StoredReadability) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable */
    }
  }

  const setFontSize = (size: LegalFontSize) => {
    setFontSizeState(size)
    persist({ fontSize: size, readingTheme })
  }

  const setReadingTheme = (theme: LegalReadingTheme) => {
    setReadingThemeState(theme)
    persist({ fontSize, readingTheme: theme })
  }

  return { fontSize, setFontSize, readingTheme, setReadingTheme }
}
