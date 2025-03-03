/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
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
import { format, parse } from 'date-fns'
import { Fragment, useMemo } from 'react'
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface PeriodsByYear {
  [year: string]: App.Data.SeasonPeriodData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    // @ts-ignore
    getRowCanExpand: (row) => Boolean(row.original.periods?.length),
    getCoreRowModel: getCoreRowModel(),
  });

  const getPeriodsByYear = useMemo(() => (season: App.Data.SeasonData): PeriodsByYear => {
    if (!season.periods) return {};
    return season.periods.reduce((acc, period) => {
      const year = format(parse(period.begin_on, 'dd.MM.yyyy', new Date()), 'yyyy');
      if (!acc[year]) acc[year] = [];
      acc[year].push(period);
      return acc;
    }, {} as PeriodsByYear);
  }, []);




  const renderExpandedRow = (row: any) => (
    <TableRow>
      <TableCell colSpan={3} />
      <TableCell colSpan={row.getVisibleCells().length - 3}>
        <div className="items-start py-2 text-sm text-foreground/80  space-y-1">
          {Object.entries(getPeriodsByYear(row.original as App.Data.SeasonData)).map(([year, periods]) => (
            <div key={year} className="flex">
              <div className="font-bold mr-2 w-12">{year}</div>
              <div className="grid grid-cols-4 gap-2 flex-1">
                {periods.map((period) => (
                  <div key={period.id}>
                    {period.begin_on} - {period.end_on}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && renderExpandedRow(row)}
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Keine Ergebnisse
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
