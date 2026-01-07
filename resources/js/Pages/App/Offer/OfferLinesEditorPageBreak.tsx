import type * as React from 'react'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { OfferLinesEditorLineContainer } from './OfferLinesEditorLineContainer'

interface InvoiceLinesEditorProps {
  offerLine: App.Data.OfferLineData
  offer: App.Data.OfferData
  index: number
}

export const OfferLinesEditorPageBreak: React.FC<InvoiceLinesEditorProps> = ({
  index,
  offer,
  offerLine
}) => {
  const form = useFormContext<App.Data.InvoiceData>()

  if (!form) {
    throw new Error('InvoiceLinesEditorPageBreak must be used within a Form context')
  }

  return (
    <OfferLinesEditorLineContainer offerLine={offerLine}>
      <FormGrid className="flex items-center pt-4">
        <div className="col-span-23">Seitenumbruch</div>
      </FormGrid>
    </OfferLinesEditorLineContainer>
  )
}
