import { Link } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/Components/ui/checkbox'

const addUrl = (id: number | null) =>
  id ? route('app.invoice.create-external', { document: id }) : '#'

const contactUrl = (id: number | null) => (id ? route('app.contact.details', { id }) : '#')

export const columns: ColumnDef<App.Data.DocumentData>[] = [
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
    cell: ({ getValue, row }) => <Link href={addUrl(row.original.id)}>{getValue() as string}</Link>
  },
  {
    accessorKey: 'filename',
    header: 'Dateiname',
    size: 140,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
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
    cell: ({ row }) => <span>{row.original.project?.name}</span>
  }
]
