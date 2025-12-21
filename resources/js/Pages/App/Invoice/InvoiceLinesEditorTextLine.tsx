import type * as React from 'react'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextArea } from '@/Components/twc-ui/text-area'
import { InvoiceLinesEditorLineContainer } from '@/Pages/App/Invoice/InvoiceLinesEditorLineContainer'

interface InvoiceLinesEditorProps {
  invoiceLine: App.Data.InvoiceLineData
  invoice: App.Data.InvoiceData
  index: number
}

export const InvoiceLinesEditorTextLine: React.FC<InvoiceLinesEditorProps> = ({
  invoiceLine,
  index
}) => {
  const form = useFormContext<App.Data.InvoiceData>()

  if (!form) {
    throw new Error('InvoiceLinesEditorTextLine must be used within a Form context')
  }

  const textField = form.register(`lines[${index}].text`)

  return (
    <InvoiceLinesEditorLineContainer invoiceLine={invoiceLine}>
      <FormGrid>
        <div className="col-span-5" />

        <div className="col-span-10">
          <FormTextArea aria-label="Beschreibung" rows={2} {...textField} />
        </div>
        <div className="col-span-8" />
      </FormGrid>
    </InvoiceLinesEditorLineContainer>
  )
}
