/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type React from 'react'
import { useEffect } from 'react'
import { ScrollArea } from '@/Components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/Components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  footer?: React.ReactNode
  header?: React.ReactNode
  itemName?: string
  actionBar?: React.ReactNode
  filterBar?: React.ReactNode
  onSelectedRowsChange?: (selectedRows: TData[]) => void
}

export function DataTable<TData, TValue>({
  actionBar,
  columns,
  data,
  filterBar,
  footer,
  header,
  onSelectedRowsChange,
  itemName = 'Datensätze'
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  useEffect(() => {
    if (onSelectedRowsChange) {
      const selectedRowsData = table.getSelectedRowModel().rows.map(row => row.original)
      onSelectedRowsChange(selectedRowsData)
    }
  }, [table.getState().rowSelection, onSelectedRowsChange])

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="mx-2 flex-none">{header}</div>

      <div className="relative flex max-h-fit w-full flex-1 flex-col gap-1.5 overflow-hidden rounded-lg border border-border/80 bg-page-content p-1.5">
        {filterBar}
        <ScrollArea
          className="flex-1 min-h-0 rounded-md border bg-page-content"
          scroll-region=""
        >
          <Table className="table-fixed border-spacing-0 border-b-0 bg-background [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-border [&_th]:border-b [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
            <TableHeader className="rounded-t-md bg-sidebar">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="rounded-md border hover:bg-sidebar">
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className="text-foreground"
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="mt-12 mb-12">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="truncate text-foreground">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Keine {itemName} gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        {table.getSelectedRowModel().rows.length > 0 ? actionBar : null}
      </div>
      {footer && <div className="mx-2 flex-none">{footer}</div>}
    </div>
  )
}
