import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen } from './utils'
import CoinsPage from '../features/coins/CoinsPage'
import { coinPackages, packagesFromBlob } from '../features/coins/components/coinData'
import { SHARED_DATA_SCHEMA_VERSION, type SharedData } from '@softgate/shared'

const emptyCatalog = (coinPackages?: SharedData['coinPackages']): SharedData => ({
  dashboardStats: {
    totalUsers: 0,
    totalWebtoons: 0,
    totalEpisodes: 0,
    totalViews: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    activeUsersToday: 0,
    newEpisodesToday: 0,
  },
  revenueData: [],
  userGrowthData: [],
  popularWebtoons: [],
  authors: [],
  genres: [],
  webtoons: [],
  episodes: [],
  users: [],
  comments: [],
  mediaFiles: [],
  activityLogs: [],
  reports: [],
  transactions: [],
  scheduledEpisodes: [],
  ...(coinPackages !== undefined ? { coinPackages } : {}),
})

const seedSharedBlob = (data: SharedData) => {
  vi.mocked(window.localStorage.getItem).mockImplementation((key: string) =>
    key === 'softgate-shared-data'
      ? JSON.stringify({ schemaVersion: SHARED_DATA_SCHEMA_VERSION, data })
      : null
  )
}

afterEach(() => {
  vi.mocked(window.localStorage.getItem).mockImplementation(() => null)
})

describe('packagesFromBlob', () => {
  it('falls back to the six hardcoded packs when the field is missing', () => {
    expect(packagesFromBlob(undefined)).toEqual(coinPackages)
    expect(packagesFromBlob({ not: 'array' })).toEqual(coinPackages)
  })

  it('keeps an empty Admin wipe empty', () => {
    expect(packagesFromBlob([])).toEqual([])
  })

  it('maps a valid blob row and skips invalid rows', () => {
    const mapped = packagesFromBlob([
      { id: '', coins: 50, price: 1000 },
      { id: 'ok', coins: 80, price: 1500, bonus: 4 },
      { id: 'bad-coins', coins: 0, price: 1000 },
      { id: 'bad-bonus', coins: 50, price: 1000, bonus: -1 },
    ])
    expect(mapped).toHaveLength(1)
    expect(mapped[0]).toMatchObject({
      id: 'ok',
      coins: 80,
      price: 1500,
      bonus: 4,
      metalClass: 'metal-bronze',
      glowClass: '',
    })
  })
})

describe('CoinsPage', () => {
  it('renders the balance card and buy tab by default', () => {
    render(<CoinsPage />)
    expect(screen.getByText(/your balance/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Coins' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Unlocked episodes' })).toBeInTheDocument()
    expect(screen.queryByTestId('coins-unlocked-pending')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
  })

  it('uses the max-w-7xl shell with a left-aligned max-w-4xl inner column', () => {
    const { container } = render(<CoinsPage />)
    const shell = container.querySelector('div.mx-auto.max-w-7xl')
    expect(shell).toBeTruthy()
    const inner = shell?.querySelector(':scope > div.max-w-4xl')
    expect(inner).toBeTruthy()
    expect(inner?.className).not.toMatch(/mx-auto/)
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<CoinsPage />)
    expect(container.textContent).not.toMatch(/coinsPage\.[a-zA-Z]/)
  })

  it('uses Demo header copy and an honest unlocked list', () => {
    render(<CoinsPage />)
    expect(screen.queryByText(/secure payments/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'How coins work' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Unlocked episodes' })).toBeInTheDocument()
    expect(screen.getByText(/no premium episodes unlocked yet/i)).toBeInTheDocument()
  })

  it('shows the six fallback packs when the blob field is missing', () => {
    render(<CoinsPage />)
    expect(screen.getByText(coinPackages[0].coins.toLocaleString())).toBeInTheDocument()
    expect(screen.getByText(coinPackages[5].coins.toLocaleString())).toBeInTheDocument()
  })

  it('shows an empty shop when the blob is an empty array', () => {
    seedSharedBlob(emptyCatalog([]))
    render(<CoinsPage />)
    expect(screen.getByText(/no coin packages are listed right now/i)).toBeInTheDocument()
    expect(screen.queryByText(coinPackages[0].coins.toLocaleString())).not.toBeInTheDocument()
  })

  it('renders a valid blob pack and skips invalid rows', () => {
    seedSharedBlob(
      emptyCatalog([
        { id: 'ok', coins: 80, price: 1500 },
        { id: '', coins: 50, price: 1000 },
      ])
    )
    render(<CoinsPage />)
    expect(screen.getByText('80')).toBeInTheDocument()
    expect(screen.queryByText(coinPackages[0].coins.toLocaleString())).not.toBeInTheDocument()
  })
})
