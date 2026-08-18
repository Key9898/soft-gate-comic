import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import SearchAutocomplete from '../components/SearchAutocomplete/SearchAutocomplete'
import { DataProvider } from '../context/DataContext'

describe('SearchAutocomplete', () => {
  it('submits a query via the search form', async () => {
    const user = userEvent.setup()
    const store = new Map<string, string>()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key),
        clear: () => store.clear(),
        length: 0,
        key: () => null,
      },
    })

    render(
      <HelmetProvider>
        <DataProvider>
          <MemoryRouter>
            <SearchAutocomplete />
          </MemoryRouter>
        </DataProvider>
      </HelmetProvider>
    )

    const input = await screen.findByLabelText(/search webtoons/i)
    await user.type(input, 'Cloud')
    await user.keyboard('{Enter}')

    expect(store.get('softgate_recent_searches')).toContain('Cloud')
  })
})
