import type * as React from 'react'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/text-field'
import { InvoiceLinesEditorLineContainer } from '@/Pages/App/Invoice/InvoiceLinesEditorLineContainer'

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
  const form = useFormContext<App.Data.InvoiceData>()

  if (!form) {
    throw new Error('InvoiceLinesEditorCaptionLine must be used within a Form context')
  }

  const textField = form.register(`lines[${index}].text`)

  return (
    <InvoiceLinesEditorLineContainer invoiceLine={invoiceLine}>
      <FormGrid>
        <div className="col-span-5" />

        <div className="col-span-10">
          <FormTextField aria-label="Beschreibung" className="!text-lg" {...textField} />
        </div>
        <div className="col-span-8" />
      </FormGrid>
    </InvoiceLinesEditorLineContainer>
  )
}
