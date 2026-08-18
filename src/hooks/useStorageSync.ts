import { useEffect } from 'react'

/**
 * Re-runs `onChange` when another tab writes one of the given localStorage keys.
 * The browser only fires `storage` in *other* tabs, so same-tab state updates
 * never double-trigger. `e.key === null` means `localStorage.clear()`.
 * Pass a module-scope `keys` array and a `useCallback` handler to keep the
 * listener stable across renders.
 */
export function useStorageSync(keys: readonly string[], onChange: () => void) {
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === null || keys.includes(e.key)) onChange()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [keys, onChange])
}
