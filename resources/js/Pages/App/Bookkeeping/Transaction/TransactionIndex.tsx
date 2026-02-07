import {
  Csv02Icon,
  FileExportIcon,
  FileScriptIcon,
  MoreVerticalCircle01Icon,
  AiBeautifyIcon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import { sumBy } from 'lodash'
import * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Menu, MenuItem, MenuPopover, MenuSubTrigger } from '@/Components/twc-ui/menu'
import { SearchField } from '@/Components/twc-ui/search-field'
import { Tab, TabList, Tabs } from '@/Components/twc-ui/tabs'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import { TransactionHolviImport } from '@/Pages/App/Bookkeeping/Transaction/TransactionHolviImport'
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
  currentFilters?: FilterConfig
  currentSearch?: string
}

type FilterConfig = {
  filters: Record<string, { operator: string; value: any }>
  boolean?: 'AND' | 'OR'
}

const TransactionIndex: React.FC<TransactionsPageProps> = ({
  transactions,
  bank_account,
  bank_accounts,
  bookkeeping_accounts,
  currentFilters = { filters: {}, boolean: 'AND' },
  currentSearch = ''
}) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.TransactionData[]>([])
  const [showMoneyMoneyImport, setShowMoneyMoneyImport] = useState(false)
  const [showHolviImport, setShowHolviImport] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number>(0)
  // Lokale State für Filter und Search
  const [filters, setFilters] = useState<FilterConfig>(currentFilters)
  const [search, setSearch] = useState(currentSearch)

  // Debounce für Search
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced Search Handler
  const debouncedSearchChange = useCallback(
    (newSearch: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(() => {
        router.post(
          route('app.bookkeeping.transactions.index', { bank_account: bank_account.id }),
          {
            filters: filters,
            search: newSearch
          },
          {
            preserveScroll: true,
            preserveState: true,
            only: ['transactions']
          }
        )
      }, 500) // 500ms Debounce
    },
    [filters, bank_account.id]
  )

  const handleFiltersChange = (newFilters: FilterConfig) => {
    router.post(
      route('app.bookkeeping.transactions.index', { bank_account: bank_account.id }),
      {
        filters: newFilters,
        search: search
      },
      {
        preserveScroll: true,
        preserveState: true,
        only: ['transactions'],
        onSuccess: () => {
          setFilters(newFilters)
        }
      }
    )
  }

  const handleSearchInputChange = (newSearch: string) => {
    setSearch(newSearch)
    debouncedSearchChange(newSearch)
  }

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const handleFilter = () => {
    const newFilters = {
      filters: {
        ...filters.filters,
        is_locked: {
          operator: '=',
          value: 0
        }
      },
      boolean: 'AND' as const
    }
    handleFiltersChange(newFilters)
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

  const columns = useMemo(
    () =>
      createColumns({
        onSetCounterAccountAction: handeSetCounterAccountAction,
        currentFilters: filters,
        currentSearch: search,
        bankAccountId: bank_account.id as number
      }),
    [filters, search, bank_account.id]
  )

  //

  const handleBulkConfirmationClicked = () => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.put(route('app.bookkeeping.transactions.confirm'), {
      ids,
      filters,
      search
    }, {
      preserveScroll: true
    })
  }

  const handleRunRulesClicked = () => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.put(route('app.bookkeeping.transactions.run-rules'), {
      ids,
      filters,
      search
    }, {
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
                <MenuItem
                  icon={Csv02Icon}
                  title="Holvi-CSV-Datei importieren"
                  ellipsis
                  onClick={() => setShowHolviImport(true)}
                />
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
    const sum = sumBy(selectedRows, 'amount')
    setSelectedAmount(sum)
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
        <Button
          variant="ghost"
          size="auto"
          icon={AiBeautifyIcon}
          title="Regeln anwenden"
          onClick={handleRunRulesClicked}
        />
        <div className="flex-1 text-right font-medium text-sm">{selectedAmount}</div>
      </Toolbar>
    )
  }, [selectedRows, selectedAmount])

  const footer = useMemo(() => <Pagination data={transactions} />, [transactions])

  const filterBar = useMemo(
    () => (
      <div className="flex">
        <SearchField
          aria-label="Suchen"
          placeholder="Nach Namen, Verwendungszweck oder IBAN suchen"
          value={search}
          onChange={handleSearchInputChange}
          className="w-sm"
        />
        <TransactionIndexFilterForm
          accounts={bookkeeping_accounts}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          bankAccountId={bank_account.id as number}
        />
      </div>
    ),
    [search, bookkeeping_accounts, filters, bank_account.id]
  )

  return (
    <PageContainer
      header={
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-none flex-col items-start gap-1">
            <h1 className="font-bold text-lg">{bank_account.name}</h1>
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

      <TransactionHolviImport
        isOpen={showHolviImport}
        onClosed={() => setShowHolviImport(false)}
        bank_account={bank_account}
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
