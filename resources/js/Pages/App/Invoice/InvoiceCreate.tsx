import type * as React from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { InvoiceForm } from '@/Pages/App/Invoice/InvoiceForm'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  invoice: App.Data.InvoiceData
  projects: App.Data.ProjectData[]
  invoice_types: App.Data.InvoiceTypeData[]
  taxes: App.Data.TaxData[]
  payment_deadlines: App.Data.PaymentDeadlineData[]
  contacts: App.Data.ContactData[]
}

const InvoiceCreate: React.FC<Props> = ({
  invoice,
  contacts,
  projects,
  invoice_types,
  taxes,
  payment_deadlines
}) => {
  return (
    <PageContainer title="Neue Rechnung erstellen" width="8xl" className="flex overflow-hidden">
      <InvoiceForm
        className="mx-auto"
        method="post"
        saveRoute={route('app.invoice.store')}
        cancelRoute={route('app.invoice.index')}
        contacts={contacts}
        invoice={invoice}
        invoice_types={invoice_types}
        payment_deadlines={payment_deadlines}
        projects={projects}
        taxes={taxes}
      />
    </PageContainer>
  )
}

export default InvoiceCreate
