/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { CheckLineIcon, Delete03Icon, MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { Link } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { StatusIcon } from '@/Components/twc-ui/status-icon'

const editUrl = (id: number | null) =>
  id ? route('app.bookkeeping.bank-account.edit', { bank_account: id }) : '#'

const RowActions = ({ row }: { row: Row<App.Data.BankAccountData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={CheckLineIcon}
          separator
          title="Als Standardkonto setzen"
          isDisabled={row.original.is_default}
          onAction={() => setDefaultAccount(row.original)}
        />
        <MenuItem
          icon={Delete03Icon}
          title="Löschen"
          variant="destructive"
          isDisabled={row.original.is_default}
          onAction={() => deleteBankAccount(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

const deleteBankAccount = async (row: App.Data.BankAccountData) => {
  const promise = await AlertDialog.call({
    title: 'Bankkonto löschen',
    message: `Möchtest Du das Bankkonto ${row.name} wirklich löschen?`,
    buttonTitle: 'Bankkonto löschen'
  })
  if (promise) {
    router.delete(route('app.bookkeeping.bank-account.destroy', { bank_account: row.id }))
  }
}

const setDefaultAccount = async (row: App.Data.BankAccountData) => {
  router.put(route('app.bookkeeping.bank-account.set-default', { bank_account: row.id }))
}

export const columns: ColumnDef<App.Data.BankAccountData>[] = [
  {
    accessorKey: 'is_default',
    header: '',
    size: 20,
    cell: ({ row }) => {
      if (row.original.is_default) {
        return (
          <div className="mx-auto flex items-center justify-center">
            <StatusIcon variant="success" size="default" />
          </div>
        )
      } else {
        if (row.original.is_closed) {
          return (
            <div className="mx-auto flex items-center justify-center">
              <StatusIcon variant="destructive" size="default" />
            </div>
          )
        }
      }
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    size: 200,
    cell: ({ row, getValue }) => (
      <Link
        href={editUrl(row.original.id)}
        className="truncate align-middle font-medium hover:underline"
      >
        {getValue() as string}
      </Link>
    )
  },
  {
    accessorKey: 'iban',
    header: 'IBAN',
    size: 100,
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.is_paypal ? (
          <span>{row.original.email}</span>
        ) : (
          <span>{row.original.iban}</span>
        )}
      </div>
    )
  },
  {
    accessorKey: 'bic',
    header: 'BIC',
    size: 80,
    cell: ({ getValue }) => <div>{getValue() as string}</div>
  },
  {
    accessorKey: 'bank_name',
    header: 'Bank',
    size: 100,
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.is_paypal ? <span>Paypal</span> : <span>{row.original.bank_name}</span>}
      </div>
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
