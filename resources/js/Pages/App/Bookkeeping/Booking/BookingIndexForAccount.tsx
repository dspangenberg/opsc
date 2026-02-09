import {
  CreditCardChangeIcon,
  FileExportIcon,
  MoreVerticalCircle01Icon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import { useFileDownload } from '@/Hooks/use-file-download'
import type { FilterConfig } from '@/Lib/FilterHelper'
import { BookingIndexForAccountFilterForm } from '@/Pages/App/Bookkeeping/Booking/BookingIndexForAccountFilterForm'
import type { PageProps } from '@/Types'
import { createColumns } from './BookingIndexForAccountColumns'

interface TransactionsPageProps extends PageProps {
  bookings: App.Data.Paginated.PaginationMeta<App.Data.BookkeepingBookingData[]>
  currentSearch?: string
  currentFilters?: FilterConfig
  account: App.Data.BookkeepingAccountData
}

const BookingIndexForAccount: React.FC<TransactionsPageProps> = ({
  account,
  bookings,
  currentFilters = { filters: {}, boolean: 'AND' },
  currentSearch
}) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.BookkeepingBookingData[]>([])
  const [search, _setSearch] = useState(currentSearch)
  const [filters, setFilters] = useState<FilterConfig>(currentFilters)
  const columns = useMemo(() => createColumns(filters), [filters])

  const { handleDownload } = useFileDownload({
    route: route('app.bookkeeping.bookings.export', { filters: filters })
  })
  const breadcrumbs = useMemo(
    () => [
      { title: 'Buchhaltung', url: route('app.bookkeeping.bookings.index') },
      {
        title: 'Buchungen',
        url: route('app.bookkeeping.bookings.index', {
          _query: filters
        })
      },
      {
        title: account.label
      }
    ],
    [account.label, filters]
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

  const handleFiltersChange = (newFilters: FilterConfig) => {
    router.post(
      route('app.bookkeeping.bookings.account', { accountNumber: account.account_number }),
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
            route('app.bookkeeping.bookings.account', {
              accountNumber: account.account_number,
              page: bookings.current_page
            }),
            {
              filters: filters as any,
              search: search
            },
            {
              preserveScroll: true,
              preserveState: true,
              replace: true
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
            route('app.bookkeeping.bookings.account', {
              page: bookings.current_page,
              accountId: account.account_number
            }),
            {
              filters: filters as any,
              search: search
            },
            {
              preserveScroll: true,
              preserveState: true,
              replace: true
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
        <BookingIndexForAccountFilterForm filters={filters} onFiltersChange={handleFiltersChange} />
      </div>
    ),
    [filters]
  )
  return (
    <PageContainer
      title={`${account.label} – Buchungen`}
      width="8xl"
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

export default BookingIndexForAccount
