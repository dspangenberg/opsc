import type * as React from 'react'
import { useEffect } from 'react'
import { MarkdownEditor } from '@/Components/MarkdownEditor'
import { Button } from '@/Components/twc-ui/button'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormNumberField } from '@/Components/twc-ui/form-number-field'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import { OfferLinesEditorLineContainer } from './OfferLinesEditorLineContainer'

interface OfferLinesEditorDefaultLineProps {
  offerLine: App.Data.OfferLineData
  offer: App.Data.OfferData
  index: number
}

export const OfferLinesEditorDefaultLine: React.FC<OfferLinesEditorDefaultLineProps> = ({
  index,
  offer,
  offerLine
}) => {
  const form = useFormContext<App.Data.OfferData>()

  if (!form) {
    throw new Error('InvoiceLinesEditorDefaultLine must be used within a Form context')
  }

  const quantityField = form.register(`lines[${index}].quantity`)
  const unitField = form.register(`lines[${index}].unit`)
  const textField = form.register(`lines[${index}].text`)
  const priceField = form.register(`lines[${index}].price`)
  const amountField = form.register(`lines[${index}].amount`)

  useEffect(() => {
    if (offerLine.type_id === 1 && quantityField.value && priceField.value) {
      const totalPrice = Number(quantityField.value) * Number(priceField.value)
      amountField.onChange(totalPrice ?? 0)
    }
  }, [offerLine.type_id, quantityField.value, priceField.value])

  const handleMarkdownEdit = async () => {
    const content = await MarkdownEditor.call({ content: textField.value })
    if (content) {
      form.setData(textField.name as keyof App.Data.OfferData, content)
    }
  }

  return (
    <OfferLinesEditorLineContainer offerLine={offerLine}>
      <FormGrid>
        <div className="col-span-3">
          <FormNumberField
            autoFocus
            formatOptions={{
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }}
            aria-label="Menge"
            {...quantityField}
          />
        </div>
        <div className="col-span-2">
          <FormTextField aria-label="Einheit" {...unitField} />
        </div>
        <div className="col-span-10 space-y-1.5">
          <FormTextArea aria-label="Beschreibung" autoSize rows={2} {...textField} />
          <Button
            variant="link"
            onClick={() => handleMarkdownEdit()}
            className="px-0 font-normal"
            title="Markdown im Editor bearbeiten"
          />
        </div>
        <div className="col-span-4">
          <FormNumberField aria-label="Einzelpreis" {...priceField} />
        </div>
        <div className="col-span-4">
          <FormNumberField
            aria-label="Gesamtbetrag"
            isDisabled={offerLine.type_id === 1}
            {...amountField}
          />
        </div>
        <div className="pt-2 font-medium text-sm">{offerLine.rate?.rate}%</div>
      </FormGrid>
    </OfferLinesEditorLineContainer>
  )
}
