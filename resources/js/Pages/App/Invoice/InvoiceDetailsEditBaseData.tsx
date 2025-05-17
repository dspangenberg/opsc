import type * as React from 'react'
import InvoiceDetails from './InvoiceDetails'
import type { PageProps } from '@inertiajs/core'
import { InvoiceDetailsEditBaseDataDialog } from './InvoiceDetailsEditBaseDataDialog'
import { usePage } from '@inertiajs/react'

interface Props extends PageProps {
  invoice: App.Data.InvoiceData
  invoice_types: App.Data.InvoiceTypeData[]
  projects: App.Data.ProjectData[]
  taxes: App.Data.TaxData[]
}

const InvoiceDetailsEditBaseData: React.FC<Props> = ({ invoice, invoice_types, projects, taxes }) => {
  const { auth } = usePage<PageProps>().props
  return (
    <InvoiceDetails invoice={invoice} auth={auth}>
      <InvoiceDetailsEditBaseDataDialog invoice={invoice} invoice_types={invoice_types} projects={projects} taxes={taxes}/>
    </InvoiceDetails>
  )
}

export default InvoiceDetailsEditBaseData
