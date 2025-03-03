/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip'
import { CheckmarkCircle02Icon } from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon } from '@hugeicons/react'
import { ModalLink } from '@inertiaui/modal-react'
import type { ColumnDef } from '@tanstack/react-table'
import type React from 'react'
const editUrl = (id: number) => route('app.accommodation.details', { id })

export const columns: ColumnDef<App.Data.BookingPolicyData>[] = [
  {
    accessorKey: 'is_default',
    header: '',
    size: 6,
    cell: ({ getValue }) => (
      <div>
        {getValue<boolean>() === true ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5 text-green-500 mx-auto" />
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">Standard</TooltipContent>
          </Tooltip>
        ) : (
          ''
        )}
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: 'Bezeichnung',
    cell: ({ row, getValue }) => (
      <ModalLink
        href={editUrl(row.original.id as number)}
        className="font-medium hover:underline hover:text-primary"
      >
        <span>{getValue<string>()}</span>
      </ModalLink>
    )
  }
]
