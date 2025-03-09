/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import { Avatar, AvatarFallback } from '@/Components/ui/avatar'
import { Checkbox } from '@/Components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip'
import { Link } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import type React from 'react'

const editUrl = (id: number) => route('app.accommodation.details', { id })

export const columns: ColumnDef<App.Data.ContactData>[] = [
  {
    id: 'select',
    size: 32,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        className="align-middle"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        className="align-middle bg-background"
        aria-label="Select row"
      />
    )
  },
  {
    accessorKey: 'initials',
    header: '',
    size: 50,
    cell: ({ row, getValue }) => {
      const fullName: string = row.original.full_name
      const initials: string = row.original.initials.toUpperCase()
      return (
        <div className="flex items-center">
          <div className="inline-block">
            <Tooltip>
              <TooltipTrigger>
            <Avatar className="size-8 rounded-full">
              <AvatarFallback fullname={fullName} initials={initials} className="rounded-full" />
            </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <span>{fullName}</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'reverse_full_name',
    header: 'Name',
    size: 300,
    cell: ({ row, getValue }) => (


      <Link
        href={editUrl(row.original.id as number)}
        className="font-medium hover:underline hover:text-primary align-middle truncate"
      >
        {getValue<string>()}
      </Link>

    )
  },
  {
    accessorKey: 'company_name',
    header: 'Organisation',
    size: 300,
    cell: ({ row, getValue }) => (
      <Link
        href={editUrl(row.original.id as number)}
        className="hover:underline hover:text-primary truncate w-64"
      >
        <span>{getValue<string>() || ''}</span>
      </Link>
    )
  }
]
