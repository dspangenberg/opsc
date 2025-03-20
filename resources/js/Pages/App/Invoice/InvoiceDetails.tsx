import type * as React from 'react'
import { usePage } from '@inertiajs/react'
import type { PageProps } from '@/Types'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoicingTable } from '@/Pages/App/Invoice/InvoicingTable'

interface InvoiceDetailsProps extends PageProps {
  invoice: App.Data.InvoiceData
}

const Invoicedetails: React.FC = () => {
  const { invoice } = usePage<InvoiceDetailsProps>().props

  return (
    <InvoiceDetailsLayout invoice={invoice}>
      <div className="flex-1">
        <InvoicingTable invoice={invoice} />
      </div>
      <div className="w-sm flex-none h-fit space-y-6 px-1">
        <InvoiceDetailsSide invoice={invoice} />
      </div>
    </InvoiceDetailsLayout>
  )
}

export default Invoicedetails
