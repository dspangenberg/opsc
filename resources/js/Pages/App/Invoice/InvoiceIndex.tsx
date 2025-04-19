import { useCallback, useId, useMemo } from 'react'
import type * as React from 'react'
import { usePage } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import {
  NoteEditIcon,
  PrinterIcon,
  Add01Icon,
  InboxIcon,
  Sorting05Icon
} from '@hugeicons/core-free-icons'
import { NavTabs, NavTabsTab } from '@/Components/NavTabs'
import { DataTable } from '@/Components/DataTable'
import { EmptyState } from '@/Components/EmptyState'
import { PageContainer } from '@/Components/PageContainer'
import { Button, Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import { columns } from './InvoiceIndexColumns'
import type { PageProps } from '@/Types'
import { Pagination } from '@/Components/Pagination'
import { StatsField } from '@/Components/StatsField'
import { ClassicNavTabsTab } from '@/Components/ClassicNavTabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/Components/ui/select'

interface ContactIndexProps extends PageProps {
  invoices: App.Data.Paginated.PaginationMeta<App.Data.InvoiceData[]>
  years: number[]
  stats: {
    year: number
    total_gross: number
    total_tax: number
    total_net: number
  }
}

const InvoiceIndex: React.FC = () => {
  const invoices = usePage<ContactIndexProps>().props.invoices
  const years = usePage<ContactIndexProps>().props.years
  const stats = usePage<ContactIndexProps>().props.stats

  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 2
  })

  const testROute = `${route('app.invoice.index', {})}?year=2023`
  console.log(testROute)

  const { visitModal } = useModalStack()

  const handleAdd = useCallback(() => {
    visitModal(route('app.accommodation.create'))
  }, [visitModal])

  const breadcrumbs = useMemo(() => [{ title: 'Kontakte', route: route('app.contact.index') }], [])

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none">
        <ToolbarButton variant="default" icon={Add01Icon} title="Rechnung hinzufügen" />
        <ToolbarButton icon={PrinterIcon} />
      </Toolbar>
    ),
    []
  )

  const id = useId()

  const header = useMemo(
    () => (
      <div className="flex flex-col py-0 rounded-t-md">
        <div className="flex-none space-x-2 p-2 flex items-center">
          <div className="group relative min-w-64">
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
          <Button variant="ghost" size="sm" icon={Sorting05Icon} title="Filter + Sortierung" />
        </div>
      </div>
    ),
    [invoices]
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
        <div className="flex gap-4">
          <StatsField label="netto" value={currencyFormatter.format(stats.total_net)} />
          <StatsField label="USt." value={currencyFormatter.format(stats.total_tax)} />
          <StatsField label="brutto" value={currencyFormatter.format(stats.total_gross)} />
          <StatsField label="offen" value={currencyFormatter.format(0)} />
        </div>
      }
    >
      {invoices.data.length > 0 ? (
        <DataTable columns={columns} data={invoices.data} footer={footer} header={header} />
      ) : (
        <EmptyState
          buttonLabel="Erste Rechnung hinzufügen"
          buttonIcon={Add01Icon}
          onClick={handleAdd}
          icon={InboxIcon}
        >
          Ups, Du hast noch keine Rechnungen.
        </EmptyState>
      )}
    </PageContainer>
  )
}

export default InvoiceIndex
