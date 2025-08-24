import {
  Add01Icon,
  Csv02Icon,
  Delete02Icon,
  DocumentValidationIcon,
  Edit03Icon,
  EuroReceiveIcon,
  FileDownloadIcon,
  FileEditIcon,
  FileExportIcon,
  FileRemoveIcon,
  FileScriptIcon,
  MoreVerticalCircle01Icon,
  PrinterIcon,
  RepeatIcon,
  Sent02Icon,
  UnavailableIcon
} from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import {
  DropdownButton,
  Menu,
  MenuItem,
  MenuPopover,
  MenuSubTrigger
} from '@/Components/twcui/dropdown-button'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/twc-ui/button'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
import { TransactionMoneyMoneyImport } from '@/Pages/App/Bookkeeping/Transaction/TransactionMoneyMoneyImport'
import type { PageProps } from '@/Types'
import { columns } from './TransactionIndexColumns'

interface TransactionsPageProps extends PageProps {
  transactions: App.Data.Paginated.PaginationMeta<App.Data.TransactionData[]>
  bank_accounts: App.Data.BankAccountData[]
  bank_account: App.Data.BankAccountData
}

const TransactionIndex: React.FC<TransactionsPageProps> = ({
  transactions,
  bank_account,
  bank_accounts
}) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.TimeData[]>([])
  const [showMoneyMoneyImport, setShowMoneyMoneyImport] = useState(false)
  // Verwende currentFilters als Ausgangswert

  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }], [])

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon}>
          <MenuSubTrigger>
            <MenuItem title="Daten importieren" />
            <MenuPopover>
              <Menu>
                <MenuItem
                  icon={FileScriptIcon}
                  title="MoneyMoney JSON-Datei importieren"
                  ellipsis
                  separator
                  onClick={() => setShowMoneyMoneyImport(true)}
                />
                <MenuItem icon={Csv02Icon} title="CSV-Datei importieren" ellipsis />
              </Menu>
            </MenuPopover>
          </MenuSubTrigger>
          <MenuItem icon={FileExportIcon} title="CSV-Export" separator />
          <MenuItem title="Regeln anwenden" ellipsis />
        </DropdownButton>
      </Toolbar>
    ),
    []
  )

  const actionBar = useMemo(() => {
    return (
      <Toolbar variant="secondary" className="px-4 pt-2">
        <div className="self-center text-sm">
          <Badge variant="outline" className="mr-1.5 bg-background">
            {selectedRows.length}
          </Badge>
          ausgewählte Datensätze
        </div>
        <Button variant="ghost" size="auto" icon={FileDownloadIcon} title="Herunterladen" />
        <div className="flex-1 text-right font-medium text-sm">x</div>
      </Toolbar>
    )
  }, [selectedRows.length])

  const currentRoute = route().current()
  const footer = useMemo(() => <Pagination data={transactions} />, [transactions])

  return (
    <PageContainer
      header={
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-none flex-col items-start gap-1">
            <h1 className="font-bold text-xl">{bank_account.name}</h1>
            <div className="text-muted-foreground text-sm">{bank_account.iban}</div>
          </div>
        </div>
      }
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable
        columns={columns}
        actionBar={actionBar}
        onSelectedRowsChange={setSelectedRows}
        data={transactions.data}
        footer={footer}
        itemName="Zeiten"
      />
      <TransactionMoneyMoneyImport
        isOpen={showMoneyMoneyImport}
        onClosed={() => setShowMoneyMoneyImport(false)}
        bank_account={bank_account}
      />
    </PageContainer>
  )
}

export default TransactionIndex
