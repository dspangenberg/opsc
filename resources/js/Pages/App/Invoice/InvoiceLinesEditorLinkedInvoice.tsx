import type * as React from 'react'
import { InvoiceLinesEditorLineContainer } from '@/Pages/App/Invoice/InvoiceLinesEditorLineContainer'

interface InvoiceLinesEditorLinkedInvoiceProps {
  invoiceLine: App.Data.InvoiceLineData
  invoice: App.Data.InvoiceData
  index: number
}

export const InvoiceLinesEditorLinkedInvoice: React.FC<InvoiceLinesEditorLinkedInvoiceProps> = ({
  index,
  invoice,
  invoiceLine
}) => {
  return (
    <InvoiceLinesEditorLineContainer invoiceLine={invoiceLine}>
      <div className="grid flex-1 grid-cols-24 gap-x-3 py-2.5">
        <div className="col-span-5" />

        <div className="col-span-10 text-sm">
          abzüglich{' '}
          <span className="font-medium">
            AR-{invoiceLine.linked_invoice?.formated_invoice_number}
          </span>{' '}
          vom <span className="font-medium">{invoiceLine.linked_invoice?.issued_on}</span>
        </div>
      </div>
    </InvoiceLinesEditorLineContainer>
  )
}
