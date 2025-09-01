/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Delete03Icon,
  Edit03Icon,
  MoreVerticalCircle01Icon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { Link, router } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Badge } from '@/Components/ui/badge'
import { Checkbox } from '@/Components/ui/checkbox'
import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'
import { Icon } from '@/Components/ui/twc-ui/icon'
import { cn } from '@/Lib/utils'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})

const editUrl = (row: App.Data.TransactionData) => {
  return row.id ? route('app.time.edit', { id: row.id }) : '#'
}

const handleConfirmClicked = async (row: App.Data.TransactionData) => {
  router.get(route('app.bookkeeping.transactions.confirm', { _query: { ids: row.id } }), {
    preserveScroll: true
  })
}

const handleDeleteClicked = async (row: App.Data.TransactionData) => {
  const promise = await AlertDialog.call({
    title: 'Löschen bestätigen',
    message: 'Möchtest Du den Eintrag wirklich löschen?',
    buttonTitle: 'Eintrag löschen',
    variant: 'destructive'
  })
  if (promise) {
    router.delete(route('app.times.delete', { id: row.id }))
  }
}

const RowActions = ({ row }: { row: Row<App.Data.TransactionData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={Tick01Icon}
          title="Transaktion bestätigen"
          isDisabled={row.original.is_locked}
          ellipsis
          separator
          onAction={() => handleConfirmClicked(row.original)}
        />
        <MenuItem
          icon={Delete03Icon}
          variant="destructive"
          title="Eintrag löschen"
          ellipsis
          onAction={() => handleDeleteClicked(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

export const columns: ColumnDef<App.Data.TransactionData>[] = [
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
    accessorKey: 'booked_on',
    header: 'Buchung',
    size: 30,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'bookkeeping_text',
    header: 'Buchung',
    cell: ({ row, getValue }) => {
      console.log(row.original.bookkeeping_text)
      const [bookingType, name, purpose] = row.original.bookkeeping_text.split('|')
      console.log(bookingType, name, purpose)
      return (
        <div>
          <div className="flex items-center gap-2 text-xs">
            {bookingType}
            {row.original.is_private && <Badge variant="light-blue">privat</Badge>}
            {row.original.is_transit && <Badge variant="light-purple">Transit</Badge>}
            {!!row.original.contact_id && (
              <Badge variant="secondary">{row.original.contact?.full_name}</Badge>
            )}
          </div>
          <div className="font-medium">{name}</div>
          <div className="truncate">{purpose}</div>
          {row.original.account_number && (
            <div className="text-muted-foreground text-xs">{row.original.account_number}</div>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'amount_tax',
    header: () => <div className="text-right">Betrag</div>,
    size: 130,
    cell: ({ row }) => (
      <div className={cn(row.original.amount < 0 ? 'text-red-500' : '', 'text-right')}>
        <div className="font-medium">{currencyFormatter.format(row.original.remaining_amount)}</div>
      </div>
    )
  }
]
