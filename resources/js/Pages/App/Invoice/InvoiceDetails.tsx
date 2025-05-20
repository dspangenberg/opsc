import type * as React from 'react'
import { router, usePage } from '@inertiajs/react'
import type { PageProps } from '@/Types'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoicingTable, type LineCommandProps } from '@/Pages/App/Invoice/InvoicingTable'
import { ConfirmationDialog } from '@/Pages/App/Invoice/ConfirmationDialog'

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
      const promise = await ConfirmationDialog.call({
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
        <div className="w-sm flex-none h-fit space-y-6 px-1">
          <InvoiceDetailsSide invoice={invoice} />
        </div>

        <ConfirmationDialog.Root />
      </InvoiceDetailsLayout>
    </>
  )
}

export default InvoiceDetails
