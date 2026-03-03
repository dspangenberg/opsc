import { Invoice01Icon, PrinterIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { BookmarkMenu } from '@/Components/Shared/Bookmark/BookmarkMenu'
import { Button } from '@/Components/twc-ui/button'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import type { FilterConfig } from '@/Lib/FilterHelper'
import { BookingIndexFilterForm } from '@/Pages/App/Bookkeeping/Booking/BookingIndexFilterForm'
import type { PageProps } from '@/Types'
import { createColumns } from './AccountsOverviewColumns'

interface AccountBalance {
  account_number: number
  label: string
  debit_sum: number
  credit_sum: number
  balance: number
  type: string | null
}

interface AccountsOverviewPageProps extends PageProps {
  accounts: App.Data.Paginated.PaginationMeta<AccountBalance[]>
  currentFilters?: FilterConfig
  bookmark_model: string
  bookmarks: App.Data.BookmarkData[]
}

const AccountsOverview: React.FC<AccountsOverviewPageProps> = ({
  accounts: accountsData,
  bookmark_model,
  bookmarks = [],
  currentFilters = { filters: {}, boolean: 'AND' }
}) => {
  const [filters, setFilters] = useState<FilterConfig>(currentFilters)

  const breadcrumbs = useMemo(
    () => [
      { title: 'Buchhaltung', url: route('app.bookkeeping.bookings.index') },
      { title: 'Konten-Übersicht' }
    ],
    []
  )

  const handleBookmarkUpdate = () => {
    router.reload({ only: ['bookmarks'] })
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button variant="ghost" icon={PrinterIcon} title="Drucken" />
      </Toolbar>
    ),
    []
  )

  const handleFiltersChange = useCallback((newFilters: FilterConfig) => {
    router.get(
      route('app.bookkeeping.accounts.overview'),
      {
        ...newFilters
      } as any,
      {
        preserveScroll: true,
        preserveState: true,
        only: ['accounts', 'currentFilters'],
        onSuccess: () => {
          setFilters(newFilters)
        }
      }
    )
  }, [])

  const columns = useMemo(
    () =>
      createColumns({
        currentFilters: filters
      }),
    [filters]
  )

  const filterBar = useMemo(
    () => (
      <div className="flex gap-2 p-2 pt-0">
        <BookingIndexFilterForm
          accounts={[]}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          hideAccountFilters
        />
        <BookmarkMenu
          bookmarks={bookmarks}
          icon={Invoice01Icon}
          model={bookmark_model}
          onUpdate={handleBookmarkUpdate}
        />
      </div>
    ),
    [filters, handleFiltersChange, bookmarks, bookmark_model]
  )

  const footer = useMemo(() => <Pagination data={accountsData} />, [accountsData])

  return (
    <PageContainer
      title="Konten-Übersicht"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable<AccountBalance, unknown>
        columns={columns}
        filterBar={filterBar}
        data={accountsData.data}
        footer={footer}
        itemName="Konten"
      />
    </PageContainer>
  )
}

export default AccountsOverview
