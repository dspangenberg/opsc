import type * as React from 'react'
import { DataTable } from '@/Components/DataTable'
import { HistoryView } from '@/Components/Shared/History/HistoryView'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoiceDetailsSideLight } from '@/Pages/App/Invoice/InvoiceDetailsSideLight'
import { columns } from '@/Pages/App/Invoice/InvoicePaymentColumns'
import type { PageProps } from '@/Types'

interface InvoiceDetailsProps extends PageProps {
  invoice: App.Data.InvoiceData
  zugferd_profiles: LaravelOptions[]
  children?: React.ReactNode
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, zugferd_profiles }) => {
  return (
    <InvoiceDetailsLayout invoice={invoice}>
      <div className="mr-8 flex-1">
        <HistoryView
          entries={invoice.notables ?? []}
          route={route('app.invoice.store-note', { invoice: invoice.id })}
        />
      </div>
      <div className="h-fit w-full max-w-sm flex-none border-l! border-stone-200 px-1">
        <div className="fixed w-full max-w-sm space-y-6">
          <InvoiceDetailsSideLight invoice={invoice} zugferd_profiles={zugferd_profiles} />
        </div>
      </div>
    </InvoiceDetailsLayout>
  )
}

export default InvoiceDetails
