import { createContext, useContext } from 'react'

export interface SsrResponseState {
  status: number
}

export const SsrResponseContext = createContext<SsrResponseState | null>(null)

export const useSsrResponse = () => useContext(SsrResponseContext)
