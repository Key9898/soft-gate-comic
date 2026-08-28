import { createContext, useContext } from 'react'
import type { PortalLocale } from './locale'

const LocaleContext = createContext<PortalLocale>('en')

export const LocaleProvider = LocaleContext.Provider

export const useLocale = (): PortalLocale => useContext(LocaleContext)
