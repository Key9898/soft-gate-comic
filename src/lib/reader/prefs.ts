export const READER_PREFS_KEY = 'softgate_reader_prefs_v1'

export type ReaderFontSize = 'sm' | 'md' | 'lg'
export type ReaderImageFit = 'fit' | 'full'

export type ReaderPrefs = {
  schemaVersion: 1
  darkMode: boolean
  brightness: number
  fontSize: ReaderFontSize
  imageFit: ReaderImageFit
}

export const DEFAULT_READER_PREFS: ReaderPrefs = {
  schemaVersion: 1,
  darkMode: true,
  brightness: 0.9,
  fontSize: 'md',
  imageFit: 'fit',
}

function isFontSize(value: unknown): value is ReaderFontSize {
  return value === 'sm' || value === 'md' || value === 'lg'
}

function isImageFit(value: unknown): value is ReaderImageFit {
  return value === 'fit' || value === 'full'
}

export function loadReaderPrefs(): ReaderPrefs {
  try {
    const raw = localStorage.getItem(READER_PREFS_KEY)
    if (!raw) return { ...DEFAULT_READER_PREFS }
    const parsed = JSON.parse(raw) as Partial<ReaderPrefs>
    const brightness =
      typeof parsed.brightness === 'number' && parsed.brightness >= 0.25 && parsed.brightness <= 1
        ? parsed.brightness
        : DEFAULT_READER_PREFS.brightness
    return {
      schemaVersion: 1,
      darkMode:
        typeof parsed.darkMode === 'boolean' ? parsed.darkMode : DEFAULT_READER_PREFS.darkMode,
      brightness,
      fontSize: isFontSize(parsed.fontSize) ? parsed.fontSize : DEFAULT_READER_PREFS.fontSize,
      imageFit: isImageFit(parsed.imageFit) ? parsed.imageFit : DEFAULT_READER_PREFS.imageFit,
    }
  } catch {
    return { ...DEFAULT_READER_PREFS }
  }
}

export function saveReaderPrefs(prefs: ReaderPrefs): void {
  localStorage.setItem(
    READER_PREFS_KEY,
    JSON.stringify({
      schemaVersion: 1,
      darkMode: prefs.darkMode,
      brightness: prefs.brightness,
      fontSize: prefs.fontSize,
      imageFit: prefs.imageFit,
    } satisfies ReaderPrefs)
  )
}
