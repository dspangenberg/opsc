import {
  CreditCardChangeIcon,
  FileExportIcon,
  MoreVerticalCircle01Icon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { DataTable, type DataTableRef } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { SearchField } from '@/Components/twc-ui/search-field'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import { useFileDownload } from '@/Hooks/use-file-download'
import type { FilterConfig } from '@/Lib/FilterHelper'
import { BookingEditAccounts } from '@/Pages/App/Bookkeeping/Booking/BookingEditAccounts'
import { BookingIndexFilterForm } from '@/Pages/App/Bookkeeping/Booking/BookingIndexFilterForm'
import type { PageProps } from '@/Types'
import { createColumns } from './BookingIndexColumns'

interface TransactionsPageProps extends PageProps {
  bookings: App.Data.Paginated.PaginationMeta<App.Data.BookkeepingBookingData[]>
  accounts: App.Data.BookkeepingAccountData[]
  currentSearch?: string
  currentFilters?: FilterConfig
}

const BookingIndex: React.FC<TransactionsPageProps> = ({
  accounts,
  bookings,
  currentFilters = { filters: {}, boolean: 'AND' },
  currentSearch
}) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.BookkeepingBookingData[]>([])
  const [search, setSearch] = useState(currentSearch)
  const [filters, setFilters] = useState<FilterConfig>(currentFilters)

  const tableRef = useRef<DataTableRef>(null)

  const { handleDownload } = useFileDownload({
    route: route('app.bookkeeping.bookings.export', { filters: filters })
  })

  const breadcrumbs = useMemo(
    () => [
      { title: 'Buchhaltung', url: route('app.bookkeeping.bookings.index') },
      { title: 'Buchungen' }
    ],
    []
  )

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon}>
          <MenuItem
            icon={FileExportIcon}
            title="Taxpool CSV-Export"
            ellipsis
            separator
            onClick={handleDownload}
          />
          <MenuItem title="Regeln auf unbestägite Transaktionen anwenden" ellipsis />
        </DropdownButton>
      </Toolbar>
    ),
    [handleDownload]
  )

  const handleSearchInputChange = (newSearch: string) => {
    setSearch(newSearch)
    debouncedSearchChange(newSearch)
  }
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSearchChange = useCallback(
    (newSearch: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(() => {
        router.post(
          route('app.bookkeeping.bookings.index'),
          {
            ...filters,
            search: newSearch
          } as any,
          {
            preserveScroll: true,
            preserveState: true,
            only: ['bookings']
          }
        )
      }, 500) // 500ms Debounce
    },
    [filters]
  )

  const handleFiltersChange = (newFilters: FilterConfig) => {
    router.post(
      route('app.bookkeeping.bookings.index'),
      {
        ...newFilters,
        search: search
      } as any,
      {
        preserveScroll: true,
        preserveState: true,
        only: ['bookings'],
        onSuccess: () => {
          setFilters(newFilters)
        }
      }
    )
  }

  const handleCorrectBookings = () => {
    router.put(
      route('app.bookkeeping.bookings.correct'),
      {
        ids: selectedRows.map(row => row.id).join(',')
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          // Reload the current page with filters and page
          router.post(
            route('app.bookkeeping.bookings.index', { page: bookings.current_page }),
            {
              filters: filters as any,
              search: search
            },
            {
              preserveScroll: true,
              preserveState: true,
              replace: true,
              onSuccess: () => tableRef.current?.resetRowSelection()
            }
          )
        }
      }
    )
  }

  const handleConfirm = () => {
    router.put(
      route('app.bookkeeping.bookings.confirm'),
      {
        ids: selectedRows.map(row => row.id).join(',')
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          // Reload the current page with filters and page
          router.post(
            route('app.bookkeeping.bookings.index', { page: bookings.current_page }),
            {
              filters: filters as any,
              search: search
            },
            {
              preserveScroll: true,
              preserveState: true,
              replace: true,
              onSuccess: () => tableRef.current?.resetRowSelection()
            }
          )
        }
      }
    )
  }

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
          icon={CreditCardChangeIcon}
          title="Buchungen korrigieren"
          onClick={() => handleCorrectBookings()}
        />
        <Button
          variant="ghost"
          size="auto"
          icon={Tick01Icon}
          title="als bestätigt markieren"
          onClick={() => handleConfirm()}
        />
        <div className="flex-1 text-right font-medium text-sm">x</div>
      </Toolbar>
    )
  }, [selectedRows.length])

  const footer = useMemo(() => <Pagination data={bookings} />, [bookings])
  const filterBar = useMemo(
    () => (
      <div className="flex gap-2 p-2 pt-0">
        <SearchField
          aria-label="Suchen"
          placeholder="Im Buchungstext suchen"
          value={search}
          onChange={handleSearchInputChange}
          className="w-sm"
        />
        <BookingIndexFilterForm
          accounts={accounts}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    ),
    [search, accounts, filters]
  )

  const handleEditAccounts = useCallback(
    async (row: App.Data.BookkeepingBookingData) => {
      const result = await BookingEditAccounts.call({
        booking: row,
        accounts
      })
      if (result === false) return
      const { account_id_credit, account_id_debit } = result

      console.log('Sending PUT request:', {
        booking_id: row.id,
        account_id_credit,
        account_id_debit
      })

      router.put(
        route('app.bookkeeping.bookings.edit-accounts', { booking: row.id }),
        {
          account_id_credit,
          account_id_debit,
          filters: filters as any,
          search: search,
          page: bookings.current_page
        },
        {
          preserveScroll: true,
          only: ['bookings']
        }
      )
    },
    [accounts, filters, search, bookings.current_page]
  )

  const columns = useMemo(
    () =>
      createColumns({
        onEditAccounts: handleEditAccounts,
        currentFilters: filters,
        currentSearch: search
      }),
    [filters, search, handleEditAccounts]
  )

  return (
    <PageContainer
      title="Buchungen"
      width="8xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable<App.Data.BookkeepingBookingData, unknown>
        columns={columns}
        actionBar={actionBar}
        filterBar={filterBar}
        ref={tableRef}
        onSelectedRowsChange={setSelectedRows}
        data={bookings.data}
        footer={footer}
        itemName="Buchungen"
      />
    </PageContainer>
  )
}

export default BookingIndex
