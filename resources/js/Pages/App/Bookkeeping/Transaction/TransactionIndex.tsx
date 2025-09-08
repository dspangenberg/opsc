import {
  Csv02Icon,
  FileExportIcon,
  FileScriptIcon,
  MoreVerticalCircle01Icon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import { parseAsString, throttle, useQueryState } from 'nuqs'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { JollySearchField } from '@/Components/jolly-ui/search-field'
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
import { Tab, TabList, Tabs } from '@/Components/ui/twc-ui/tabs'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
import { TransactionMoneyMoneyImport } from '@/Pages/App/Bookkeeping/Transaction/TransactionMoneyMoneyImport'
import { TransactionSelectCounterAccountDialog } from '@/Pages/App/Bookkeeping/Transaction/TransactionSelectCounterAccount'
import type { PageProps } from '@/Types'
import { createColumns } from './TransactionIndexColumns'
import { TransactionIndexFilterForm } from './TransactionIndexFilterForm'

interface TransactionsPageProps extends PageProps {
  transactions: App.Data.Paginated.PaginationMeta<App.Data.TransactionData[]>
  bank_accounts: App.Data.BankAccountData[]
  bank_account: App.Data.BankAccountData
  bookkeeping_accounts: App.Data.BookkeepingAccountData[]
}
type FilterConfig = {
  filters: Record<string, { operator: string; value: any }>
  boolean?: 'AND' | 'OR'
}

const TransactionIndex: React.FC<TransactionsPageProps> = ({
  transactions,
  bank_account,
  bank_accounts,
  bookkeeping_accounts
}) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.TransactionData[]>([])
  const [showMoneyMoneyImport, setShowMoneyMoneyImport] = useState(false)

  // Search mit Debounce und shallow: false
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({
      limitUrlUpdates: throttle(250),
      clearOnDefault: true,
      shallow: false
    })
  )

  // Filters als JSON String mit throttle und shallow: false
  const [filtersString, setFiltersString] = useQueryState(
    'filters',
    parseAsString.withDefault('{}').withOptions({
      limitUrlUpdates: throttle(250),
      clearOnDefault: true,
      shallow: false
    })
  )

  // Parse JSON filters
  const filters = useMemo<FilterConfig>(() => {
    try {
      const parsed = JSON.parse(filtersString)
      return {
        filters: parsed.filters || {},
        boolean: parsed.boolean || 'AND'
      }
    } catch {
      return { filters: {}, boolean: 'AND' }
    }
  }, [filtersString])

  // Function to update filters
  const updateFilters = (newFilters: FilterConfig) => {
    setFiltersString(JSON.stringify(newFilters))
  }

  const handleFilter = () => {
    updateFilters({
      filters: {
        ...filters.filters,
        is_locked: {
          operator: '=',
          value: 0
        }
      }
    })
  }

  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }], [])

  const handeSetCounterAccountAction = async (transaction: App.Data.TransactionData) => {
    const promise = await TransactionSelectCounterAccountDialog.call({
      transaction,
      accounts: bookkeeping_accounts
    })
    if (promise !== false) {
      router.get(
        route('app.bookkeeping.transactions.set-counter-account', {
          _query: { ids: transaction.id, counter_account: promise }
        }),
        {
          preserveScroll: true
        }
      )
    }
  }

  const handlePaymentAction = (transaction: App.Data.TransactionData) => {
    router.get(route('app.bookkeeping.transactions.pay-invoice', { id: transaction.id }))
  }

  const columns = useMemo(
    () =>
      createColumns({
        onPaymentAction: handlePaymentAction,
        onSetCounterAccountAction: handeSetCounterAccountAction
      }),
    []
  )

  const handleBulkConfirmationClicked = () => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.get(route('app.bookkeeping.transactions.confirm', { _query: { ids } }), {
      preserveScroll: true
    })
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon}>
          <MenuItem title="Filter" onClick={handleFilter} />
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
          <MenuItem title="Regeln auf unbestägite Transaktionen anwenden" ellipsis />
        </DropdownButton>
      </Toolbar>
    ),
    []
  )
  const currentRoute = route().params.bank_account
  const selectedKey = currentRoute
    ? String(currentRoute)
    : bank_accounts[0]?.id
      ? String(bank_accounts[0].id)
      : undefined

  // Debug logging
  const tabs = useMemo(
    () => (
      <Tabs variant="underlined" selectedKey={selectedKey}>
        <TabList aria-label="Ansicht">
          {bank_accounts.map(account => (
            <Tab
              key={String(account.id)}
              id={String(account.id)}
              href={route(
                'app.bookkeeping.transactions.index',
                { bank_account: account.id },
                false
              )}
            >
              {account.name}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    ),
    [bank_accounts]
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
        <Button
          variant="ghost"
          size="auto"
          icon={Tick01Icon}
          title="als bestätigt markieren"
          onClick={handleBulkConfirmationClicked}
        />
        <div className="flex-1 text-right font-medium text-sm">x</div>
      </Toolbar>
    )
  }, [selectedRows.length])

  const footer = useMemo(() => <Pagination data={transactions} />, [transactions])

  const filterBar = useMemo(
    () => (
      <div className="flex">
        <JollySearchField
          aria-label="Suchen"
          placeholder="Nach Namen, Verwendungszweck oder IBAN suchen"
          value={search}
          onChange={value => {
            setSearch(value)
          }}
          className="w-sm"
        />
        <TransactionIndexFilterForm
          accounts={bookkeeping_accounts}
          filters={filters}
          onFiltersChange={updateFilters}
        />
      </div>
    ),
    [search, setSearch, bookkeeping_accounts, filters]
  )

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
      tabs={tabs}
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable<App.Data.TransactionData, unknown>
        columns={columns}
        actionBar={actionBar}
        onSelectedRowsChange={setSelectedRows}
        filterBar={filterBar}
        data={transactions.data}
        footer={footer}
        itemName="Transaktionen"
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
