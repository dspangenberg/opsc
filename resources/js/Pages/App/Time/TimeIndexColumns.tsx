/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'
import { Avatar } from '@dspangenberg/twcui'
import { Checkbox } from '@/Components/ui/checkbox'
import { Link } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import type React from 'react'
import { minutesToHoursExtended, parseAndFormatDate} from '@/Lib/DateHelper'

const editUrl = (id: number | null) => (id ? route('app.invoice.details', { id }) : '#')
const contactUrl = (id: number | null) => (id ? route('app.contact.details', { id }) : '#')

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 2
})
const mailLink = (mail: string) => `mailto:${mail}`

export const columns: ColumnDef<App.Data.TimeData>[] = [
  {
    id: 'select',
    size: 20,
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
      <div className="flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          className="align-middle bg-background mx-3"
          aria-label="Select row"
        />
      </div>
    )
  },
  {
    accessorKey: 'user.initials',
    header: '',
    size: 20,
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar
          initials={row.original.user.initials.toUpperCase()}
          fullname={row.original.user.full_name}
          src={row.original.user.avatar_url as unknown as string}
          size="sm"
        />
      </div>
    )
  },
  {
    accessorKey: 'begin_at',
    header: 'Start',
    size: 50,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'end_at',
    header: 'Ende',
    size: 20,
    cell: ({ row, getValue }) => <span>{parseAndFormatDate(getValue() as string, 'HH:mm')}</span>
  },
  {
    accessorKey: 'project_id',
    header: 'Projekt',
    size: 300,
    cell: ({ getValue, row }) => (
      <>
      <Link
        href={contactUrl(row.original.project_id)}
        className="hover:underline align-middle truncate"
      >
        {row.original.project?.name}
      </Link>
        <div className="font-xxs text-foreground/60 line-clamp-1">
          {row.original.note}
        </div>
      </>
    )
  },
  {
    accessorKey: 'mins',
    header: 'Dauer',
    size: 20,
    cell: ({ row, getValue }) => <div className="text-right">{minutesToHoursExtended(getValue() as number)}</div>
  },
]
