/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import { Button } from '@/Components/ui/button'
import { Checkbox } from '@/Components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip'
import { Alert02Icon, CheckmarkCircle02Icon } from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon } from '@hugeicons/react'

import { ModalLink } from '@inertiaui/modal-react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, Ellipsis, Info } from "lucide-react";
import type React from 'react'


const getBookingMode = (mode: number) => {
  switch (mode) {
    case 1:
      return 'nur Inhouse buchbar'
    case 2:
      return 'Inhouse + Online buchbar'
    default:
      return 'nicht buchbar'
  }
}
const editUrl = (id: number) => route('app.settings.booking.seasons.edit', { id })

function RowActions({ row }: { row: Row<App.Data.SeasonData> }) {
  return (
    <div className="mx-auto">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button size="icon" variant="ghost" className=" mr-3" aria-label="Edit item">
            <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Bearbeiten</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplizieren</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Archivieren</span>
          </DropdownMenuItem>

        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={row.original.is_default}>Als Standard festlegen</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <span>Löschen &hellip;</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<App.Data.SeasonData>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button
          {...{
            className: "size-7 shadow-none text-muted-foreground",
            onClick: row.getToggleExpandedHandler(),
            "aria-expanded": row.getIsExpanded(),
            "aria-label": row.getIsExpanded()
              ? `Collapse details for ${row.original.name}`
              : `Expand details for ${row.original.name}`,
            size: "icon",
            variant: "ghost",
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronUp className="opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <ChevronDown className="opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </Button>
      ) : undefined;
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'color',
    header: '',
    cell: ({ row, getValue }) => (
      <div
        style={{ backgroundColor: getValue<string>() }}
        className="size-4 rounded-md mx-auto"
      />

    )
  },
  {
    accessorKey: 'name',
    header: 'Bezeichnung',
    cell: ({ row, getValue }) => (
      <ModalLink
        href={editUrl(row.original.id as number)}
        className="font-semibold hover:underline hover:text-primary"
      >
        <span>{getValue<string>()}</span>
      </ModalLink>
    )
  },
  {
    accessorKey: 'has_season_related_restrictions',
    header: '',
    cell: ({ getValue }) => (
      <div>
        {getValue<boolean>() === true ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <HugeiconsIcon icon={Alert02Icon} className="size-5 text-blue-500 mx-auto" />
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              Saisonelle Buchungsbeschränkungen
            </TooltipContent>
          </Tooltip>
        ) : (
          ''
        )}
      </div>
    )
  },
  {
    accessorKey: 'booking_mode',
    header: 'Buchungsmodus',
    cell: ({ getValue }) => <div>{getBookingMode(getValue<number>())}</div>
  },
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
            <TooltipContent className="px-2 py-1 text-xs">Standardsaison</TooltipContent>
          </Tooltip>
        ) : (
          ''
        )}
      </div>
    )
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
]
