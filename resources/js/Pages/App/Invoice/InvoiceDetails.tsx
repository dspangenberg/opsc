import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect } from 'react'

import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoiceLinesEditor } from '@/Pages/App/Invoice/InvoiceLinesEditor'
import { useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'
import { InvoicingTable, type LineCommandProps } from '@/Pages/App/Invoice/InvoicingTable'
import type { PageProps } from '@/Types'
import { InvoiceDetailsLinkedInvoices } from './InvoiceDetailsLinkedInvoices'

interface InvoiceDetailsProps extends PageProps {
  invoice: App.Data.InvoiceData
  children?: React.ReactNode
}

const InvoiceDetailsContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { invoice } = usePage<InvoiceDetailsProps>().props

  const { setLines, amountNet, amountTax, amountGross, editMode, setEditMode } = useInvoiceTable()

  useEffect(() => setLines(invoice.lines || []), [invoice.lines, setLines])

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

    // app.invoice.create.payment

    if (props.command === 'duplicate') {
      router.get(
        route('app.invoice.line-duplicate', { invoice: invoice.id, invoiceLine: props.lineId })
      )
    }
  }

  const handleAddNewLinkClicked = (type: number) => {
    console.log(type)
    router.visit(route('app.invoice.line-create', { invoice: invoice.id, _query: { type } }))
  }

  return (
    <div className="flex-1 flex-col">
      {children}
      {editMode ? (
        <InvoiceLinesEditor invoice={invoice} />
      ) : (
        <div className="space-y-4">
          <h5>Rechnungspositionen</h5>
          <InvoicingTable invoice={invoice} onLineCommand={handeLineCommand} />
          <h5>Verrechnete Akontorechnungen</h5>
          <InvoiceDetailsLinkedInvoices invoice={invoice} onLineCommand={handeLineCommand} />
        </div>
      )}
    </div>
  )
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ children }) => {
  const { invoice } = usePage<InvoiceDetailsProps>().props

  return (
    <InvoiceDetailsLayout invoice={invoice}>
      <InvoiceDetailsContent>{children}</InvoiceDetailsContent>
      <div className="h-fit w-sm flex-none space-y-6 px-1">
        <InvoiceDetailsSide invoice={invoice} />
      </div>
    </InvoiceDetailsLayout>
  )
}

export default InvoiceDetails
