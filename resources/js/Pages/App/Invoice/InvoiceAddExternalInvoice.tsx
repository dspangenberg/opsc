import type * as React from 'react'
import { useMemo } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import type { PageProps } from '@/Types'
import { columns } from './InvoiceAddExternalInvoiceColumns'

interface InvoiceAddExternalInvoiceProps extends PageProps {
  documents: App.Data.Paginated.PaginationMeta<App.Data.DocumentData[]>
}

const InvoiceAddExternalInvoice: React.FC<InvoiceAddExternalInvoiceProps> = ({ documents }) => {
  const breadcrumbs = useMemo(
    () => [
      {
        title: 'Rechnungen',
        route: route('app.invoice.index')
      }
    ],
    []
  )

  const footer = useMemo(() => {
    return <Pagination data={documents} />
  }, [documents])

  return (
    <PageContainer
      title="Externe Rechnung hinzufügen"
      width="8xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
    >
      <DataTable columns={columns} data={documents.data} footer={footer} itemName="Dokumente" />
    </PageContainer>
  )
}

export default InvoiceAddExternalInvoice
