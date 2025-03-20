import { useCallback, useMemo } from 'react'
import type * as React from 'react'
import { usePage } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import { NoteEditIcon, PrinterIcon, Add01Icon, InboxIcon } from '@hugeicons/core-free-icons'
import { NavTabs, NavTabsTab } from '@/Components/NavTabs'
import { DataTable } from '@/Components/DataTable'
import { EmptyState } from '@/Components/EmptyState'
import { PageContainer } from '@/Components/PageContainer'
import { Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import { columns } from './InvoiceIndexColumns'
import type { PageProps } from '@/Types'
import { Pagination } from '@/Components/Pagination'
import { StatsField } from '@/Components/StatsField'

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
        <ToolbarButton variant="default" icon={NoteEditIcon} title="Bearbeiten" />
        <ToolbarButton icon={PrinterIcon} />
      </Toolbar>
    ),
    []
  )

  const tabs = useMemo(
    () => (
      <NavTabs>
        {years.map(year => (
          <NavTabsTab
            key={year}
            href={`${route('app.invoice.index')}?year=${year}`}
            activeRoute={`/app/invoices?year=${year}`}
          >
            Jahr {year}
          </NavTabsTab>
        ))}
        <NavTabsTab
          href={`${route('app.invoice.index')}?year=all`}
          activeRoute="/app/invoices?year=all"
        >
          Alle Jahre
        </NavTabsTab>
      </NavTabs>
    ),
    []
  )

  const footer = useMemo(() => <Pagination data={invoices} />, [invoices])

  return (
    <PageContainer
      title="Rechnungen"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex"
      toolbar={toolbar}
      tabs={tabs}
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
        <DataTable columns={columns} data={invoices.data} footer={footer} />
      ) : (
        <EmptyState
          buttonLabel="Ersten Kontakt hinzufügen"
          buttonIcon={Add01Icon}
          onClick={handleAdd}
          icon={InboxIcon}
        >
          Ups, Du hast noch keine Kontakte.
        </EmptyState>
      )}
    </PageContainer>
  )
}

export default InvoiceIndex
