import {
  FileDownloadIcon,
  MagicWand01Icon,
  PrinterIcon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import { sumBy } from 'lodash'
import type * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { PdfViewer } from '@/Components/twc-ui/pdf-viewer'
import { SearchField } from '@/Components/twc-ui/search-field'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import { ReceiptIndexFilterForm } from '@/Pages/App/Bookkeeping/Receipt/ReceiptIndexFilterForm'
import type { PageProps } from '@/Types'
import { columns } from './ReceiptIndexColumns'

type FilterConfig = {
  filters: Record<string, { operator: string; value: any }>
  boolean?: 'AND' | 'OR'
}
interface ReceiptIndexPageProps extends PageProps {
  receipts: App.Data.Paginated.PaginationMeta<App.Data.ReceiptData[]>
  contacts: App.Data.ContactData[]
  cost_centers: App.Data.CostCenterData[]
  currencies: App.Data.CurrencyData[]
  currentFilters: FilterConfig
  currentSearch: string
}

const ReceiptIndex: React.FC<ReceiptIndexPageProps> = ({
  contacts,
  cost_centers,
  currencies,
  currentFilters,
  currentSearch,
  receipts
}) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.ReceiptData[]>([])
  const [selectedAmount, setSelectedAmount] = useState<number>(0)
  const [filters, setFilters] = useState<FilterConfig>(currentFilters)
  const [search, setSearch] = useState(currentSearch)

  // Debounce für Search
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }, { title: 'Belege' }], [])

  const handleBulkConfirmationClicked = useCallback(() => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.put(route('app.bookkeeping.receipts.lock'), {ids}, {
      preserveScroll: true
    })
  }, [selectedRows])

  const handleBulkRuleClicked = useCallback(() => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.get(route('app.bookkeeping.receipts.rule', { _query: { ids } }), {
      preserveScroll: true
    })
  }, [selectedRows])

  const handleBulkDownloadClicked = useCallback(() => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.get(route('app.bookkeeping.bulk-download', { _query: { ids } }), {
      preserveScroll: true
    })
  }, [selectedRows])

  const handlePrint = useCallback(async () => {
    const url = route('app.bookkeeping.receipts.print', {
      filters: filters.filters,
      boolean: filters.boolean || 'AND',
      search: search
    })

    await PdfViewer.call({
      file: url
    })
  }, [search, filters.filters, filters.boolean])

  const handleFiltersChange = useCallback(
    (newFilters: FilterConfig) => {
      router.post(
        route('app.bookkeeping.receipts.index'),
        {
          ...newFilters,
          search: search
        },
        {
          preserveScroll: true,
          preserveState: true,
          only: ['receipts'],
          onSuccess: () => {
            setFilters(newFilters)
          }
        }
      )
    },
    [search]
  )

  const debouncedSearchChange = useCallback(
    (newSearch: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(() => {
        router.post(
          route('app.bookkeeping.receipts.index'),
          {
            ...filters,
            search: newSearch
          },
          {
            preserveScroll: true,
            preserveState: true,
            only: ['receipts']
          }
        )
      }, 500) // 500ms Debounce
    },
    [filters]
  )

  const handleSearchInputChange = useCallback(
    (newSearch: string) => {
      setSearch(newSearch)
      debouncedSearchChange(newSearch)
    },
    [debouncedSearchChange]
  )

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button variant="ghost" icon={PrinterIcon} title="Drucken" onClick={handlePrint} />
      </Toolbar>
    ),
    [handlePrint]
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
          icon={MagicWand01Icon}
          title="Regeln anwenden"
          onClick={handleBulkRuleClicked}
        />
        <Button
          variant="ghost"
          size="auto"
          icon={FileDownloadIcon}
          title="Download"
          onClick={handleBulkDownloadClicked}
        />
        <div className="flex-1 text-right font-medium text-sm">{selectedAmount}</div>
      </Toolbar>
    )
  }, [
    selectedRows,
    selectedAmount,
    handleBulkConfirmationClicked,
    handleBulkRuleClicked,
    handleBulkDownloadClicked
  ])

  const filterBar = useMemo(
    () => (
      <div className="flex gap-2">
        <SearchField
          aria-label="Suchen"
          placeholder="Nach Referenz suchen"
          value={search}
          onChange={handleSearchInputChange}
          className="w-sm"
        />
        <ReceiptIndexFilterForm
          contacts={contacts}
          currencies={currencies}
          cost_centers={cost_centers}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    ),
    [
      search,
      filters,
      contacts,
      currencies,
      cost_centers,
      handleSearchInputChange,
      handleFiltersChange
    ]
  )

  const footer = useMemo(() => {
    return <Pagination data={receipts} />
  }, [receipts])

  return (
    <PageContainer title="Belege" width="7xl" breadcrumbs={breadcrumbs} toolbar={toolbar}>
      <div>
        <DataTable
          columns={columns}
          filterBar={filterBar}
          actionBar={actionBar}
          onSelectedRowsChange={setSelectedRows}
          data={receipts.data || []}
          footer={footer}
          itemName="Belege"
        />
      </div>
    </PageContainer>
  )
}

export default ReceiptIndex
