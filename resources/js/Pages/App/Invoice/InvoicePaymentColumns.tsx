import type { ColumnDef } from '@tanstack/react-table'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})

export const columns: ColumnDef<App.Data.PaymentData>[] = [
  {
    accessorKey: 'issued_on',
    header: 'Datum',
    size: 60,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'bookkeeping_text',
    header: 'Buchungstext',
    size: 400,
    cell: ({ row, getValue }) => {
      const [_bookingType, name, purpose] = row.original.transaction.bookkeeping_text.split('|')

      return (
        <div>
          <div>{name}</div>
          <div className="truncate text-xs">{purpose}</div>
        </div>
      )
    }
  },
  {
    accessorKey: 'transaction.amount',
    header: () => <div className="text-right">Überwiesen</div>,
    size: 80,
    cell: ({ row }) => (
      <div className="text-right">
        {currencyFormatter.format(row.original.transaction.amount as number)}
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Verrechnet</div>,
    size: 80,
    cell: ({ row }) => (
      <div className="text-right">{currencyFormatter.format(row.original.amount as number)}</div>
    )
  }
]
