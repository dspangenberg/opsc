/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { MoreVerticalCircle01Icon, StarIcon, UserCheck01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, router } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { Avatar } from '@/Components/twc-ui/avatar'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Badge } from '@/Components/ui/badge'
import { Checkbox } from '@/Components/ui/checkbox'

const editUrl = (id: number | null) => (id ? route('app.contact.details', { id }) : '#')
const onFavoriteToggle = (id: number | null) => {
  if (id) {
    router.put(route('app.contact.toggle-favorite', { id }))
  }
}

const handleSetAsPrimaryContact = async (row: App.Data.ContactData) => {
  router.put(route('app.contact.set-as-primary', { contact: row.id }))
}

const mailLink = (mail: string) => `mailto:${mail}`

const RowActions = ({ row }: { row: Row<App.Data.ContactData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton
        variant="ghost"
        size="icon-sm"
        icon={MoreVerticalCircle01Icon}
        title="Weitere Optionen"
      >
        <MenuItem
          icon={UserCheck01Icon}
          title="Primärer Kontakt"
          variant="destructive"
          onAction={() => handleSetAsPrimaryContact(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

export const createColumns = (contact: App.Data.ContactData): ColumnDef<App.Data.ContactData>[] => {
  return [
    {
      id: 'select',
      size: 40,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          className="mx-3 bg-background align-middle"
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          className="mx-3 bg-background align-middle"
          aria-label="Select row"
        />
      )
    },
    {
      id: 'is_favorite',
      accessorKey: 'is_favorite',
      size: 40,
      header: '',
      cell: ({ row }) => (
        <HugeiconsIcon
          icon={StarIcon}
          className={`mx-auto size-5 ${row.original.is_favorite ? 'fill-yellow-500 text-yellow-500 hover:text-foreground' : 'text-border/90 hover:text-foreground/50'}`}
          onClick={() => onFavoriteToggle(row.original.id)}
        />
      )
    },
    {
      accessorKey: 'initials',
      header: '',
      size: 45,
      cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar
            initials={row.original.initials.toUpperCase()}
            fullname={row.original.full_name}
            src={row.original.avatar_url}
            size="md"
          />
        </div>
      )
    },
    {
      accessorKey: 'reverse_full_name',
      header: 'Name',
      size: 300,
      cell: ({ row, getValue }) => (
        <>
          <Link
            href={editUrl(row.original.id)}
            className="truncate align-middle font-medium hover:underline"
          >
            {getValue() as string}
          </Link>
          {contact.primary_contact_id === row.original.id && (
            <Badge variant="outline">primärer Kontakt</Badge>
          )}
        </>
      )
    },
    {
      accessorKey: 'primary_mail',
      header: 'E-Mail',
      size: 300,
      cell: ({ getValue }) => (
        <a href={mailLink(getValue() as string)} className="hover:underline">
          {getValue() as string}
        </a>
      )
    },
    {
      accessorKey: 'department',
      header: 'Abteilung',
      size: 100,
      cell: ({ row, getValue }) => (
        <Link href={editUrl(row.original.company_id)} className="w-64 truncate hover:underline">
          <span>{(getValue() as string) || ''}</span>
        </Link>
      )
    },
    {
      accessorKey: 'position',
      header: 'Position',
      size: 100,
      cell: ({ row, getValue }) => (
        <Link href={editUrl(row.original.company_id)} className="w-64 truncate hover:underline">
          <span>{(getValue() as string) || ''}</span>
        </Link>
      )
    },
    {
      id: 'actions',
      size: 40,
      header: () => <span className="sr-only">Aktionen</span>,
      cell: ({ row }) => <RowActions row={row} />,
      enableHiding: false
    }
  ]
}
