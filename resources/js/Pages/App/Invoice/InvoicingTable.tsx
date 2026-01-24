import { Delete03Icon, MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'
import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import {
  Table as ShadcnTable,
  TableBody as ShadcnTableBody,
  TableCell as ShadcnTableCell,
  TableHead as ShadcnTableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow
} from '@/Components/ui/table'
import { cn } from '@/Lib/utils'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 2
})

export interface LineCommandProps {
  command: string
  lineId?: number
}

export interface InvoiceTableProps {
  invoice: App.Data.InvoiceData
  onLineCommand: (line: LineCommandProps) => void
}

export interface CommonTableProps {
  children: React.ReactNode
  className?: string
}

export const Table: React.FC<CommonTableProps> = ({ className = '', children }) => {
  return <ShadcnTable className={cn('w-full rounded-lg', className)}>{children}</ShadcnTable>
}

export const TableHeader: React.FC<CommonTableProps> = ({ className = '', children }) => {
  return <ShadcnTableHeader className={cn('rounded-t-lg', className)}>{children}</ShadcnTableHeader>
}

export const TableBody: React.FC<CommonTableProps> = ({ className = '', children }) => {
  return (
    <ShadcnTableBody className={cn('rounded-b-lg hover:bg-transparent', className)}>
      {children}
    </ShadcnTableBody>
  )
}

