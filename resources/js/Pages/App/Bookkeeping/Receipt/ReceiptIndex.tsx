import {
  Csv02Icon,
  FileDownloadIcon,
  FileExportIcon,
  MagicWand01Icon,
  MoreVerticalCircle01Icon,
  TableIcon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import { getLocalTimeZone } from '@internationalized/date'
import { sumBy } from 'lodash'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Menu, MenuItem, MenuPopover, MenuSubTrigger } from '@/Components/twc-ui/menu'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import { useFileDownload } from '@/Hooks/use-file-download'
import { formatDate } from '@/Lib/DateHelper'
import { ReceiptReportDialog } from '@/Pages/App/Bookkeeping/Receipt/ReceiptReportDialog'
import type { PageProps } from '@/Types'
import { columns } from './ReceiptIndexColumns'

interface ReceiptIndexPageProps extends PageProps {
  receipts: App.Data.Paginated.PaginationMeta<App.Data.ReceiptData[]>
}

const ReceiptIndex: React.FC<ReceiptIndexPageProps> = ({ receipts }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.ReceiptData[]>([])
  const [selectedAmount, setSelectedAmount] = useState<number>(0)

  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }, { title: 'Belege' }], [])

  const handleBulkConfirmationClicked = () => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.get(route('app.bookkeeping.receipts.lock', { _query: { ids } }), {
      preserveScroll: true
    })
  }
  //
  const handleBulkRuleClicked = () => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.get(route('app.bookkeeping.receipts.rule', { _query: { ids } }), {
      preserveScroll: true
    })
  }

  const handleBulkDownloadClicked = () => {
    const ids = selectedRows.map(row => row.id).join(',')
    router.get(route('app.bookkeeping.bulk-download', { _query: { ids } }), {
      preserveScroll: true
    })
  }

  const handleCreateReport = async () => {
    const result = await ReceiptReportDialog.call()
    if (!result) return
    const startDate = result.start
      ? formatDate(result.start.toDate(getLocalTimeZone()), 'yyyy-MM-dd')
      : ''
    const endDate = result.end
      ? formatDate(result.end.toDate(getLocalTimeZone()), 'yyyy-MM-dd')
      : ''

    const url = route('app.bookkeeping.receipts.report', {
      begin_on: startDate,
      end_on: endDate
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon}>
          <MenuItem
            icon={TableIcon}
            title="Report erstellen"
            ellipsis
            onClick={handleCreateReport}
            separator
          />
        </DropdownButton>
      </Toolbar>
    ),
    []
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
  }, [selectedRows, selectedAmount])

  const footer = useMemo(() => {
    // Nur Pagination rendern, wenn cost_centers existiert
    return <Pagination data={receipts} />
  }, [receipts])

  return (
    <PageContainer title="Belege" width="7xl" breadcrumbs={breadcrumbs} toolbar={toolbar}>
      <div>
        <DataTable
          columns={columns}
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
