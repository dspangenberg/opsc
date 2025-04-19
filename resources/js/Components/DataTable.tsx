/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/Components/ui/table'
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ScrollArea } from '@/Components/ui/scroll-area'
import type React from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  footer?: React.ReactNode
  header?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  footer,
  header
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <>
      <div className="flex-1 flex  border-border/80 bg-background rounded-lg p-1.5 shadow-md border overflow-hidden h-full flex-col">
        <div className="flex-none">{header}</div>
        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className="flex-1 border rounded-md max-h-fit bg-page-content">
            <Table className=" bg-background [&_td]:border-border border-b [&_th]:border-border table-fixed border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
              <TableHeader className="rounded-t-md bg-sidebar ">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className="hover:bg-sidebar border rounded-md">
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead
                          key={header.id}
                          className="text-foreground"
                          style={{ width: `${header.getSize()}px` }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                    <TableHead />
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
                      <TableCell />
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        {footer}
      </div>
    </>
  )
}
