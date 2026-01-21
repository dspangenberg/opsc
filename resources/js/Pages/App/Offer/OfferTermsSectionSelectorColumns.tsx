/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/Components/twc-ui/checkbox'

export const columns: ColumnDef<App.Data.OfferSectionData>[] = [
  {
    id: 'select',
    size: 30,
    header: ({ table }) => (
      <Checkbox
        name="select-all"
        isSelected={table.getIsAllPageRowsSelected()}
        isIndeterminate={table.getIsSomePageRowsSelected()}
        onChange={value => table.toggleAllPageRowsSelected(value)}
        className="mx-3 bg-background align-middle"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          name={`select-${row.id}`}
          isSelected={row.getIsSelected()}
          onChange={value => row.toggleSelected(value)}
          className="mx-3 bg-background align-middle"
        />
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: 'Bezeichnung',
    size: 300,
    cell: ({ getValue }) => <div>{getValue() as string}</div>
  }
]
