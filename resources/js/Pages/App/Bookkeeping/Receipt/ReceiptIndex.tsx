import {
  Delete02Icon,
  File02Icon,
  FileDownloadIcon,
  Invoice01Icon,
  MagicWand01Icon,
  PrinterIcon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import { sumBy } from 'lodash'
import type * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { DataTable, type DataTableRef } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { BookmarkMenu } from '@/Components/Shared/Bookmark/BookmarkMenu'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
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
  bookmark_model: string
  bookmarks: App.Data.BookmarkData[]
}

const ReceiptIndex: React.FC<ReceiptIndexPageProps> = ({
  bookmark_model,
  bookmarks,
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
  const tableRef = useRef<DataTableRef>(null)
  // Debounce für Search
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }, { title: 'Belege' }], [])

  const handleBulkConfirmationClicked = useCallback(() => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.put(
      route('app.bookkeeping.receipts.lock'),
      { ids },
      {
        preserveScroll: true,
        onSuccess: () => {
          setSelectedRows([])
        }
      }
    )
  }, [selectedRows])

  const handleBulkDeleteClicked = useCallback(async () => {
    const confirmed = await AlertDialog.call({
      title: 'Ausgewählte Belege löschen',
      message: `Möchtest Du die ausgewählten  (${selectedRows.length}) Belege wirklich in den Papierkorb verschieben?`,
      buttonTitle: 'In Papierkorb verschieben'
    })
    if (confirmed) {
      const ids = selectedRows.map(row => row.id).join(',')
      router.delete(route('app.bookkeeping.receipts.bulk-delete', { _query: { ids } }), {
        preserveScroll: true,
        onSuccess: () => tableRef.current?.resetRowSelection()
      })
    }
  }, [selectedRows])

  const handleBulkDownloadClicked = useCallback(() => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.get(route('app.bookkeeping.bulk-download', { _query: { ids } }), {
      preserveScroll: true
    })
  }, [selectedRows])

  const handleBulkRuleClicked = useCallback(() => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.put(
      route('app.bookkeeping.receipts.rule', { _query: { ids } }),
      {},
      {
        preserveScroll: true,
        onSuccess: () => tableRef.current?.resetRowSelection()
      }
    )
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
      router.get(
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
        router.get(
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

  const handleBookmarkUpdate = () => {
    router.reload({ only: ['bookmarks'] })
  }

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
        <Button
          variant="ghost-destructive"
          size="auto"
          icon={Delete02Icon}
          title="Löschen"
          onClick={handleBulkDeleteClicked}
        />
        <div className="flex-1 text-right font-medium text-sm">{selectedAmount}</div>
      </Toolbar>
    )
  }, [
    selectedRows,
    selectedAmount,
    handleBulkConfirmationClicked,
    handleBulkRuleClicked,
    handleBulkDeleteClicked,
    handleBulkDownloadClicked
  ])

  const filterBar = useMemo(
    () => (
      <Toolbar className="px-1">
        <SearchField
          aria-label="Suchen"
          placeholder="Nach Referenz suchen"
          value={search}
          onChange={handleSearchInputChange}
          className="w-xs"
        />
        <BookmarkMenu
          bookmarks={bookmarks}
          icon={Invoice01Icon}
          model={bookmark_model}
          onUpdate={handleBookmarkUpdate}
        />
        <ReceiptIndexFilterForm
          contacts={contacts}
          currencies={currencies}
          cost_centers={cost_centers}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </Toolbar>
    ),
    [
      search,
      filters,
      contacts,
      currencies,
      cost_centers,
      handleSearchInputChange,
      handleFiltersChange,
      bookmarks,
      bookmark_model
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
          ref={tableRef}
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
