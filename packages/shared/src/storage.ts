import type { SharedData } from './types'
import { applyCatalogSeed, exportToJSON, SHARED_DATA_SCHEMA_VERSION } from './data'

export const saveToLocalStorage = (data: SharedData) => {
  localStorage.setItem(
    'softgate-shared-data',
    JSON.stringify({ schemaVersion: SHARED_DATA_SCHEMA_VERSION, data })
  )
}

export const loadFromLocalStorage = (): SharedData | null => {
  const stored = localStorage.getItem('softgate-shared-data')
  if (!stored) return null
  try {
    const parsed = JSON.parse(stored) as {
      schemaVersion?: number
      data?: SharedData
    }
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.schemaVersion !== SHARED_DATA_SCHEMA_VERSION ||
      !parsed.data
    ) {
      return null
    }
    return applyCatalogSeed(parsed.data)
  } catch {
    return null
  }
}

export const downloadJSON = (data: SharedData, filename: string = 'softgate-data.json') => {
  const json = exportToJSON(data)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
