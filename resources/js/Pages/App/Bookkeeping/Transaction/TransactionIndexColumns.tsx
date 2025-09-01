/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  FileEuroIcon,
  MoreVerticalCircle01Icon,
  ProfileIcon,
  Tick01Icon,
  WebValidationIcon
} from '@hugeicons/core-free-icons'
import { Link, router } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { Autocomplete, Menu, SubmenuTrigger, useFilter } from 'react-aria-components'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Badge, type BadgeVariant } from '@/Components/ui/badge'
import { Checkbox } from '@/Components/ui/checkbox'
import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'
import { Icon } from '@/Components/ui/twc-ui/icon'
import { MySearchField } from '@/Components/ui/twc-ui/MySearchField'
import { Popover } from '@/Components/ui/twc-ui/popover'
import { TextField } from '@/Components/ui/twc-ui/text-field'
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

interface ColumnOptions {
  onSetCounterAccountAction?: (row: App.Data.TransactionData) => void
  onPaymentAction?: (row: App.Data.TransactionData) => void
}

const RowActions = ({
  row,
  options
}: {
  row: Row<App.Data.TransactionData>
  options?: ColumnOptions
}) => {
  const { contains } = useFilter({ sensitivity: 'base' })

  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={Tick01Icon}
          title="Transaktion als bestätigt markieren"
          isDisabled={row.original.is_locked}
          separator
          onAction={() => handleConfirmClicked(row.original)}
        />

        <MenuItem
          icon={ProfileIcon}
          title="Gegenkonto"
          ellipsis
          separator
          isDisabled={row.original.is_locked}
          onAction={() => options?.onSetCounterAccountAction?.(row.original)}
        />

        <MenuItem
          icon={FileEuroIcon}
          title="Zahlung auf Ausgangsrechnung anwenden"
          ellipsis
          separator
          isDisabled={row.original.account?.type !== 'd'}
          onAction={() => options?.onPaymentAction?.(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

export const createColumns = (options?: ColumnOptions): ColumnDef<App.Data.TransactionData>[] => [
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
    size: 50,
    cell: ({ row, getValue }) => (
      <div>
        <span>{getValue() as string}</span>
      </div>
    )
  },
  {
    accessorKey: 'valued_on',
    header: 'Wertstellung',
    size: 50,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'is_locked',
    header: '',
    size: 5,
    cell: ({ row, getValue }) => {
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
    accessorKey: 'bookkeeping_text',
    header: 'Buchung',
    size: 400,
    cell: ({ row, getValue }) => {
      const [bookingType, name, purpose] = row.original.bookkeeping_text.split('|')
      let variant: BadgeVariant

      switch (row.original.account?.type) {
        case 'd':
          variant = 'light-green'
          break
        case 'c':
          variant = 'light-blue'
          break
        default:
          variant = 'secondary'
          break
      }

      return (
        <div>
          <div className="flex items-center gap-2 text-xs">
            {row.original.document_number && (
              <Badge variant="outline">{row.original.document_number}</Badge>
            )}
            <div>
              #{row.original.id} &mdash; {bookingType} &nbsp;
              {row.original.account?.label && (
                <Badge variant={variant}>{row.original.account?.label}</Badge>
              )}
              {!row.original.counter_account_id && (
                <Badge variant="light-red">kein Gegenkonto</Badge>
              )}
            </div>
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
    size: 110,
    cell: ({ row }) => (
      <div className={cn(row.original.amount < 0 ? 'text-red-500' : '', 'text-right')}>
        {currencyFormatter.format(row.original.amount)}
      </div>
    )
  },
  {
    id: 'actions',
    size: 30,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} options={options} />,
    enableHiding: false
  }
]

// Für Rückwärtskompatibilität
export const columns = createColumns()
