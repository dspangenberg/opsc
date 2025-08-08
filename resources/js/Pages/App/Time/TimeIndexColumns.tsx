/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Checkbox } from '@/Components/ui/checkbox'
import { minutesToHoursExtended, parseAndFormatDate } from '@/Lib/DateHelper'
import { Avatar } from '@dspangenberg/twcui'
import { Link } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'

const editUrl = (row: App.Data.TimeData) => {
  return row.id ? route('app.time.edit', { id: row.id }) : '#'
}

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
    accessorKey: 'user.initials',
    header: '',
    size: 20,
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar
          initials={row.original.user?.initials}
          fullname={row.original.user?.full_name}
          src={row.original.user?.avatar_url as unknown as string}
          size="sm"
        />
      </div>
    )
  },
  {
    accessorKey: 'date',
    header: 'Datum',
    size: 40,
    cell: ({ row, getValue }) => <Link href={editUrl(row.original)}>{getValue() as string}</Link>
  },
  {
    accessorKey: 'begin_at',
    header: 'Start',
    size: 30,
    cell: ({ row, getValue }) => <span>{parseAndFormatDate(getValue() as string, 'HH:mm')}</span>
  },
  {
    accessorKey: 'end_at',
    header: 'Ende',
    size: 30,
    cell: ({ row, getValue }) => <span>{parseAndFormatDate(getValue() as string, 'HH:mm')}</span>
  },
  {
    accessorKey: 'project_id',
    header: 'Projekt',
    size: 300,
    cell: ({ getValue, row }) => (
      <>
        <Link href="#" className="truncate align-middle hover:underline">
          {row.original.project?.name}
        </Link>
        <div className="line-clamp-1 font-xs text-foreground/60">{row.original.note}</div>
      </>
    )
  },
  {
    accessorKey: 'time_category_id',
    header: 'Kat.',
    size: 30,
    cell: ({ row }) => <>{row.original.category?.short_name}</>
  },
  {
    accessorKey: 'mins',
    header: 'Dauer',
    size: 20,
    cell: ({ row, getValue }) => (
      <div className="text-right">{minutesToHoursExtended(getValue() as number)}</div>
    )
  }
]
