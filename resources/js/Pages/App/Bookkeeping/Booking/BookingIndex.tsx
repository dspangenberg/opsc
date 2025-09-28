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
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
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
import type { PageProps } from '@/Types'
import { columns } from './BookingIndexColumns'

interface TransactionsPageProps extends PageProps {
  bookings: App.Data.Paginated.PaginationMeta<App.Data.BookkeepingBookingData[]>
}

const BookingIndex: React.FC<TransactionsPageProps> = ({ bookings }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.BookkeepingBookingData[]>([])

  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }], [])

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
          <MenuItem icon={FileExportIcon} title="Taxpool CSV-Export" ellipsis separator />
          <MenuItem title="Regeln auf unbestägite Transaktionen anwenden" ellipsis />
        </DropdownButton>
      </Toolbar>
    ),
    []
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
        <Button variant="ghost" size="auto" icon={Tick01Icon} title="als bestätigt markieren" />
        <div className="flex-1 text-right font-medium text-sm">x</div>
      </Toolbar>
    )
  }, [selectedRows.length])

  const footer = useMemo(() => <Pagination data={bookings} />, [bookings])

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
        onSelectedRowsChange={setSelectedRows}
        data={bookings.data}
        footer={footer}
        itemName="Buchungen"
      />
    </PageContainer>
  )
}

export default BookingIndex
