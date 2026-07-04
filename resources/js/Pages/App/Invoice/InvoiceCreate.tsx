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
  zugferd_profiles: LaravelOptions[]
  is_zugferd_enabled: boolean
}

const InvoiceCreate: React.FC<Props> = ({
  invoice,
  contacts,
  projects,
  invoice_types,
  taxes,
  payment_deadlines,
  zugferd_profiles,
  is_zugferd_enabled
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
        zugferd_profiles={zugferd_profiles}
        projects={projects}
        taxes={taxes}
        is_zugferd_enabled={is_zugferd_enabled}
      />
    </PageContainer>
  )
}

export default InvoiceCreate
