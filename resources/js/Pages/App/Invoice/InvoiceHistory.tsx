import type * as React from 'react'
import { router, usePage } from '@inertiajs/react'
import type { PageProps } from '@/Types'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoicingTable, type LineCommandProps } from '@/Pages/App/Invoice/InvoicingTable'
import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'

interface InvoiceDetailsProps extends PageProps {
  invoice: App.Data.InvoiceData
  children?: React.ReactNode
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ children }) => {
  const { invoice } = usePage<InvoiceDetailsProps>().props

  return (
    <>
      <InvoiceDetailsLayout invoice={invoice}>
        <div className="flex-1">
          History
        </div>
        <div className="w-sm flex-none h-fit space-y-6 px-1">
          <InvoiceDetailsSide invoice={invoice} />
        </div>

      </InvoiceDetailsLayout>
    </>
  )
}

export default InvoiceDetails
