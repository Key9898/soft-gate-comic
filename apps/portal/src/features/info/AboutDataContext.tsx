import { unwrapApiData } from '@softgate/contracts'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { isMockApi } from '../../lib/api/isMockApi'

export type AboutDataState =
  | { status: 'mock' }
  | { status: 'loading' }
  | { status: 'ok'; data: unknown; retry: () => void }
  | { status: 'error'; retry: () => void }

const AboutDataContext = createContext<AboutDataState | undefined>(undefined)

export function AboutProvider({ children }: { children: ReactNode }) {
  const mock = isMockApi()
  const [http, setHttp] = useState<'loading' | 'ok' | 'error'>(() => (mock ? 'ok' : 'loading'))
  const [data, setData] = useState<unknown>(null)

  const load = useCallback(() => {
    if (isMockApi()) return
    setHttp('loading')
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    fetch(`${baseUrl}/api/about`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch about')
        return res.json()
      })
      .then((payload: unknown) => {
        const unwrapped = unwrapApiData<unknown>(payload)
        if (unwrapped == null || typeof unwrapped !== 'object' || Array.isArray(unwrapped)) {
          throw new Error('Invalid about payload')
        }
        setData(unwrapped)
        setHttp('ok')
      })
      .catch(() => {
        setData(null)
        setHttp('error')
      })
  }, [])

  useEffect(() => {
    if (mock) return
    load()
  }, [mock, load])

  const value = useMemo<AboutDataState>(() => {
    if (mock) return { status: 'mock' }
    if (http === 'loading') return { status: 'loading' }
    if (http === 'error') return { status: 'error', retry: load }
    return { status: 'ok', data, retry: load }
  }, [mock, http, data, load])

  return <AboutDataContext.Provider value={value}>{children}</AboutDataContext.Provider>
}

export function useAboutData(): AboutDataState {
  const value = useContext(AboutDataContext)
  if (!value) throw new Error('useAboutData must be used within AboutProvider')
  return value
}
