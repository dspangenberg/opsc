import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FileDownloadIcon,
  FilterHorizontalIcon,
  FilterIcon,
  FolderManagementIcon,
  MoreVerticalCircle01Icon,
  PrinterIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { usePage } from '@inertiajs/react'
import { getYear } from 'date-fns'
import { debounce, sumBy } from 'lodash'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { StatsField } from '@/Components/StatsField'
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Select } from '@/Components/twc-ui/select'
import { Separator } from '@/Components/twc-ui/separator'
import { ToggleButton } from '@/Components/twc-ui/toggle-button'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { BorderedBox } from '@/Components/twcui/bordered-box'
import { Badge } from '@/Components/ui/badge'
import type { PageProps } from '@/Types'
import { columns } from './InvoiceIndexColumns'

interface ContactIndexProps extends PageProps {
  invoices: App.Data.Paginated.PaginationMeta<App.Data.InvoiceData[]>
  stats: {
    year: number
    total_gross: number
    total_tax: number
    total_net: number
    total_loss_of_receivables: number
    total_open_amount: number
  }
  years: number[]
  currentYear: number
}

interface YearsProps extends Record<string, unknown> {
  id: number
  name: string
}

interface ViewProps extends Record<string, unknown> {
  id: number
  name: string
  is_default?: boolean
}

