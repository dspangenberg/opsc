import { Tick01Icon } from '@hugeicons/core-free-icons'
import { Link } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import { Pressable } from 'react-aria-components'
import { HoverCard } from '@/Components/twc-ui/hover-card'
import { Icon } from '@/Components/twc-ui/icon'
import { Badge } from '@/Components/ui/badge'
import { Checkbox } from '@/Components/ui/checkbox'
import { InvoiceIndexHoverCard } from '@/Pages/App/Invoice/InvoiceIndexHoverCard'

const editUrl = (id: number | null) => (id ? route('app.invoice.details', { id }) : '#')
const contactUrl = (id: number | null) => (id ? route('app.contact.details', { id }) : '#')

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})
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
    accessorKey: 'issued_on',
    header: 'Datum',
    size: 80,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'booking',
    header: '',
    size: 30,
    cell: ({ row }) => {
      if (row.original.booking?.id) {
        return (
          <div className="mx-auto flex size-4 items-center justify-center rounded-full bg-green-500">
            <HoverCard>
              <Pressable>
                <Icon icon={Tick01Icon} className="size-3.5 text-white" stroke="3" role="button" />
              </Pressable>

              <InvoiceIndexHoverCard invoice={row.original} />
            </HoverCard>
          </div>
        )
      }
    }
  },
  {
    accessorKey: 'formated_invoice_number',
    header: 'Rechnungsnr.',
    size: 140,
    cell: ({ row, getValue }) => (
      <div className="flex items-center gap-3">
        <Link
          href={editUrl(row.original.id)}
          className="truncate align-middle font-medium hover:underline"
        >
          <span>
            {row.original.type?.abbreviation || 'RG'}-{getValue() as string}
          </span>
        </Link>
      </div>
    )
  },
  {
    accessorKey: 'contact.full_name',
    header: 'Debitor',
    size: 200,
    cell: ({ getValue, row }) => (
      <Link
        href={contactUrl(row.original.contact_id)}
        className="truncate align-middle hover:underline"
      >
        {getValue() as string}
      </Link>
    )
  },
  {
    accessorKey: 'project_id',
    header: 'Projekt',
    size: 200,
    cell: ({ row }) => (
      <Link
        href={contactUrl(row.original.contact_id)}
        className="truncate align-middle hover:underline"
      >
        {row.original.project?.name}
      </Link>
    )
  },
  {
    accessorKey: 'amount_net',
    header: () => <div className="text-right">netto</div>,
    size: 90,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount_net)}</div>
    )
  },
  {
    accessorKey: 'amount_tax',
    header: () => <div className="text-right">USt.</div>,
    size: 90,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount_tax)}</div>
    )
  },
  {
    accessorKey: 'amount_gross',
    header: () => <div className="text-right">brutto</div>,
    size: 90,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount_gross)}</div>
    )
  },
  {
    accessorKey: 'payable_sum_amount',
    header: () => <div className="text-right">offen</div>,
    size: 90,
    cell: ({ row }) => {
      if (row.original.is_loss_of_receivables) {
        return (
          <div className="flex justify-end">
            <Badge variant="destructive">FV</Badge>
          </div>
        )
      }
      if (row.original.is_draft || row.original.amount_open === 0) {
        return <span />
      }
      return (
        <div className="text-right">
          {currencyFormatter.format(
            row.original.amount_gross - (row.original.payable_sum_amount || 0)
          )}
        </div>
      )
    }
  }
]
