/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FileEuroIcon, MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'
import { Link } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Checkbox } from '@/Components/ui/checkbox'
import { minutesToHoursExtended } from '@/Lib/DateHelper'

const editUrl = (row: App.Data.BillableProjectData) => {
  if (!row.id) return '#'

  const currentView = route().queryParams.view
  const baseUrl = `${route('app.time.edit', { id: row.id, _query: { view: currentView } })}?view=${currentView}`
  return baseUrl
}

const billUrl = (row: App.Data.BillableProjectData) => {
  if (!row.id) return '#'

  const baseUrl = `${route('app.time.bill', { _query: { project_id: row.id } })}`
  return baseUrl
}

const durationInMinutes = (row: App.Data.BillableProjectData) => {
  console.log('durationInMinutes', row.total_mins)
  const value = minutesToHoursExtended(row.total_mins as number)
  try {
    return value
  } catch (error) {
    return 0
  }
}

const RowActions = ({ row }: { row: Row<App.Data.BillableProjectData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={FileEuroIcon}
          title="Projekt komplett abrechnen"
          ellipsis
          separator
          href={billUrl(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

export const columns: ColumnDef<App.Data.BillableProjectData>[] = [
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
    accessorKey: 'name',
    header: 'Projekt',
    size: 200,
    cell: ({ row, getValue }) => (
      <Link
        className="truncate align-middle font-medium hover:underline"
        href={editUrl(row.original)}
      >
        {getValue() as string}
      </Link>
    )
  },
  {
    accessorKey: 'first_entry_at',
    header: 'Ältester Eintrag',
    size: 80,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'last_entry_at',
    header: 'Jüngster Eintrag',
    size: 80,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'total_mins',
    header: 'abrechenbar',
    size: 30,
    cell: ({ row }) => <div className="text-right">{durationInMinutes(row.original)} h</div>
  },
  {
    id: 'actions',
    size: 30,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false
  }
]
