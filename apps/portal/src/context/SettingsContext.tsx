import { unwrapApiData } from '@softgate/contracts'
import { contactEmailOrFallback, parsePortalSettings, type PortalSettings } from '@softgate/shared'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type PortalSettingsView = {
  maintenanceMode: boolean
  allowRegistration: boolean
  contactEmail: string
  contactEmailFromSettings: boolean
  isLoading: boolean
  error: Error | null
  retry: () => void
}

const isMockApi = () => import.meta.env.VITE_USE_MOCK_API !== 'false'

const failOpenView = (error: Error | null, isLoading: boolean): PortalSettingsView => {
  const email = contactEmailOrFallback('')
  return {
    maintenanceMode: false,
    allowRegistration: true,
    contactEmail: email.email,
    contactEmailFromSettings: email.fromSettings,
    isLoading,
    error,
    retry: () => undefined,
  }
}

const viewFromParsed = (
  parsed: PortalSettings,
  isLoading: boolean
): Omit<PortalSettingsView, 'retry'> => {
  const email = contactEmailOrFallback(parsed.contactEmail)
  return {
    maintenanceMode: parsed.maintenanceMode,
    allowRegistration: parsed.allowRegistration,
    contactEmail: email.email,
    contactEmailFromSettings: email.fromSettings,
    isLoading,
    error: null,
  }
}

const SettingsContext = createContext<PortalSettingsView | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Omit<PortalSettingsView, 'retry'>>(() =>
    isMockApi() ? viewFromParsed(parsePortalSettings({}), false) : failOpenView(null, true)
  )

  const loadSettings = useCallback(() => {
    if (isMockApi()) {
      setState(viewFromParsed(parsePortalSettings({}), false))
      return
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    fetch(`${baseUrl}/api/settings`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch settings')
        return res.json()
      })
      .then((payload: unknown) => {
        const data = unwrapApiData<unknown>(payload)
        setState(viewFromParsed(parsePortalSettings(data), false))
      })
      .catch((err) => {
        setState({
          ...failOpenView(
            err instanceof Error ? err : new Error('Failed to fetch settings'),
            false
          ),
        })
      })
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const value: PortalSettingsView = {
    ...state,
    retry: loadSettings,
  }

  return React.createElement(SettingsContext.Provider, { value }, children)
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
