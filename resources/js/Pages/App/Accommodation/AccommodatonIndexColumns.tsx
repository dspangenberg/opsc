/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import { Link } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'


const editUrl = (id: number) => route('app.accommodation.details', { id })

export const columns: ColumnDef<App.Data.AccommodationData>[] = [
  {
    accessorKey: 'name',
    header: 'Bezeichnung',
    cell: ({ row, getValue }) => (
      <Link
        href={editUrl(row.original.id as number)}
        className="font-medium hover:underline hover:text-primary"
      >
        <span>{getValue<string>()}</span>
      </Link>
    )
  }
]
