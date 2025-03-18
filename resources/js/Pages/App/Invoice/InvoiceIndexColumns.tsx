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

const editUrl = (id: number | null) => (id ? route('app.invoice.details', { id }) : '#')
const contactUrl = (id: number | null) => (id ? route('app.contact.details', { id }) : '#')

const currencyFormatter = new Intl.NumberFormat('default', {
  style: 'currency',
  currency: 'EUR'
})

const mailLink = (mail: string) => `mailto:${mail}`

export const columns: ColumnDef<App.Data.InvoiceData>[] = [
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
    accessorKey: 'issued_on',
    header: 'Datum',
    size: 100,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'formated_invoice_number',
    header: 'Rechnungsnr.',
    size: 150,
    cell: ({ row, getValue }) => (
      <Link
        href={editUrl(row.original.id)}
        className="font-medium hover:underline align-middle truncate"
      >
        <span>{getValue() as string}</span>
      </Link>
    )
  },
  {
    accessorKey: 'contact.full_name',
    header: '',
    size: 350,
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
    accessorKey: 'amount_net',
    header: 'netto',
    size: 110,
    cell: ({ getValue, row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount_net)}</div>
    )
  },
  {
    accessorKey: 'amount_tax',
    header: 'Steuern',
    size: 110,
    cell: ({ getValue, row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount_tax)}</div>
    )
  },
  {
    accessorKey: 'amount_gross',
    header: 'brutto',
    size: 110,
    cell: ({ getValue, row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount_gross)}</div>
    )
  }
]
