import * as React from 'react'
import { useCallback, useEffect, useId, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import {
  Add01Icon,
  PrinterIcon,
  Sorting05Icon,
  ArrowRight01Icon,
  Pin02Icon,
  ArrowLeft01Icon,
  MoreVerticalCircle01Icon
} from '@hugeicons/core-free-icons'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Button, Toolbar, ToolbarButton, FormSelect } from '@dspangenberg/twcui'
import { columns } from './InvoiceIndexColumns'
import type { PageProps } from '@/Types'
import { Pagination } from '@/Components/Pagination'
import { StatsField } from '@/Components/StatsField'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { getYear } from "date-fns";
import { router } from '@inertiajs/core'
import { debounce } from 'lodash'
import { Separator } from '@/Components/ui/separator'

interface ContactIndexProps extends PageProps {
  invoices: App.Data.Paginated.PaginationMeta<App.Data.InvoiceData[]>
  stats: {
    year: number
    total_gross: number
    total_tax: number
    total_net: number
  }
  years: number[]
  currentYear: number
}

const InvoiceIndex: React.FC = () => {
  const invoices = usePage<ContactIndexProps>().props.invoices
  const stats = usePage<ContactIndexProps>().props.stats
  const currentYear = usePage<ContactIndexProps>().props.currentYear
  const years = usePage<ContactIndexProps>().props.years as unknown as number[]

  const [year, setYear] = React.useState<number>(currentYear)

  const localCurrentYear = getYear(new Date())

  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 2
  })

  const handlePreviousYear = useCallback(() => {
    setYear(prevYear => Math.max(currentYear - 10, Number(prevYear) - 1))
  }, [currentYear, setYear])

  const handleNextYear = useCallback(() => {
    setYear(prevYear => Math.min(localCurrentYear, Number(prevYear) + 1))
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


  const { visitModal } = useModalStack()

  const breadcrumbs = useMemo(() => [{ title: 'Rechnungen', route: route('app.invoice.index') }], [])

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none">
        <ToolbarButton variant="default" icon={Add01Icon} title="Rechnung hinzufügen" />
        <ToolbarButton icon={PrinterIcon} />
        <ToolbarButton icon={MoreVerticalCircle01Icon} />
      </Toolbar>
    ),
    []
  )

  const id = useId()

  const header = useMemo(
    () => (
      <div className="flex flex-col py-0 rounded-t-md">
        <div className="flex-none space-x-2 p-2 flex items-center">
          <div className="group relative">
            <Select>
              <SelectTrigger id={id} className="bg-white">
                <SelectValue placeholder="Gespeicherte Views" className="bg-white" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">2025</SelectItem>
                <SelectItem value="2">Next.js</SelectItem>
                <SelectItem value="3">Astro</SelectItem>
                <SelectItem value="4">Gatsby</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="icon" icon={Pin02Icon} />
          <Separator orientation="vertical" />

          <Button variant="ghost" size="sm" icon={Sorting05Icon} title="Filter + Sortierung" />
        </div>
      </div>
    ),
    [id]
  )

  const footer = useMemo(() => <Pagination data={invoices} />, [invoices])

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
            <Button
              variant="ghost"
              size="icon"
              icon={ArrowLeft01Icon}
              onClick={handlePreviousYear}
              disabled={year <= currentYear - 10}
            />
            Rechnungen&nbsp;
            <FormSelect
              value={year.toString()}
              options={years?.map(year => ({ value: year.toString(), label: year.toString() }))}
              onValueChange={(value) => setYear(Number(value))}
            />
            <Button
              variant="ghost"
              size="icon"
              icon={ArrowRight01Icon}
              onClick={handleNextYear}
              disabled={year >= localCurrentYear}
            />
          </div>
          <div className="flex flex-1 justify-center divide-x">
            <div className="flex gap-4 divide-x">
              <StatsField label="netto" value={currencyFormatter.format(stats.total_net)} />
              <StatsField label="USt." value={currencyFormatter.format(stats.total_tax)} />
              <StatsField label="brutto" value={currencyFormatter.format(stats.total_gross)} />
              <StatsField label={`OP (${year})`} value={currencyFormatter.format(0)} />
              <StatsField label="OP (komplett)" value={currencyFormatter.format(0)} />
            </div>
          </div>
        </div>
      }
    >
        <DataTable columns={columns} data={invoices.data} footer={footer} header={header} itemName="Rechnungen mit den Suchkriterien"/>
    </PageContainer>
  )
}

export default InvoiceIndex
