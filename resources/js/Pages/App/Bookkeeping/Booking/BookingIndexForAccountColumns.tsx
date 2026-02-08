/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { MoreVerticalCircle01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Icon } from '@/Components/twc-ui/icon'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Badge } from '@/Components/ui/badge'
import { Checkbox } from '@/Components/ui/checkbox'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const handleConfirmClicked = async (row: App.Data.BookkeepingBookingData) => {
  router.get(route('app.bookkeeping.transactions.confirm', { _query: { ids: row.id } }), {
    preserveScroll: true
  })
}

const RowActions = ({ row }: { row: Row<App.Data.BookkeepingBookingData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={Tick01Icon}
          title="Buchung als bestätigt markieren"
          isDisabled={row.original.is_locked}
          separator
          onAction={() => handleConfirmClicked(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

const accountIndexUrl = (accoutNumber: number) => (accoutNumber ? route('app.bookkeeping.bookings.account', { accountNumber: accoutNumber }) : '#')
export const columns: ColumnDef<App.Data.BookkeepingBookingData>[] = [
  {
    id: 'select',
    size: 30,
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
    accessorKey: 'date',
    header: 'Datum',
    size: 60,
    cell: ({ getValue }) => (
      <div>
        <span>{getValue() as string}</span>
      </div>
    )
  },
  {
    accessorKey: 'document_number',
    header: '',
    size: 80,
    cell: ({ getValue }) => (
      <div className="text-xs">
        <Badge variant="outline">{getValue() as string}</Badge>
      </div>
    )
  },
  {
    accessorKey: 'is_locked',
    header: '',
    size: 5,
    cell: ({ getValue }) => {
      if (getValue() === true) {
        return (
          <div className="mx-auto flex size-4 items-center justify-center rounded-full bg-green-500">
            <Icon icon={Tick01Icon} className="size-3.5 text-white" stroke="3" />
          </div>
        )
      }
    }
  },
  {
    accessorKey: 'booking_text',
    header: 'Buchungstext',
    size: 300,
    cell: ({ row }) => {
      const [bookingType, name, purpose, conversion] = row.original.booking_text.split('|')
      return (
        <div>
          <div className="text-foreground/80 text-xs">
            #{row.original.id} &mdash; {bookingType}
          </div>
          <div className="truncate font-medium">{name}</div>
          <div className="truncate">{purpose}</div>
          {conversion && <div className="text-foreground/80 text-xs">{conversion}</div>}
        </div>
      )
    }
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Brutto</div>,
    size: 70,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount)}</div>
    )
  },
  {
    accessorKey: 'tax',
    header: () => <div className="text-right">USt.</div>,
    size: 40,
    cell: ({ row }) => <div className="text-right">{row.original.tax?.value || 0} %</div>
  },
  {
    accessorKey: 'counter_account_label',
    header: 'Gegenkonto',
    size: 140,
    cell: ({ row }) => (

      <a href={accountIndexUrl(row.original.counter_account as number)} className="truncate">{row.original.counter_account_label}</a>

    )
  },
  {
    accessorKey: 'tax_debit',
    header: () => <div className="text-right">USt. S</div>,
    size: 50,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.tax_debit)}</div>
    )
  },
  {
    accessorKey: 'tax_credit',
    header: () => <div className="text-right">USt. H</div>,
    size: 50,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.tax_credit)}</div>
    )
  },
  {
    accessorKey: 'balance',
    header: () => <div className="text-right">Saldo</div>,
    size: 50,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.balance ?? 0)}</div>
    )
  },
  {
    id: 'actions',
    size: 30,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false
  }
]
