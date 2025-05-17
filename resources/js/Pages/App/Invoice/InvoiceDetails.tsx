import type * as React from 'react'
import { router, usePage } from '@inertiajs/react'
import type { PageProps } from '@/Types'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoicingTable, type LineCommandProps } from '@/Pages/App/Invoice/InvoicingTable'
import { InvoiceDetailsEditPosition } from '@/Pages/App/Invoice/InvoiceDetailsEditPosition'
import { ConfirmationDialog } from '@/Pages/App/Invoice/ConfirmationDialog'
import { useRoute } from 'ziggy-js'

interface InvoiceDetailsProps extends PageProps {
  invoice: App.Data.InvoiceData
  line?: number
  children?: React.ReactNode
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ children }) => {
  const { invoice, line } = usePage<InvoiceDetailsProps>().props

  const handeLineCommand = async (props: LineCommandProps) => {
    console.log('Handle line command:', props) // Verarbeitung des Line Commandos
    if (props.command === 'edit') {
      const line = invoice.lines?.find(line => line.id === props.lineId) // Finden der Zeile mit der entsprechenden ID
      await InvoiceDetailsEditPosition.call({
        invoice: invoice,
        invoiceLine: line as unknown as App.Data.InvoiceLineData
      })
    }

    if (props.command === 'delete') {
      console.log('Delete line with ID:', props.lineId) // Löschen der Zeile mit der entsprechenden ID
      const promise = await ConfirmationDialog.call({
        title: 'Rechnungsposition löschen',
        message: 'Möchtest Du die Rechnungsposition wirklich löschen?',
        buttonTitle: 'Position löschen'
      })
      if (promise) {
        // Implementiere den Löschvorgang
        router.delete(
          route('app.invoice.line-delete', { invoice: invoice.id, invoiceLine: props.lineId })
        )
      }
    }

    if (props.command === 'duplicate') {
      console.log('Duplicate line with ID:', props.lineId) // Duplizieren der Zeile mit der entsprechenden ID

      router.get(
        route('app.invoice.line-duplicate', { invoice: invoice.id, invoiceLine: props.lineId }),{},{
          onSuccess: (page) => {

            console.log(page)
          }
        }
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
        <InvoiceDetailsEditPosition.Root />
        <ConfirmationDialog.Root />
      </InvoiceDetailsLayout>
    </>
  )
}

export default InvoiceDetails
