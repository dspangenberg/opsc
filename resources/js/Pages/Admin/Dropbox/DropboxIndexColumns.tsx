/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { CopyLinkIcon, Delete03Icon, MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { Link, usePage } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Checkbox } from '@/Components/ui/checkbox'

const editUrl = (id: number | null) => (id ? route('admin.dropbox.edit', { dropbox: id }) : '#')

const handleDelete = async (row: App.Data.DropboxData) => {
  const promise = await AlertDialog.call({
    title: 'Dropbox löschen',
    message: `Möchtest Du die Dropbox ${row.name} wirklich löschen?`,
    buttonTitle: 'Dropbox löschen'
  })
  if (promise) {
    router.delete(route('admin.dropbox.delete', { dropbox: row.id }))
  }
}

const RowActions = ({ row }: { row: Row<App.Data.DropboxData> }) => {
  const domain = usePage().props.auth.domain
  const iniEntry = `${row.original.email_address}=https://${domain}/${row.original.email_address}/${row.original.token}`
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          separator
          icon={CopyLinkIcon}
          title="INI-Eintrag kopieren"
          onAction={() => navigator.clipboard.writeText(iniEntry)}
        />
        <MenuItem
          icon={Delete03Icon}
          title="Löschen"
          variant="destructive"
          onAction={() => handleDelete(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

export const columns: ColumnDef<App.Data.DropboxData>[] = [
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
    header: 'name',
    size: 200,
    cell: ({ getValue, row }) => (
      <>
        <Link href={editUrl(row.original.id)}>{getValue() as string}</Link>
      </>
    )
  },
  {
    accessorKey: 'email_address',
    header: 'E-Mail',
    size: 200,
    cell: ({ getValue }) => (
      <>
        <span>{getValue() as string}</span>
      </>
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
