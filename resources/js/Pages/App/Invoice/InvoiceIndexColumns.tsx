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
import { router } from '@inertiajs/react'
import { Badge } from '@/Components/ui/badge'

const editUrl = (id: number | null) => (id ? route('app.invoice.details', { id }) : '#')
const contactUrl = (id: number | null) => (id ? route('app.contact.details', { id }) : '#')

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})
const mailLink = (mail: string) => `mailto:${mail}`

export const columns: ColumnDef<App.Data.InvoiceData>[] = [
  {
    id: 'select',
    size: 45,
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
    accessorKey: 'issued_on',
    header: 'Datum',
    size: 100,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'type.abbreviation',
    header: '',
    size: 36,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'formated_invoice_number',
    header: 'Rechnungsnr.',
    size: 140,
    cell: ({ row, getValue }) => (
      <div className="flex items-center gap-3">
      <Link
        href={editUrl(row.original.id)}
        className="font-medium hover:underline align-middle truncate"
      >
        <span>{getValue() as string}</span>
      </Link>
        {row.original.is_loss_of_receivables && <Badge variant="destructive" className="cursor-help">FV</Badge>}
      </div>
    )
  },
  {
    accessorKey: 'contact.full_name',
    header: 'Debitor',
    size: 250,
    cell: ({ getValue, row }) => (
      <Link
        href={contactUrl(row.original.contact_id)}
        className="hover:underline align-middle truncate"
      >
        {getValue() as string}
      </Link>
    )
  },
  {
    accessorKey: 'project_id',
    header: 'Projekt',
    size: 200,
    cell: ({ getValue, row }) => (
      <Link
        href={contactUrl(row.original.contact_id)}
        className="hover:underline align-middle truncate"
      >
        {row.original.project?.name}
      </Link>
    )
  },
  {
    accessorKey: 'amount_net',
    header: () => <div className="text-right">netto</div>,
    size: 110,
    cell: ({  row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount_net)}</div>
    )
  },
  {
    accessorKey: 'amount_tax',
    header: () => <div className="text-right">USt.</div>,
    size: 110,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount_tax)}</div>
    )
  },
  {
    accessorKey: 'amount_gross',
    header: () => <div className="text-right">brutto</div>,
    size: 110,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount_gross)}</div>
    )
  }
]
