export interface CoinPackage {
  id: string
  coins: number
  price: number
  bonus?: number
  popular?: boolean
  bestValue?: boolean
  metalClass: string
  glowClass: string
}

export interface Transaction {
  id: string
  type: 'purchase' | 'spend' | 'refund' | 'bonus' | 'demo_topup'
  amount: number
  description: string
  balance: number
  createdAt: string
}

export const coinPackages: CoinPackage[] = [
  { id: '1', coins: 50, price: 1000, metalClass: 'metal-bronze', glowClass: '' },
  { id: '2', coins: 120, price: 2000, bonus: 10, metalClass: 'metal-silver', glowClass: '' },
  {
    id: '3',
    coins: 300,
    price: 5000,
    bonus: 30,
    popular: true,
    metalClass: 'metal-gold',
    glowClass: 'gold-glow',
  },
  { id: '4', coins: 650, price: 10000, bonus: 80, metalClass: 'metal-ruby', glowClass: '' },
  {
    id: '5',
    coins: 1400,
    price: 20000,
    bonus: 200,
    bestValue: true,
    metalClass: 'metal-platinum',
    glowClass: 'spark-glow',
  },
  { id: '6', coins: 3000, price: 40000, bonus: 500, metalClass: 'metal-obsidian', glowClass: '' },
]

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'purchase',
    amount: 300,
    description: 'Purchased 300 coins',
    balance: 450,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'spend',
    amount: -5,
    description: 'Unlocked Episode 45 - Shadow Knight',
    balance: 150,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'spend',
    amount: -5,
    description: 'Unlocked Episode 44 - Shadow Knight',
    balance: 155,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'bonus',
    amount: 30,
    description: 'Bonus coins from package purchase',
    balance: 160,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'purchase',
    amount: 120,
    description: 'Purchased 120 coins',
    balance: 130,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
