import type * as React from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { cn } from '@/Lib/utils'
import { Button } from '@dspangenberg/twcui'
import { Edit03Icon } from '@hugeicons/core-free-icons'

import {
  Table as ShadcnTable,
  TableBody as ShadcnTableBody,
  TableCell as ShadcnTableCell,
  TableHead as ShadcnTableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow
} from '@/Components/ui/table'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { usePage } from '@inertiajs/react'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 2
})

export interface InvoiceTableProps {
  invoice: App.Data.InvoiceData
  onEditLine: (lineId: number) => void  // Neuer Prop
}

export interface CommonTableProps {
  children: React.ReactNode
  className?: string
}

export const Table: React.FC<CommonTableProps> = ({ className = '', children }) => {
  return <ShadcnTable className={cn('w-full rounded-lg', className)}>{children}</ShadcnTable>
}

export const TableHeader: React.FC<CommonTableProps> = ({ className = '', children }) => {
  return <ShadcnTableHeader className={cn('', className)}>{children}</ShadcnTableHeader>
}

export const TableBody: React.FC<CommonTableProps> = ({ className = '', children }) => {
  return (
    <ShadcnTableBody className={cn('hover:bg-transparent', className)}>{children}</ShadcnTableBody>
  )
}

export const TableRow: React.FC<CommonTableProps> = ({ className = '', children }) => {
  return (
    <ShadcnTableRow className={cn('align-baseline hover:bg-transparent', className)}>
      {children}
    </ShadcnTableRow>
  )
}

interface TableCellProps {
  align?: 'left' | 'center' | 'right'
  colSpan?: number
  className?: string
  children?: React.ReactNode
}

export const TableHead: React.FC<TableCellProps> = ({
  align = 'left',
  className = '',
  colSpan = 0,
  children
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align]

  return (
    <ShadcnTableHead
      colSpan={colSpan}
      className={cn('align-middle font-medium bg-sidebar hover:bg-sidebar', alignClass, className)}
    >
      {children}
    </ShadcnTableHead>
  )
}

export const TableCell: React.FC<TableCellProps> = ({
  align = 'left',
  className = '',
  colSpan = 1,
  children
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align]

  return (
    <ShadcnTableCell
      colSpan={colSpan}
      className={cn('align-baseline bg-transparent hover:bg-transparent', alignClass, className)}
    >
      {children}
    </ShadcnTableCell>
  )
}

export interface TableNumberCellProps extends TableCellProps {
  value: number
  conditional?: boolean
}
export const TableNumberCell: React.FC<TableNumberCellProps> = ({
  conditional = false,
  align = 'right',
  className = '',
  value,
  ...props
}) => {
  const defaultClass = conditional ? '' : ''
  const formattedValue = currencyFormatter.format(value)
  const cellValue = conditional ? `(${formattedValue})` : formattedValue

  return (
    <TableCell align={align} className={cn(defaultClass, className)} {...props}>
      {cellValue}
    </TableCell>
  )
}

export interface TableMarkdownCellProps extends TableCellProps {
  value: string
}
export const TableMarkdownCell: React.FC<TableMarkdownCellProps> = ({
  className = '',
  value,
  ...props
}) => {
  return (
    <TableCell className={className} {...props}>
      <Markdown remarkPlugins={[remarkBreaks]}>{value}</Markdown>
    </TableCell>
  )
}

export interface InvoicingTableCommonRowProps {
  line: App.Data.InvoiceLineData
}

export interface InvoicingTableRowProps extends InvoicingTableCommonRowProps {
  getNextIndex: (lineType: number) => number | null
  onEditLine: (lineId: number) => void  // Neuer Prop
}

export interface InvoicingTableDefaultRowProps {
  line: App.Data.InvoiceLineData
  conditional?: boolean
  index: number | null
  onEditLine: (lineId: number) => void  // Neuer Prop
}

export const InvoicingTableDefaultRow: React.FC<InvoicingTableDefaultRowProps> = ({
  line,
  index,
  conditional = false,
  onEditLine
}) => {
  // @ts-ignore
  const { invoice } = usePage<App.Data.InvoiceData>().props as unknown as App.Data.InvoiceData


  return (
    <TableRow>
      <TableCell align="right" className="align-baseline">
        {index}
      </TableCell>
      <TableNumberCell value={line.quantity as unknown as number} />
      <TableCell align="center">{line.unit}</TableCell>
      <TableMarkdownCell value={line.text} />
      <TableNumberCell conditional={conditional} value={line.price} />
      <TableNumberCell value={line.amount} />
      <TableCell align="center">({line.tax_id})</TableCell>
      {invoice.is_draft && (
        <TableCell align="center">
          <Button
            size="icon-sm"
            icon={Edit03Icon}
            iconClassName="text-primary"
            variant="ghost"
            onClick={() => onEditLine(line.id)}  // Hier wird der Callback aufgerufen
          />
        </TableCell>
      )}
    </TableRow>
  )
}

export const InvoicingTableRow: React.FC<InvoicingTableRowProps> = ({ line, getNextIndex, onEditLine }) => {
  const conditional = line.type_id === 3
  const rowIndex = getNextIndex(line.type_id)

  // if (line.type_id === 9) return null

  if (line.type_id === 2) {
    return (
      <TableRow>
        <TableCell colSpan={3} />
        <TableCell colSpan={3} className="text-lg font-medium">
          {line.text}
        </TableCell>
      </TableRow>
    )
  }

  return <InvoicingTableDefaultRow line={line} conditional={conditional} index={rowIndex} onEditLine={onEditLine} />
}

export const InvoicingTable: React.FC<InvoiceTableProps> = ({ invoice, onEditLine }) => {
  const currentIndexRef = useRef(1)

  useEffect(() => {
    currentIndexRef.current = 1
  }, [])

  const getNextIndex = useCallback((lineType: number) => {
    if ([0, 1, 3].includes(lineType)) {
      const nextIndex = currentIndexRef.current
      currentIndexRef.current += 1
      return nextIndex
    }
    return null
  }, [])

  return (
    <div className="relative flex flex-1 border-border/80 bg-page-content rounded-lg p-1.5 border overflow-hidden flex-col max-h-fit">
      <Table className="bg-background [&_td]:border-border border rounded-lg [&_th]:border-border border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
        <TableHeader className="rounded-t-lg">
          <TableRow>
            <TableHead align="right">Pos</TableHead>
            <TableHead colSpan={2}>Menge</TableHead>
            <TableHead>Beschreibung</TableHead>
            <TableHead align="right">Einzelpreis</TableHead>
            <TableHead align="right">Gesamt</TableHead>
            <TableHead align="center">USt.</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody className="rounded-b-lg">
          {invoice.lines?.map((line, index) => (
            <InvoicingTableRow key={index} line={line} getNextIndex={getNextIndex} onEditLine={onEditLine} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
