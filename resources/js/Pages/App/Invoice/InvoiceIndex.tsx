import * as React from 'react'
import { useCallback, useEffect, useId, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreVerticalCircle01Icon,
  FilterHorizontalIcon,
  FolderManagementIcon,
  FilterRemoveIcon,
  FileDownloadIcon,
  FilterAddIcon,
  PrinterIcon,
  FilterIcon
} from '@hugeicons/core-free-icons'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { columns } from './InvoiceIndexColumns'
import type { PageProps } from '@/Types'
import { Pagination } from '@/Components/Pagination'
import { StatsField } from '@/Components/StatsField'
import { getYear } from 'date-fns'
import { router } from '@inertiajs/core'
import { debounce } from 'lodash'
import { Separator } from '@/Components/twcui/separator'
import { Toolbar } from '@/Components/twcui/toolbar'
import { Button } from '@/Components/twcui/button'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Select } from '@/Components/twcui/select'
import { BorderedBox } from '@/Components/twcui/bordered-box'
import { Badge } from '@/Components/ui/badge'
import { Toggle } from '@/Components/twcui/toggle'

interface ContactIndexProps extends PageProps {
  invoices: App.Data.Paginated.PaginationMeta<App.Data.InvoiceData[]>
  stats: {
    year: number
    total_gross: number
    total_tax: number
    total_net: number
    total_loss_of_receivables: number
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

  const minYear = Math.min(...years)

  const [year, setYear] = React.useState<number>(currentYear)
  const [view, setView] = React.useState<number>(1)
  const [selectedRows, setSelectedRows] = React.useState<App.Data.InvoiceData[]>([])
  const [showFilter, setShowFilter] = React.useState<boolean>(false)


  const localCurrentYear = getYear(new Date())

  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 2
  })

  const handlePreviousYear = useCallback(() => {
    const newYear = Number(year) === 0 ? localCurrentYear - 1 : year - 1
    setYear( newYear)

    // setYear(prevYear => Math.max(currentYear - 10, Number(prevYear) - 1))
  }, [currentYear, setYear])

  const handleNextYear = useCallback(() => {
    const newYear = Number(year) === 0 ? localCurrentYear : Number.parseInt(year as unknown as string) + 1
    setYear(prevYear => newYear)

  }, [localCurrentYear, setYear])

  useEffect(() => {
    const debouncedNavigate = debounce(() => {
      if (year !== currentYear) {
        router.get(route('app.invoice.index', { _query: { year } }))
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
  }, [years])

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

  const breadcrumbs = useMemo(() => [{
    title: 'Rechnungen',
    route: route('app.invoice.index')
  }], [])

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button variant="toolbar-default" icon={Add01Icon} title="Neue Rechnung" />
        <Button variant="toolbar" icon={PrinterIcon} title="Drucken" disabled={true}  />
        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon} title="Weitere Optionen">
          <MenuItem icon={Add01Icon} title="Rechnung hinzufügen" ellipsis separator />
          <MenuItem icon={PrinterIcon} title="Auswertung drucken" ellipsis />
        </DropdownButton>
      </Toolbar>
    ),
    []
  )

  const actionBar = useMemo(() => {
    return (
    <Toolbar className="px-4 pt-2">
      <div className="self-center text-sm">
        <Badge variant="outline" className="bg-background mr-1.5">{selectedRows.length}</Badge>
        ausgewählte Datensätze
      </div>
      <Button variant="ghost" size="auto" icon={FileDownloadIcon} title="Herunterladen" />
    </Toolbar>
    )
  }, [selectedRows])

  const filterBar = useMemo(() => {
    if (!showFilter) {
      return null
    }
    return (
      <Toolbar className="px-4 pt-2 pb-3">
        <Badge>Rechnungsdatum</Badge>
      </Toolbar>
    )
  }, [showFilter])


  const id = useId()

  const header = useMemo(
    () => (
      <div className="flex flex-col">
        <BorderedBox className="flex-none mx-auto mb-3">
          <div
            className="flex mx-auto gap-4 justify-center divide-y lg:divide-x lg:divide-y-0 bg-white px-2 py-2.5"
          >
            <StatsField label="netto" value={currencyFormatter.format(stats.total_net)} />
            <StatsField label="USt." value={currencyFormatter.format(stats.total_tax)} />
            <StatsField label="brutto" value={currencyFormatter.format(stats.total_gross)} />
            <StatsField label="Offene Posten" value={currencyFormatter.format(0)} />
            {stats.total_loss_of_receivables > 0 && (
              <StatsField label="Forderungsverluste"
                          value={currencyFormatter.format(stats.total_loss_of_receivables)}
              />
            )}
          </div>
        </BorderedBox>


        <div className="flex-none space-x-2 p-2 flex items-center">
          <Toolbar className="flex flex-1">
          <Select<ViewProps>
            aria-label="View"
            className="bg-background w-48"
            name="view"
            value={Number(view)}
            items={views}
            onChange={(value) => setView(Number(value.target.value))}
          />
          <Button variant="ghost" size="icon" icon={FolderManagementIcon} title="Optionen für virtuellen Ordner" />
          <Separator orientation="vertical" />

          <Toggle icon={FilterIcon} tooltip="Filter ein- /ausblenden" variant="default" size="default" isSelected={showFilter} onChange={setShowFilter} />
          

          <div className="flex-1" />
          <Button variant="ghost" size="icon" icon={FilterHorizontalIcon} title="Drucken" />
          </Toolbar>
        </div>
      </div>
    ),
    [id, showFilter, stats, view]
  )

  const footer = useMemo(() => {
    return (
      <Pagination data={invoices} selected={selectedRows.length} />
    )
  }, [invoices, selectedRows])

  return (
    <PageContainer
      title="Rechnungen"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex"
      toolbar={toolbar}
      header={
        <div className="flex gap-2 items-center flex-1">
          <div className="flex flex-none gap-1 text-xl font-bold items-center">

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
              onChange={(value) => setYear(Number(value.target.value))}
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
        header={header}
        onSelectedRowsChange={setSelectedRows}
        itemName="Rechnungen mit den Suchkriterien"
      />
    </PageContainer>
  )
}

export default InvoiceIndex
