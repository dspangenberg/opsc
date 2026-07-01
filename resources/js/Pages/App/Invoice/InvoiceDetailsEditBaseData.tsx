import type * as React from 'react'

import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoiceForm } from '@/Pages/App/Invoice/InvoiceForm'
import { InvoiceDetailsLayout } from './InvoiceDetailsLayout'

interface Props {
  invoice: App.Data.InvoiceData
  invoice_types: App.Data.InvoiceTypeData[]
  projects: App.Data.ProjectData[]
  taxes: App.Data.TaxData[]
  payment_deadlines: App.Data.PaymentDeadlineData[]
  contacts: App.Data.ContactData[]
  zugferd_profiles: LaravelOptions[]
}

export const InvoiceDetailsEditBaseData: React.FC<Props> = ({
  contacts,
  invoice,
  invoice_types,
  payment_deadlines,
  projects,
  taxes,
  zugferd_profiles
}) => {
  return (
    <InvoiceDetailsLayout invoice={invoice}>
      <div className="flex-1">
        <InvoiceForm
          className="mx-auto"
          method="put"
          saveRoute={route('app.invoice.base-update', { invoice: invoice.id })}
          cancelRoute={route('app.invoice.details', { invoice: invoice.id })}
          contacts={contacts}
          invoice={invoice}
          invoice_types={invoice_types}
          payment_deadlines={payment_deadlines}
          projects={projects}
          taxes={taxes}
          zugferd_profiles={zugferd_profiles}
        />
      </div>
      <div className="h-fit w-sm flex-none space-y-6 px-1">
        <InvoiceDetailsSide zugferd_profiles={zugferd_profiles} invoice={invoice} />
      </div>
    </InvoiceDetailsLayout>
  )
}

export default InvoiceDetailsEditBaseData
