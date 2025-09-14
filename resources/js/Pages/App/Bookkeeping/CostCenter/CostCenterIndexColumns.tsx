/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Delete03Icon, MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'
import { Link } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Checkbox } from '@/Components/ui/checkbox'

const editUrl = (id: number | null) =>
  id ? route('app.bookkeeping.cost-centers.edit', { id }) : '#'

const RowActions = ({ row }: { row: Row<App.Data.CostCenterData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem icon={Delete03Icon} title="Löschen" variant="destructive" />
      </DropdownButton>
    </div>
  )
}

export const columns: ColumnDef<App.Data.CostCenterData>[] = [
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
    accessorKey: 'name',
    header: 'Kostenstelle',
    size: 300,
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
    accessorKey: 'bookkeepingAccountLabel',
    header: 'Buchhaltungskonto',
    size: 300,
    cell: ({ row }) => <span>{row.original.account?.label}</span>
  },
  {
    id: 'actions',
    size: 30,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false
  }
]
