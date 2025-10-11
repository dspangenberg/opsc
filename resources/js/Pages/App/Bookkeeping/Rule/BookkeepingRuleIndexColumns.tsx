/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Delete03Icon, MoreVerticalCircle01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { Link } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Checkbox } from '@/Components/ui/checkbox'
import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'
import { Icon } from '@/Components/ui/twc-ui/icon'

const editUrl = (id: number | null) => (id ? route('app.bookkeeping.rules.edit', { id }) : '#')

const handleDeleteClicked = async (row: App.Data.BookkeepingRuleData) => {
  console.log('handleDeleteClicked', row)
  const promise = await AlertDialog.call({
    title: 'Löschen bestätigen',
    message: `Möchtest Du die Regel ${row.name} Eintrag wirklich löschen?`,
    buttonTitle: 'Regel löschen',
    variant: 'destructive'
  })
  if (promise) {
    router.delete(route('app.bookkeeping.rules.destroy', { id: row.id }))
  }
}

const RowActions = ({ row }: { row: Row<App.Data.BookkeepingRuleData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={Delete03Icon}
          title="Löschen"
          variant="destructive"
          onAction={() => handleDeleteClicked(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

export const columns: ColumnDef<App.Data.BookkeepingRuleData>[] = [
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
    accessorKey: 'is_active',
    header: '',
    size: 20,
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
    accessorKey: 'name',
    header: 'Bezeichnung',
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
    accessorKey: 'table',
    header: 'Tabelle',
    size: 100,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'priority',
    header: 'Priorität',
    size: 20,
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
