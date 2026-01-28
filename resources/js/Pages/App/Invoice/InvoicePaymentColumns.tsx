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
    size: 40,
    cell: ({ row, getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: 'transaction.name',
    header: 'Kontoinhaber',
    size: 50,
    cell: ({ row, getValue }) => <div className="w-25 truncate">{getValue() as string}</div>
  },
  {
    accessorKey: 'transaction.purpose',
    header: 'Verwendungszweck',
    size: 200,
    cell: ({ getValue, row }) => <div>{getValue() as string}</div>
  },
  {
    accessorKey: 'amount',
    header: 'Betrag',
    size: 80,
    cell: ({ row }) => (
      <div className="text-right">
        {currencyFormatter.format(row.original.amount as number)}&nbsp;&nbsp;
      </div>
    )
  }
]
