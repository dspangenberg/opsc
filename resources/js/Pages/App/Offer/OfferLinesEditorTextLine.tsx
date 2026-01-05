import type * as React from 'react'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { OfferLinesEditorLineContainer } from './OfferLinesEditorLineContainer'

interface InvoiceLinesEditorProps {
  offerLine: App.Data.OfferLineData
  offer: App.Data.OfferData
  index: number
}

export const OfferLinesEditorTextLine: React.FC<InvoiceLinesEditorProps> = ({
  offerLine,
  index
}) => {
  const form = useFormContext<App.Data.InvoiceData>()

  if (!form) {
    throw new Error('InvoiceLinesEditorTextLine must be used within a Form context')
  }

  const textField = form.register(`lines[${index}].text`)

  return (
    <OfferLinesEditorLineContainer offerLine={offerLine}>
      <FormGrid>
        <div className="col-span-5" />

        <div className="col-span-10">
          <FormTextArea aria-label="Beschreibung" rows={2} {...textField} />
        </div>
        <div className="col-span-8" />
      </FormGrid>
    </OfferLinesEditorLineContainer>
  )
}
