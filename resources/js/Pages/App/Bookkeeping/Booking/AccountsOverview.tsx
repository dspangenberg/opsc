import { PrinterIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
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
}

const AccountsOverview: React.FC<AccountsOverviewPageProps> = ({
  accounts: accountsData,
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

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button variant="ghost" icon={PrinterIcon} title="Drucken" />
      </Toolbar>
    ),
    []
  )

  const handleFiltersChange = useCallback(
    (newFilters: FilterConfig) => {
      router.post(
        route('app.bookkeeping.accounts.overview'),
        {
          ...newFilters
        } as any,
        {
          preserveScroll: true,
          preserveState: true,
          only: ['accounts'],
          onSuccess: () => {
            setFilters(newFilters)
          }
        }
      )
    },
    []
  )

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
      </div>
    ),
    [filters, handleFiltersChange]
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
