/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Delete03Icon,
  EuroSendIcon,
  MoreVerticalCircle01Icon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { Link } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Icon } from '@/Components/twc-ui/icon'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Badge } from '@/Components/ui/badge'
import { Checkbox } from '@/Components/ui/checkbox'

const editUrl = (id: number | null) => (id ? route('app.bookkeeping.receipts.edit', { id }) : '#')

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 2
})

const RowActions = ({ row }: { row: Row<App.Data.ReceiptData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={EuroSendIcon}
          separator
          title="Mit Transaktion verknüpfen"
          href={route('app.bookkeeping.receipts.payments', { id: row.original.id })}
        />
        <MenuItem icon={Delete03Icon} title="Löschen" variant="destructive" />
      </DropdownButton>
    </div>
  )
}

export const columns: ColumnDef<App.Data.ReceiptData>[] = [
  {
    id: 'select',
    size: 40,
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
    accessorKey: 'is_locked',
    header: '',
    size: 30,
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
    accessorKey: 'issued_on',
    header: 'Datum',
    size: 90,
    cell: ({ row, getValue }) => (
      <Link
        href={editUrl(row.original.id)}
        className="truncate align-middle font-medium hover:underline"
      >
        {getValue() as string}
      </Link>
    )
  },
  {
    accessorKey: 'contact.full_name',
    header: 'Kreditor ',
    size: 220,
    cell: ({ row, getValue }) => (
      <div className="flex items-center gap-3">
        {getValue() as string}

        <Badge variant="outline">{row.original.document_number}</Badge>
        {row.original.duplicate_of && <Badge variant="destructive">D</Badge>}
      </div>
    )
  },
  {
    accessorKey: 'reference',
    header: 'Referenz ',
    size: 150,
    cell: ({ row }) => <div className="truncate">{row.original.reference as string}</div>
  },
  {
    accessorKey: 'contact.cost_center_id',
    header: 'Kostenstelle ',
    size: 100,
    cell: ({ row }) => <div className="truncate">{row.original.cost_center?.name as string}</div>
  },
  {
    accessorKey: 'is_foreign_currency',
    header: () => <div className="text-right">Fremdwährung</div>,
    size: 80,
    cell: ({ row }) => {
      if (!row.original.is_foreign_currency) return null
      return (
        <div className="text-right">
          {currencyFormatter.format(row.original.org_amount ?? 0)} {row.original.org_currency}
        </div>
      )
    }
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Brutto</div>,
    size: 80,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount ?? 0)} EUR</div>
    )
  },
  {
    accessorKey: 'open_amount',
    header: () => <div className="text-right">Offen</div>,
    size: 80,
    cell: ({ row }) => {
      if (row.original.open_amount === 0) return null
      return (
        <div className="text-right">
          {currencyFormatter.format(row.original.open_amount ?? 0)} EUR
        </div>
      )
    }
  },
  {
    accessorKey: 'payable_min_issued_on',
    header: 'bezahlt',
    size: 80,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
  },
  {
    id: 'actions',
    size: 30,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false
  }
]
