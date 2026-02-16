/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Link } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

interface AccountBalance {
  account_number: number
  label: string
  debit_sum: number
  credit_sum: number
  balance: number
  type: string | null
}

interface ColumnOptions {
  currentFilters?: any
}

export const createColumns = (options?: ColumnOptions): ColumnDef<AccountBalance>[] => {
  const buildAccountUrl = (accountNumber: number) => {
    const params: any = { accountNumber }

    // Füge Filter als Query-Parameter hinzu wenn vorhanden
    if (options?.currentFilters) {
      params._query = { filters: options.currentFilters }
    }

    return route('app.bookkeeping.bookings.account', params)
  }

  return [
    {
      accessorKey: 'account_number',
      header: 'Konto',
      size: 80,
      cell: ({ getValue }) => (
        <Link href={buildAccountUrl(getValue() as number)} className="font-medium hover:underline">
          {getValue() as number}
        </Link>
      )
    },
    {
      accessorKey: 'label',
      header: 'Bezeichnung',
      size: 300,
      cell: ({ getValue }) => <div className="truncate">{getValue() as string}</div>
    },
    {
      accessorKey: 'debit_sum',
      header: () => <div className="text-right">Soll</div>,
      size: 120,
      cell: ({ getValue }) => (
        <div className="text-right">{currencyFormatter.format(getValue() as number)}</div>
      )
    },
    {
      accessorKey: 'credit_sum',
      header: () => <div className="text-right">Haben</div>,
      size: 120,
      cell: ({ getValue }) => (
        <div className="text-right">{currencyFormatter.format(getValue() as number)}</div>
      )
    },
    {
      accessorKey: 'balance',
      header: () => <div className="text-right">Saldo</div>,
      size: 120,
      cell: ({ getValue, row }) => {
        const balance = getValue() as number
        const absBalance = Math.abs(balance)
        const indicator = balance >= 0 ? 'S' : 'H'
        const accountType = row.original.type

        // Rot bei Debitoren/Kreditoren wenn Saldo != 0
        const isDebitorOrKreditor = accountType === 'd' || accountType === 'c'
        const shouldHighlight = isDebitorOrKreditor && balance !== 0

        return (
          <div className={`text-right font-medium ${shouldHighlight ? 'text-red-600' : ''}`}>
            {currencyFormatter.format(absBalance)} {indicator}
          </div>
        )
      }
    }
  ]
}

export const columns = createColumns()