const InvoiceIndex: React.FC = () => {
  const invoices = usePage<ContactIndexProps>().props.invoices
  const stats = usePage<ContactIndexProps>().props.stats
  const currentYear = usePage<ContactIndexProps>().props.currentYear
  const years = usePage<ContactIndexProps>().props.years as unknown as number[]
  const [selectedAmount, setSelectedAmount] = useState<number>(0)
  const minYear = Math.min(...years)
  console.log(selectedAmount)
  const [year, setYear] = React.useState<number>(currentYear)
  const [view, setView] = React.useState<number>(1)
  const [selectedRows, setSelectedRows] = React.useState<App.Data.InvoiceData[]>([])
  const [showFilter, setShowFilter] = React.useState<boolean>(false)

  const localCurrentYear = getYear(new Date())

  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  const handlePreviousYear = useCallback(() => {
    const newYear = Number(year) === 0 ? localCurrentYear - 1 : year - 1
    setYear(newYear)

    // setYear(prevYear => Math.max(currentYear - 10, Number(prevYear) - 1))
  }, [setYear, year, localCurrentYear])

  const handleNextYear = useCallback(() => {
    const newYear =
      Number(year) === 0 ? localCurrentYear : Number.parseInt(year as unknown as string) + 1
    setYear(_prevYear => newYear)
  }, [localCurrentYear, setYear, year])

  useEffect(() => {
    const debouncedNavigate = debounce(() => {
      if (year !== currentYear) {
        router.get(route('app.invoice.index', { _query: { view: route().queryParams.view, year } }))
      }
    }, 300) // 300ms delay

    debouncedNavigate()

    return () => {
      debouncedNavigate.cancel()
    }
  }, [year])

  const yearItems = useMemo(() => {
    const items = years.map(year => ({
      id: year,
      name: year.toString()
    }))
    items.push({
      id: 0,
      name: 'Alle'
    })
    return items
  }, [])

  const views: ViewProps[] = [
    {
      id: 1,
      name: 'Aktuelles Jahr',
      is_default: true
    },
    {
      id: 2,
      name: 'Vorjahresrechnungen'
    }
  ]

  const breadcrumbs = useMemo(
    () => [
      {
        title: 'Rechnungen',
        route: route('app.invoice.index')
      }
    ],
    []
  )

  const handleInvoiceCreateClicked = useCallback(() => {
    router.visit(route('app.invoice.create'))
  }, [])

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="Neue Rechnung"
          onClick={handleInvoiceCreateClicked}
        />
        <Button variant="toolbar" icon={PrinterIcon} title="Drucken" disabled={true} />
        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon} title="Weitere Optionen">
          <MenuItem icon={Add01Icon} title="Rechnung hinzufügen" ellipsis separator />
          <MenuItem icon={PrinterIcon} title="Auswertung drucken" ellipsis />
        </DropdownButton>
      </Toolbar>
    ),
    [handleInvoiceCreateClicked]
  )

  const actionBar = useMemo(() => {
    console.log(selectedRows)
    const sum = sumBy(selectedRows, 'amount_net')
    setSelectedAmount(sum)
    return (
      <Toolbar variant="secondary" className="px-4 pt-2">
        <div className="self-center text-sm">
          <Badge variant="outline" className="mr-1.5 bg-background">
            {selectedRows.length}
          </Badge>
          ausgewählte Datensätze
        </div>
        <Button variant="ghost" size="auto" icon={FileDownloadIcon} title="Herunterladen" />
        <div className="w-32 flex-1 text-right font-medium text-sm">
          {currencyFormatter.format(selectedAmount)} €
        </div>
      </Toolbar>
    )
  }, [selectedRows, selectedAmount])

  const filterBar = useMemo(() => {
    if (!showFilter) {
      return null
    }
    return (
      <Toolbar variant="secondary" className="px-4 pt-2 pb-3">
        <Badge>Rechnungsdatum</Badge>
      </Toolbar>
    )
  }, [showFilter])

  const header = useMemo(
    () => (
      <div className="flex flex-col">
        <BorderedBox className="mx-auto mb-3 flex-none">
          <div className="mx-auto flex justify-center gap-4 divide-y bg-background px-2 py-2.5 lg:divide-x lg:divide-y-0">
            <StatsField label="netto" value={currencyFormatter.format(stats.total_net)} />
            <StatsField label="USt." value={currencyFormatter.format(stats.total_tax)} />
            <StatsField label="brutto" value={currencyFormatter.format(stats.total_gross)} />
            <StatsField
              label="Offene Posten"
              value={currencyFormatter.format(stats.total_open_amount)}
            />
            {stats.total_loss_of_receivables > 0 && (
              <StatsField
                label="Forderungsverluste"
                value={currencyFormatter.format(stats.total_loss_of_receivables)}
              />
            )}
          </div>
        </BorderedBox>

        <div className="flex flex-none items-center space-x-2 p-2">
          <Toolbar variant="secondary" className="flex flex-1">
            <Select<ViewProps>
              aria-label="View"
              className="w-48 bg-background"
              name="view"
              value={Number(view)}
              items={views}
              onChange={value => setView(Number(value))}
            />
            <Button
              variant="ghost"
              size="icon"
              icon={FolderManagementIcon}
              title="Optionen für virtuellen Ordner"
            />
            <Separator orientation="vertical" />

            <ToggleButton
              icon={FilterIcon}
              tooltip="Filter ein- /ausblenden"
              isSelected={showFilter}
              onChange={setShowFilter}
            />

            <div className="flex-1" />
            <Button variant="ghost" size="icon" icon={FilterHorizontalIcon} title="Drucken" />
          </Toolbar>
        </div>
      </div>
    ),
    [
      showFilter,
      view,
      stats.total_net,
      stats.total_tax,
      stats.total_gross,
      stats.total_loss_of_receivables,
      setView,
      setShowFilter,
      stats.total_open_amount
    ]
  )

  const footer = useMemo(() => {
    return <Pagination data={invoices} selected={selectedRows.length} />
  }, [invoices, selectedRows.length])

  return (
    <PageContainer
      title="Rechnungen"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
      header={
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-none items-center gap-1 font-bold text-xl">
            Rechnungen&nbsp;
            <Button
              variant="ghost"
              size="icon"
              icon={ArrowLeft01Icon}
              onClick={handlePreviousYear}
              disabled={year <= minYear}
            />
            <Select<YearsProps>
              className="w-20"
              aria-label="Jahr"
              name="year"
              value={Number(year)}
              items={yearItems}
              onChange={value => setYear(Number(value))}
            />
            <Button
              variant="ghost"
              size="icon"
              icon={ArrowRight01Icon}
              onClick={handleNextYear}
              disabled={year >= localCurrentYear}
            />
          </div>
        </div>
      }
    >
      <DataTable
        actionBar={actionBar}
        columns={columns}
        data={invoices.data}
        filterBar={filterBar}
        footer={footer}
        onSelectedRowsChange={setSelectedRows}
        itemName="Rechnungen mit den Suchkriterien"
      />
    </PageContainer>
  )
}

export default InvoiceIndex
