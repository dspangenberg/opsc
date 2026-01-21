/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Delete03Icon, MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { Link } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Avatar } from '@/Components/twc-ui/avatar'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Checkbox } from '@/Components/ui/checkbox'

const editUrl = (id: number | null) => (id ? route('app.project.details', { project: id }) : '#')

const handleDeleteProject = async (row: App.Data.ProjectData) => {
  if (row.id == null) return
  const promise = await AlertDialog.call({
    title: 'Projekt in den Papierkorb legen',
    message: `Möchtest Du das Projekt ${row.name} in den Papierkorb legen?`,
    buttonTitle: 'Projekt löschen'
  })
  if (promise) {
    router.delete(route('app.project.delete', { project: row.id }))
  }
}

const RowActions = ({ row }: { row: Row<App.Data.ProjectData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={Delete03Icon}
          title="Löschen"
          variant="destructive"
          onAction={() => handleDeleteProject(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

export const columns: ColumnDef<App.Data.ProjectData>[] = [
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
    accessorKey: 'initials',
    header: '',
    size: 45,
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar
          initials={row.original.name.substring(0, 1).toUpperCase()}
          fullname={row.original.name}
          src={row.original.avatar_url}
          size="md"
        />
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: 'Projekt',
    size: 250,
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
    accessorKey: 'project_category_id',
    header: 'Kategorie',
    size: 100,
    cell: ({ row }) => <span>{row.original.category?.name}</span>
  },
  {
    accessorKey: 'owner_contact_id',
    header: 'Kunde',
    size: 150,
    cell: ({ row }) => (
      <Link
        href={route('app.contact.details', { contact: row.original.owner_contact_id })}
        className="w-64 truncate hover:underline"
      >
        <span>{row.original.owner?.full_name}</span>
      </Link>
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
