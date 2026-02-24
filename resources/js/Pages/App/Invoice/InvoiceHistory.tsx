import type * as React from 'react'
import { DataTable } from '@/Components/DataTable'
import { HistoryView } from '@/Components/Shared/History/HistoryView'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { columns } from '@/Pages/App/Invoice/InvoicePaymentColumns'
import type { PageProps } from '@/Types'

interface InvoiceDetailsProps extends PageProps {
  invoice: App.Data.InvoiceData
  children?: React.ReactNode
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice }) => {
  const payable = Array.isArray(invoice?.payable) ? invoice.payable : []
  return (
    <InvoiceDetailsLayout invoice={invoice}>
      <div className="flex-1">
        <HistoryView entries={invoice.notables ?? []} />
      </div>
      <div className="h-fit w-full max-w-sm flex-none px-1">
        <div className="fixed w-full max-w-sm space-y-6">
          <InvoiceDetailsSide invoice={invoice} />
        </div>
      </div>
    </InvoiceDetailsLayout>
  )
}

export default InvoiceDetails
