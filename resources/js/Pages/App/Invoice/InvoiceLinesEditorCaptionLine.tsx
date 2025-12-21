import type * as React from 'react'
import { useEffect } from 'react'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/text-field'
import { InvoiceLinesEditorLineContainer } from '@/Pages/App/Invoice/InvoiceLinesEditorLineContainer'
import { useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'

interface InvoiceLinesEditorProps {
  invoiceLine: App.Data.InvoiceLineData
  invoice: App.Data.InvoiceData
  index: number
}

export const InvoiceLinesEditorCaptionLine: React.FC<InvoiceLinesEditorProps> = ({
  index,
  invoice,
  invoiceLine
}) => {
  const { updateLine } = useInvoiceTable()

  useEffect(() => {
    if (invoiceLine.type_id === 1 && invoiceLine.quantity && invoiceLine.price) {
      const totalPrice = invoiceLine.quantity * invoiceLine.price
      updateLine(invoiceLine.id as number, { amount: totalPrice ?? 0 })
    }
  }, [invoiceLine.type_id, invoiceLine.quantity, invoiceLine.price])

  return (
    <InvoiceLinesEditorLineContainer invoiceLine={invoiceLine}>
      <FormGrid>
        <div className="col-span-5" />

        <div className="col-span-10">
          <FormTextField
            aria-label="Beschreibung"
            className="!text-lg"
            value={invoiceLine.text}
            onChange={(value: string) => updateLine(invoiceLine.id as number, { text: value })}
          />
        </div>
        <div className="col-span-8" />
      </FormGrid>
    </InvoiceLinesEditorLineContainer>
  )
}
