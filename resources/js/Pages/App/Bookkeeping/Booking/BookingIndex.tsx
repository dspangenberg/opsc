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
  RepeatIcon,
  Sent02Icon,
  Tick01Icon,
  UnavailableIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
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
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
import { useFileDownload } from '@/Hooks/useFileDownload'
import type { PageProps } from '@/Types'
import { columns } from './BookingIndexColumns'

interface TransactionsPageProps extends PageProps {
  bookings: App.Data.Paginated.PaginationMeta<App.Data.BookkeepingBookingData[]>
  currentSearch?: string
}

const BookingIndex: React.FC<TransactionsPageProps> = ({ bookings, currentSearch }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.BookkeepingBookingData[]>([])
  const [search, setSearch] = useState(currentSearch)
  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }], [])

  const handleBulkConfirmationClicked = () => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.get(route('app.bookkeeping.transactions.confirm', { _query: { ids } }), {
      preserveScroll: true
    })
  }

  const { handleDownload } = useFileDownload({
    route: route('app.bookkeeping.bookings.export')
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
    []
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
      router.get(
        route('app.bookkeeping.bookings.index'),
        {
          search: newSearch
        },
        {
          preserveScroll: true,
          preserveState: true,
          only: ['bookings'],
          onSuccess: () => {
            // Update wird durch die props vom Controller gemacht
          }
        }
      )
    }, 500) // 500ms Debounce
  }, [])

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
      <div className="flex p-2 pt-0">
        <JollySearchField
          aria-label="Suchen"
          placeholder="Im Buchungstext suchen"
          value={search}
          onChange={handleSearchInputChange}
          className="w-sm"
        />
      </div>
    ),
    [search]
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
