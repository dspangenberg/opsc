import type * as React from 'react'
import InvoiceDetails from './InvoiceDetails'
import type { PageProps } from '@inertiajs/core'
import { InvoiceDetailsEditBaseDataDialog } from './InvoiceDetailsEditBaseDataDialog'
import { usePage } from '@inertiajs/react'

interface Props extends PageProps {
  invoice: App.Data.InvoiceData
  invoice_types: App.Data.InvoiceTypeData[]
  projects: App.Data.ProjectData[]
}

const InvoiceDetailsEditBaseData: React.FC<Props> = ({ invoice, invoice_types, projects }) => {
  const { auth } = usePage<PageProps>().props
  return (
    <InvoiceDetails invoice={invoice} auth={auth}>
      <InvoiceDetailsEditBaseDataDialog invoice={invoice} invoice_types={invoice_types} projects={projects}/>
    </InvoiceDetails>
  )
}

export default InvoiceDetailsEditBaseData