export const TableRow: React.FC<CommonTableProps> = ({ className = '', children }) => {
  return (
    <ShadcnTableRow
      className={cn(
        'align-baseline first:rounded-t-lg last:rounded-b-lg hover:bg-transparent',
        className
      )}
    >
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
      className={cn(
        'rounded-t-lg bg-sidebar align-middle font-medium hover:bg-sidebar',
        alignClass,
        className
      )}
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
      className={cn(
        'bg-transparent align-baseline leading-normal hover:bg-transparent',
        alignClass,
        className
      )}
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
  service_period_begin?: string
  service_period_end?: string
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
  onLineCommand: (line: LineCommandProps) => void
  pos?: number
}

export interface InvoicingTableDefaultRowProps {
  line: App.Data.InvoiceLineData
  conditional?: boolean
  index: number | null
  pos: number
  onLineCommand: (line: LineCommandProps) => void
}

export const InvoicingTableDefaultRow: React.FC<InvoicingTableDefaultRowProps> = ({
  line,
  conditional = false,
  pos
}) => {
  return (
    <TableRow className="border-0">
      <TableCell align="right" className="align-baseline">
        {pos}
      </TableCell>
      <TableNumberCell value={line.quantity || 0} />
      <TableCell align="center">{line.unit}</TableCell>
      <TableMarkdownCell
        value={line.text}
        className="gap-0 gap-y-0 space-y-0"
        service_period_begin={line.service_period_begin as unknown as string}
        service_period_end={line.service_period_end as unknown as string}
      />
      <TableNumberCell conditional={conditional} value={line.price || 0} />
      <TableNumberCell value={line.amount || 0} />
      <TableCell align="center">({line.tax_rate_id})</TableCell>
      <TableCell />
    </TableRow>
  )
}

export const InvoicingTableLinkedInvoiceRow: React.FC<InvoicingTableDefaultRowProps> = ({
  line,
  onLineCommand
}) => {
  // @ts-expect-error
  const { invoice } = usePage<App.Data.InvoiceData>().props as unknown as App.Data.InvoiceData

  const handleDelete = useCallback(() => {
    onLineCommand({ command: 'delete', lineId: line.id || 0 })
  }, [onLineCommand, line.id])
  return (
    <TableRow>
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell>
        Rechnung Nr. {line.linked_invoice?.formated_invoice_number} vom{' '}
        {line.linked_invoice?.issued_on}
      </TableCell>
      <TableNumberCell conditional value={line.tax || 0} />
      <TableNumberCell value={line.amount || 0} />
      <TableCell align="center">EUR</TableCell>
      {invoice.is_draft && (
        <TableCell align="right">
          <div className="flex items-center justify-end space-x-1">
            <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
              <MenuItem
                icon={Delete03Icon}
                variant="destructive"
                title="Löschen"
                ellipsis
                onClick={handleDelete}
              />
            </DropdownButton>
          </div>
        </TableCell>
      )}
    </TableRow>
  )
}

export const InvoicingTableRow: React.FC<InvoicingTableRowProps> = ({
  line,
  pos = 0,
  getNextIndex,
  onLineCommand
}) => {
  const conditional = line.type_id === 3
  const rowIndex = getNextIndex(line.type_id)

  if (line.type_id === 2) {
    return (
      <TableRow>
        <TableCell colSpan={3} />
        <TableCell colSpan={3} className="font-medium text-lg">
          {line.text}
        </TableCell>
        <TableCell colSpan={3} />
      </TableRow>
    )
  }

  if (line.type_id === 4) {
    return (
      <TableRow>
        <TableCell colSpan={3} />
        <TableMarkdownCell value={line.text} colSpan={3} />
        <TableCell colSpan={3} />
      </TableRow>
    )
  }

  if (line.type_id === 8) {
    return (
      <TableRow className="border-t [&_th]:border-t [&_th]:border-dashed">
        <TableHead align="right">Pos</TableHead>
        <TableHead colSpan={2}>Menge</TableHead>
        <TableHead>Beschreibung</TableHead>
        <TableHead align="right">Einzelpreis</TableHead>
        <TableHead align="right">Gesamt</TableHead>
        <TableHead align="center">USt.</TableHead>
        <TableHead />
      </TableRow>
    )
  }

  if (line.type_id === 9) {
    return null
  }

  return (
    <InvoicingTableDefaultRow
      line={line}
      pos={pos}
      conditional={conditional}
      index={rowIndex}
      onLineCommand={onLineCommand}
    />
  )
}

export const InvoicingTable: React.FC<InvoiceTableProps> = ({ invoice, onLineCommand }) => {
  const currentIndexRef = useRef(1)

  useEffect(() => {
    currentIndexRef.current = 1
  }, [])

  let pos = 0
  let subtotal = 0

  const getNextIndex = useCallback((lineType: number) => {
    if ([0, 1, 3].includes(lineType)) {
      const nextIndex = currentIndexRef.current
      currentIndexRef.current += 1
      return nextIndex
    }
    return null
  }, [])

  const nextPos = (line: App.Data.InvoiceLineData) => {
    if ([1, 3].includes(line.type_id)) pos += 1
    subtotal += line.amount || 0
    return pos
  }

  return (
    <div className="relative flex max-h-fit flex-1 flex-col overflow-hidden rounded-lg border border-border/80 bg-page-content p-1.5">
      <Table className="border-spacing-0 rounded-lg border bg-background [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-border [&_th]:border-b [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
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
          {invoice.lines
            ?.filter(line => line.type_id !== 9)
            .map((line, index) => (
              <InvoicingTableRow
                key={index}
                pos={nextPos(line)}
                line={line}
                getNextIndex={getNextIndex}
                onLineCommand={onLineCommand}
              />
            ))}
        </TableBody>
        {invoice.lines && invoice.lines.filter(line => line.type_id === 9).length > 0 && (
          <>
            <TableBody className="rounded-b-lg border-t">
              <TableRow className="font-medium">
                <TableCell colSpan={3} />
                <TableCell>Zwischensumme</TableCell>
                <TableCell />
                <TableNumberCell value={subtotal || 0} />
                <TableCell align="center">EUR</TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
            <TableHeader className="rounded-t-lg border-t">
              <TableRow>
                <TableHead />
                <TableHead />
                <TableHead />
                <TableHead className="font-medium">abzüglich Akontorechnung/en</TableHead>
                <TableHead className="font-medium" align="right">
                  USt.
                </TableHead>
                <TableHead className="font-medium" align="right">
                  netto
                </TableHead>
                <TableHead />
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lines
                ?.filter(line => line.type_id === 9)
                .map((line, index) => (
                  <InvoicingTableLinkedInvoiceRow
                    key={index}
                    index={index}
                    pos={0}
                    line={line}
                    onLineCommand={onLineCommand}
                  />
                ))}
            </TableBody>
          </>
        )}
      </Table>
    </div>
  )
}
