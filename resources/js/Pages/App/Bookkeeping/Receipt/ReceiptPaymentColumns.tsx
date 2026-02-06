/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/Components/ui/checkbox'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})

export const paymentColumns: ColumnDef<App.Data.PaymentData>[] = [
  {
    id: 'select',
    size: 20,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        className="mx-3 bg-background align-middle"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          className="mx-3 bg-background align-middle"
          aria-label="Select row"
        />
      </div>
    )
  },
  {
    accessorKey: 'issued_on',
    header: 'Datum',
    size: 50,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'bookkeeping_text',
    header: 'Buchung',
    cell: ({ row }) => {
      if (row.original.is_currency_difference) {
        return <span>Währungsdifferenz</span>
      }
      return <div>{row.original.transaction.bookkeeping_text.split('|').join(' ')}</div>
    }
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Betrag</div>,
    size: 130,
    cell: ({ row }) => (
      <div className="font-medium">{currencyFormatter.format(row.original.amount || 0)}</div>
    )
  },
  {
    accessorKey: 'transaction.amount',
    header: () => <div className="text-right">Betrag</div>,
    size: 130,
    cell: ({ row }) => (
      <div className="font-medium">
        {currencyFormatter.format(row.original.transaction.amount || 0)}
      </div>
    )
  }
]
