import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import type { PageProps } from '@/Types'

interface InvoiceDetailsProps extends PageProps {
  invoice: App.Data.InvoiceData
  children?: React.ReactNode
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ children }) => {
  const { invoice } = usePage<InvoiceDetailsProps>().props

  return (
    <InvoiceDetailsLayout invoice={invoice}>
      <div className="flex-1">History</div>
      <div className="h-fit w-sm flex-none space-y-6 px-1">
        <InvoiceDetailsSide invoice={invoice} />
      </div>
    </InvoiceDetailsLayout>
  )
}

export default InvoiceDetails
