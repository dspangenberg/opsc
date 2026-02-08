import { FileExportIcon, MoreVerticalCircle01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { SearchField } from '@/Components/twc-ui/search-field'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import { useFileDownload } from '@/Hooks/use-file-download'
import type { PageProps } from '@/Types'
import { columns } from './BookingIndexColumns'
import { BookingIndexFilterForm } from '@/Pages/App/Bookkeeping/Booking/BookingIndexFilterForm'
import { type FilterConfig } from '@/Lib/FilterHelper'

interface TransactionsPageProps extends PageProps {
  bookings: App.Data.Paginated.PaginationMeta<App.Data.BookkeepingBookingData[]>
  accounts: App.Data.BookkeepingAccountData[]
  currentSearch?: string
  currentFilters?: FilterConfig
}


const BookingIndex: React.FC<TransactionsPageProps> = ({ accounts, bookings, currentFilters = { filters: {}, boolean: 'AND' }, currentSearch }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.BookkeepingBookingData[]>([])
  const [search, setSearch] = useState(currentSearch)
  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }], [])
  const [filters, setFilters] = useState<FilterConfig>(currentFilters)

  const { handleDownload } = useFileDownload({
    route: route('app.bookkeeping.bookings.export', { filters: filters })
  })

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

  const debouncedSearchChange = useCallback((newSearch: string) => {
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
  }, [filters])

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

  const actionBar = useMemo(() => {
    return (
      <Toolbar variant="secondary" className="px-4 pt-2">
        <div className="self-center text-sm">
          <Badge variant="outline" className="mr-1.5 bg-background">
            {selectedRows.length}
          </Badge>
          ausgewählte Datensätze
        </div>
        <Button variant="ghost" size="auto" icon={Tick01Icon} title="als bestätigt markieren" />
        <div className="flex-1 text-right font-medium text-sm">x</div>
      </Toolbar>
    )
  }, [selectedRows.length])

  const footer = useMemo(() => <Pagination data={bookings} />, [bookings])
  const filterBar = useMemo(
    () => (
      <div className="flex p-2 pt-0 gap-2">
        <SearchField
          aria-label="Suchen"
          placeholder="Im Buchungstext suchen"
          value={search}
          onChange={handleSearchInputChange}
          className="w-sm"
        />
        <BookingIndexFilterForm accounts={accounts} filters={filters} onFiltersChange={handleFiltersChange} />
      </div>
    ),
    [search, accounts, filters]
  )
  return (
    <PageContainer
      title="Buchungen"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable<App.Data.BookkeepingBookingData, unknown>
        columns={columns}
        actionBar={actionBar}
        filterBar={filterBar}
        onSelectedRowsChange={setSelectedRows}
        data={bookings.data}
        footer={footer}
        itemName="Buchungen"
      />
    </PageContainer>
  )
}

export default BookingIndex
