/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'
import { FavouriteIcon } from '@hugeicons/core-free-icons'
import { Avatar } from '@dspangenberg/twcui'
import { Checkbox } from '@/Components/ui/checkbox'
import { Link } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import type React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { router } from '@inertiajs/react'

const editUrl = (id: number | null) => (id ? route('app.contact.details', { id }) : '#')
const onFavoriteToggle = (id: number | null) => {
  if (id) {
    router.put(route('app.contact.toggle-favorite', { id }))
  }
}

const mailLink = (mail: string) => `mailto:${mail}`

export const columns: ColumnDef<App.Data.ContactData>[] = [
  {
    id: 'select',
    size: 40,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        className="align-middle mx-3 bg-background"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        className="align-middle bg-background mx-3"
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
        icon={FavouriteIcon}
        className={`size-5 mx-auto ${row.original.is_favorite ? 'text-red-500 hover:text-foreground fill-red-500' : 'hover:text-foreground/50  text-border/90'}`}
        onClick={() => onFavoriteToggle(row.original.id)}
      />
    )
  },
  {
    accessorKey: 'initials',
    header: '',
    size: 40,
    cell: ({ row }) => (
      <Avatar
        initials={row.original.initials.toUpperCase()}
        fullname={row.original.full_name}
        size="md"
      />
    )
  },
  {
    accessorKey: 'reverse_full_name',
    header: 'Name',
    size: 300,
    cell: ({ row, getValue }) => (
      <Link
        href={editUrl(row.original.id)}
        className="font-medium hover:underline align-middle truncate"
      >
        {getValue() as string}
      </Link>
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
    accessorKey: 'company_name',
    header: 'Organisation',
    size: 300,
    cell: ({ row, getValue }) => (
      <Link href={editUrl(row.original.company_id)} className="hover:underline truncate w-64">
        <span>{(getValue() as string) || ''}</span>
      </Link>
    )
  }
]
