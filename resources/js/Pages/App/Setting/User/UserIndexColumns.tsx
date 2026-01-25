/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Crown03Icon,
  Delete03Icon,
  MailLock01Icon,
  MoreVerticalCircle01Icon,
  SquareLock02Icon
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

const editUrl = (id: number | null) => (id ? route('app.setting.system.user.edit', { id }) : '#')
const mailLink = (mail: string) => `mailto:${mail}`

const handleDelete = async (row: App.Data.UserData) => {
  const promise = await AlertDialog.call({
    title: 'Benutzerkonto löschen',
    message: `Möchtest Du das Benutzerkonto ${row.full_name} wirklich löschen?`,
    buttonTitle: 'Benutzerkonto löschen'
  })
  if (promise) {
    router.delete(route('app.setting.system.user.delete', { user: row.id }))
  }
}

const handleResetPassword = async (row: App.Data.UserData) => {
  router.put(route('app.setting.system.user.reset-password', { user: row.id }))
}

const RowActions = ({ row }: { row: Row<App.Data.UserData> }) => {
  const { auth } = usePage<PageProps>().props
  const currentUser = auth.user
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={MailLock01Icon}
          title="Kennwort zurücksetzen"
          separator
          onAction={() => handleResetPassword(row.original)}
        />
        <MenuItem
          icon={Delete03Icon}
          title="Löschen"
          variant="destructive"
          isDisabled={row.original.id === currentUser?.id}
          onAction={() => handleDelete(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

export const columns: ColumnDef<App.Data.UserData>[] = [
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
    size: 30,
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="relative flex items-center">
          <Avatar
            initials={row.original.initials}
            fullname={row.original.full_name}
            src={row.original.avatar_url}
          />
          {row.original.is_admin && (
            <div className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-blue-300">
              <Icon icon={Crown03Icon} className="size-3 text-white" strokeWidth={2} />
            </div>
          )}
          {row.original.is_locked && (
            <div className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-red-500">
              <Icon icon={SquareLock02Icon} className="size-3 text-white" strokeWidth={2} />
            </div>
          )}
        </div>
      </div>
    )
  },
  {
    accessorKey: 'reverse_full_name',
    header: 'Name',
    size: 200,
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
    accessorKey: 'email',
    header: 'E-Mail',
    size: 200,
    cell: ({ getValue }) => (
      <a href={mailLink(getValue() as string)} className="hover:underline">
        {getValue() as string}
      </a>
    )
  },
  {
    accessorKey: 'email_verified_at',
    header: 'E-Mail-Bestätigung',
    size: 100,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'last_login_at',
    header: 'Letzter Login',
    size: 100,
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
