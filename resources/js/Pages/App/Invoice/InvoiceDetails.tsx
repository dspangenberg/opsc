import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoicingTable, type LineCommandProps } from '@/Pages/App/Invoice/InvoicingTable'
import type { PageProps } from '@/Types'
import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'

interface InvoiceDetailsProps extends PageProps {
  invoice: App.Data.InvoiceData
  children?: React.ReactNode
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ children }) => {
  const { invoice } = usePage<InvoiceDetailsProps>().props

  const handeLineCommand = async (props: LineCommandProps) => {
    if (props.command === 'edit') {
      router.get(route('app.invoice.line-edit', { invoice: invoice.id, invoiceLine: props.lineId }))
    }

    if (props.command === 'delete') {
      const promise = await AlertDialog.call({
        title: 'Rechnungsposition löschen',
        message: 'Möchtest Du die Rechnungsposition wirklich löschen?',
        buttonTitle: 'Position löschen'
      })
      if (promise) {
        router.delete(
          route('app.invoice.line-delete', { invoice: invoice.id, invoiceLine: props.lineId })
        )
      }
    }

    if (props.command === 'duplicate') {
      router.get(
        route('app.invoice.line-duplicate', { invoice: invoice.id, invoiceLine: props.lineId })
      )
    }
  }

  return (
    <>
      <InvoiceDetailsLayout invoice={invoice}>
        <div className="flex-1">
          {children}
          <InvoicingTable invoice={invoice} onLineCommand={handeLineCommand} />
        </div>
        <div className="h-fit w-sm flex-none space-y-6 px-1">
          <InvoiceDetailsSide invoice={invoice} />
        </div>
      </InvoiceDetailsLayout>
    </>
  )
}

export default InvoiceDetails
