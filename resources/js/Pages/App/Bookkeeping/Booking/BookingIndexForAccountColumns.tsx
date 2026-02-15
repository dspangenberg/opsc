/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  CancelCircleHalfDotIcon,
  MoreVerticalCircle01Icon,
  PencilEdit02Icon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { Link, router } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { Focusable } from 'react-aria-components'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Icon } from '@/Components/twc-ui/icon'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Tooltip, TooltipTrigger } from '@/Components/twc-ui/tooltip'
import { Badge } from '@/Components/ui/badge'
import { Checkbox } from '@/Components/ui/checkbox'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

interface ColumnOptions {
  onEditAccounts?: (row: App.Data.BookkeepingBookingData) => void
  currentFilters?: any
  currentSearch?: string
}

export const createColumns = (
  options?: ColumnOptions
): ColumnDef<App.Data.BookkeepingBookingData>[] => {
  const handleConfirmClicked = async (row: App.Data.BookkeepingBookingData) => {
    router.put(route('app.bookkeeping.bookings.confirm', { _query: { ids: row.id } }), {
      preserveScroll: true
    })
  }

  const handleCancelClicked = async (row: App.Data.BookkeepingBookingData) => {
    const confirmed = await AlertDialog.call({
      title: 'Ausgewählte Buchung stornieren',
      message: `Möchtest Du die Buchung  (${row.document_number}) wirklich stornieren?`,
      buttonTitle: 'Stornieren'
    })
    if (confirmed) {
      router.put(
        route('app.bookkeeping.bookings.cancel', { booking: row.id }),
        {},
        {
          preserveScroll: true
        }
      )
    }
  }

  const RowActions = ({ row }: { row: Row<App.Data.BookkeepingBookingData> }) => {
    return (
      <div className="mx-auto">
        <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
          <MenuItem
            icon={Tick01Icon}
            title="Buchung als bestätigt markieren"
            isDisabled={row.original.is_locked}
            separator
            onAction={() => handleConfirmClicked(row.original)}
          />
          <MenuItem
            icon={CancelCircleHalfDotIcon}
            separator
            title="Buchung stornieren"
            isDisabled={!!row.original.canceled_id || row.original.is_canceled}
            onAction={() => handleCancelClicked(row.original)}
          />
          <MenuItem
            icon={PencilEdit02Icon}
            separator
            isDisabled={row.original.is_locked}
            title="Konten bearbeiten"
            onAction={() => options?.onEditAccounts?.(row.original)}
          />
        </DropdownButton>
      </div>
    )
  }

  const accountIndexUrl = (accountNumber: number, filters?: any) => {
    if (!accountNumber) return '#'

    const params: any = { accountNumber }
    if (filters?.filters?.issuedBetween) {
      params._query = { filters }
    }

    return route('app.bookkeeping.bookings.account', params)
  }

  return [
    {
      id: 'select',
      size: 30,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          className="mx-3 bg-background align-middle"
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            className="mx-3 bg-background align-middle"
            aria-label="Select row"
          />
        </div>
      )
    },
    {
      accessorKey: 'date',
      header: 'Datum',
      size: 70,
      cell: ({ getValue }) => (
        <div>
          <span>{getValue() as string}</span>
        </div>
      )
    },
    {
      accessorKey: 'is_locked',
      header: '',
      size: 5,
      cell: ({ row }) => {
        if (row.original.is_canceled) {
          return (
            <div className="mx-auto flex size-4 items-center justify-center rounded-full bg-red-500">
              <Icon
                icon={CancelCircleHalfDotIcon}
                className="size-3.5 text-white"
                strokeWidth={4}
              />
            </div>
          )
        }
        if (row.original.is_locked) {
          return (
            <div className="mx-auto flex size-4 items-center justify-center rounded-full bg-green-500">
              <Icon icon={Tick01Icon} className="size-3.5 text-white" strokeWidth={4} />
            </div>
          )
        }
      }
    },
    {
      accessorKey: 'document_number',
      header: '',
      size: 90,
      cell: ({ getValue, row }) => {
        if (row.original.bookable_type === 'App\\Models\\Receipt') {
          return (
            <Link
              href={route('app.bookkeeping.receipts.edit', { receipt: row.original.bookable_id })}
            >
              <div className="text-xs">
                <Badge variant="outline">{getValue() as string}</Badge>
              </div>
            </Link>
          )
        }
        if (row.original.bookable_type === 'App\\Models\\Invoice') {
          return (
            <Link href={route('app.invoice.details', { invoice: row.original.bookable_id })}>
              <div className="text-xs">
                <Badge variant="outline">{getValue() as string}</Badge>
              </div>
            </Link>
          )
        }
        return (
          <div className="text-xs">
            <Badge variant="outline">{getValue() as string}</Badge>
          </div>
        )
      }
    },
    {
      accessorKey: 'booking_text',
      header: 'Buchungstext',
      size: 300,
      cell: ({ row }) => {
        const [bookingType, name, purpose, conversion] = row.original.booking_text.split('|')
        return (
          <div>
            <div className="text-foreground/80 text-xs">
              #{row.original.id} &mdash; {bookingType}
            </div>
            <div className="truncate font-medium">{name}</div>
            <div className="truncate">{purpose}</div>
            {conversion && <div className="text-foreground/80 text-xs">{conversion}</div>}
          </div>
        )
      }
    },
    {
      accessorKey: 'counter_account_label',
      header: 'GK-Nr. ',
      size: 50,
      cell: ({ row }) => (
        <TooltipTrigger>
          <Focusable aria-label="Gegenkonto">
            <Link
              href={accountIndexUrl(
                row.original.counter_account as number,
                options?.currentFilters
              )}
              className="truncate hover:underline"
            >
              {row.original.counter_account}
            </Link>
          </Focusable>
          <Tooltip>{row.original.counter_account_label}</Tooltip>
        </TooltipTrigger>
      )
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Brutto</div>,
      size: 70,
      cell: ({ row }) => (
        <div className="text-right">
          {currencyFormatter.format(row.original.amount)}{' '}
          {row.original.balance_type === 'debit' ? 'S' : 'H'}
        </div>
      )
    },
    {
      accessorKey: 'amount_net',
      header: () => <div className="text-right">Netto</div>,
      size: 70,
      cell: ({ row }) => (
        <div className="text-right">
          {currencyFormatter.format(row.original.amount_net ?? 0)}{' '}
          {row.original.balance_type === 'debit' ? 'S' : 'H'}
        </div>
      )
    },
    {
      accessorKey: 'balance',
      header: () => <div className="text-right">Saldo</div>,
      size: 70,
      cell: ({ row }) => {
        const balance = row.original.balance ?? 0
        const absBalance = Math.abs(balance)
        const indicator = balance >= 0 ? 'S' : 'H'

        return (
          <div className="text-right font-medium">
            {currencyFormatter.format(absBalance)} {indicator}
          </div>
        )
      }
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Soll</div>,
      size: 70,
      cell: ({ row }) => {
        // Zeige Betrag nur wenn dieses Konto im Soll steht
        if (row.original.balance_type !== 'debit') return null

        return <div className="text-right">{currencyFormatter.format(row.original.amount)}</div>
      }
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Haben</div>,
      size: 70,
      cell: ({ row }) => {
        // Zeige Betrag nur wenn dieses Konto im Haben steht
        if (row.original.balance_type !== 'credit') return null

        return <div className="text-right">{currencyFormatter.format(row.original.amount)}</div>
      }
    },
    {
      accessorKey: 'tax',
      header: () => <div className="text-right">USt.</div>,
      size: 40,
      cell: ({ row }) => <div className="text-right">{row.original.tax?.value || 0} %</div>
    },
    {
      accessorKey: 'tax_debit',
      header: () => <div className="text-right">USt. S</div>,
      size: 50,
      cell: ({ row }) => (
        <div className="text-right">{currencyFormatter.format(row.original.tax_debit)}</div>
      )
    },
    {
      accessorKey: 'tax_credit',
      header: () => <div className="text-right">USt. H</div>,
      size: 50,
      cell: ({ row }) => (
        <div className="text-right">{currencyFormatter.format(row.original.tax_credit)}</div>
      )
    },
    {
      id: 'actions',
      size: 30,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions row={row} />,
      enableHiding: false
    }
  ]
}

// Backward compatibility export
export const columns = createColumns()
