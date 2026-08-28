import { ArrowDownLeft, ArrowUpRight, Gift } from 'lucide-react'
import type { Transaction } from './coinData'

export interface TransactionHistoryRowProps {
  transaction: Transaction
  formattedDate: string
  balanceLabel: string
}

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'purchase':
    case 'demo_topup':
      return <ArrowDownLeft className="h-5 w-5 text-green-500" aria-hidden="true" />
    case 'spend':
      return <ArrowUpRight className="h-5 w-5 text-red-500" aria-hidden="true" />
    case 'refund':
      return <ArrowDownLeft className="h-5 w-5 text-blue-500" aria-hidden="true" />
    case 'bonus':
      return <Gift className="h-5 w-5 text-amber-500" aria-hidden="true" />
  }
}

const TransactionHistoryRow = ({
  transaction,
  formattedDate,
  balanceLabel,
}: TransactionHistoryRowProps) => {
  return (
    <div className="flex items-center gap-4 p-5 transition-colors hover:bg-gray-50">
      <div className="shape-circle flex h-11 w-11 flex-shrink-0 items-center justify-center bg-gray-100">
        {getTransactionIcon(transaction.type)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{transaction.description}</p>
        <p className="mt-1 text-xs text-gray-500">{formattedDate}</p>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-bold ${
            transaction.amount > 0 ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {transaction.amount > 0 ? '+' : ''}
          {transaction.amount}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {balanceLabel}: {transaction.balance}
        </p>
      </div>
    </div>
  )
}

export default TransactionHistoryRow
