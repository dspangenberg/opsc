import { format, parseISO } from 'date-fns'
import type * as React from 'react'
import { useEffect } from 'react'
import { DateRangePicker } from '@/Components/ui/twc-ui/date-picker'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { NumberField } from '@/Components/ui/twc-ui/number-field'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import { InvoiceLinesEditorLineContainer } from '@/Pages/App/Invoice/InvoiceLinesEditorLineContainer'
import { useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'

interface InvoiceLinesEditorProps {
  invoiceLine: App.Data.InvoiceLineData
  invoice: App.Data.InvoiceData
  index: number
}

export const InvoiceLinesEditorTextLine: React.FC<InvoiceLinesEditorProps> = ({
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
      <FormGroup>
        <div className="col-span-5" />

        <div className="col-span-10">
          <TextField
            aria-label="Beschreibung"
            textArea
            rows={2}
            value={invoiceLine.text}
            onChange={(value: string) => updateLine(invoiceLine.id as number, { text: value })}
          />
        </div>
        <div className="col-span-8" />
      </FormGroup>
    </InvoiceLinesEditorLineContainer>
  )
}
