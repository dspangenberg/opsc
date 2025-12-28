import { Link } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/Components/ui/checkbox'

const editUrl = (id: number | null) => (id ? route('app.invoice.details', { id }) : '#')
const contactUrl = (id: number | null) => (id ? route('app.contact.details', { id }) : '#')

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})
const mailLink = (mail: string) => `mailto:${mail}`

export const columns: ColumnDef<App.Data.OfferData>[] = [
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
    size: 100,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'formated_offer_number',
    header: 'Angebotsnr.',
    size: 140,
    cell: ({ row, getValue }) => (
      <div className="flex items-center gap-3">
        <Link
          href={editUrl(row.original.id)}
          className="truncate align-middle font-medium hover:underline"
        >
          <span>{getValue() as string}</span>
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
    cell: ({ getValue, row }) => (
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
  }
]
