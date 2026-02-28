import type * as React from 'react'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import { OfferLinesEditorLineContainer } from './OfferLinesEditorLineContainer'
import type { OfferFormData } from './OfferLinesEditor'

interface OfferLinesEditorProps {
  offerLine: App.Data.OfferLineData
  offer: App.Data.OfferData
  index: number
}

export const OfferLinesEditorCaptionLine: React.FC<OfferLinesEditorProps> = ({
  index,
  offer,
  offerLine
}) => {
  const form = useFormContext<OfferFormData>()

  if (!form) {
    throw new Error('InvoiceLinesEditorCaptionLine must be used within a Form context')
  }

  const textField = form.register(`lines[${index}].text`)

  return (
    <OfferLinesEditorLineContainer offerLine={offerLine}>
      <FormGrid>
        <div className="col-span-5" />

        <div className="col-span-10">
          <FormTextField aria-label="Beschreibung" className="text-lg!" {...textField} />
        </div>
        <div className="col-span-8" />
      </FormGrid>
    </OfferLinesEditorLineContainer>
  )
}
