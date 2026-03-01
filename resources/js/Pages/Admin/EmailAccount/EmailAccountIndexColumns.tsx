/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Crown03Icon,
  Delete03Icon,
  Loading01Icon,
  MailLock01Icon,
  MoreVerticalCircle01Icon,
  SquareLock02Icon,
  UserSwitchIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { Link, usePage } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Avatar } from '@/Components/twc-ui/avatar'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Icon } from '@/Components/twc-ui/icon'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Checkbox } from '@/Components/ui/checkbox'
import type { PageProps } from '@/Types'

const editUrl = (id: number | null) =>
  id ? route('admin.email-account.edit', { emailAccount: id }) : '#'

const handleDelete = async (row: App.Data.UserData) => {
  const promise = await AlertDialog.call({
    title: 'Benutzerkonto löschen',
    message: `Möchtest Du das Benutzerkonto ${row.full_name} wirklich löschen?`,
    buttonTitle: 'Benutzerkonto löschen'
  })
  if (promise) {
    router.delete(route('admin.email_account.delete', { user: row.id }))
  }
}

const handleSendTestmail = async (row: App.Data.EmailAccountData) => {
  router.put(route('admin.email-account.send-test-mail', { emailAccount: row.id }))
}

const RowActions = ({ row }: { row: Row<App.Data.EmailAccountData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={MailLock01Icon}
          title="Test-E-Mail senden"
          separator
          onAction={() => handleSendTestmail(row.original)}
        />
        <MenuItem icon={MailLock01Icon} title="Als Standard-E-Mail-Account festlegen" separator />
        <MenuItem icon={Delete03Icon} title="Löschen" variant="destructive" />
      </DropdownButton>
    </div>
  )
}

export const columns: ColumnDef<App.Data.EmailAccountData>[] = [
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
    accessorKey: 'email',
    header: 'E-Mail',
    size: 200,
    cell: ({ getValue, row }) => <Link href={editUrl(row.original.id)}>{getValue() as string}</Link>
  },
  {
    id: 'actions',
    size: 30,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false
  }
]
