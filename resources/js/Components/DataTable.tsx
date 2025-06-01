/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ScrollArea } from '@/Components/ui/scroll-area'
import type React from 'react'
import { useEffect } from 'react'

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
    <div className="flex-1 flex  overflow-hidden h-full flex-col ">
      <div className="flex-none mx-2">{header}</div>

        <div className="relative flex flex-1 border-border/80 bg-page-content rounded-lg p-1.5 border overflow-hidden flex-col max-h-fit">
          {filterBar}
          <ScrollArea className="flex-1 border rounded-md max-h-fit bg-page-content absolute top-0 bottom-0 left-0 right-0 overflow-scroll">
            <Table className="bg-background [&_td]:border-border border-b-0 [&_th]:border-border table-fixed border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
              <TableHeader className="rounded-t-md bg-sidebar">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className="hover:bg-sidebar border rounded-md">
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
                        <TableCell key={cell.id} className="text-foreground truncate">
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
      {footer && <div className="flex-none mx-2">{footer}</div>}
    </div>
  )
}
