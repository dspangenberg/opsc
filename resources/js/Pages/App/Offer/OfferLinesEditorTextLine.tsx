import type * as React from 'react'
import { MarkdownEditor } from '@/Components/MarkdownEditor'
import { Button } from '@/Components/twc-ui/button'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { OfferLinesEditorLineContainer } from './OfferLinesEditorLineContainer'

interface OfferLinesEditorProps {
  offerLine: App.Data.OfferLineData
  offer: App.Data.OfferData
  index: number
}

export const OfferLinesEditorTextLine: React.FC<OfferLinesEditorProps> = ({ offerLine, index }) => {
  const form = useFormContext<App.Data.OfferData>()

  if (!form) {
    throw new Error('InvoiceLinesEditorTextLine must be used within a Form context')
  }

  const textField = form.register(`lines[${index}].text`)

  const handleMarkdownEdit = async () => {
    const content = await MarkdownEditor.call({ content: textField.value })
    if (typeof content === 'string') {
      form.setData(textField.name as keyof App.Data.OfferData, content)
    }
  }

  return (
    <OfferLinesEditorLineContainer offerLine={offerLine}>
      <FormGrid>
        <div className="col-span-5" />

        <div className="col-span-10">
          <FormTextArea aria-label="Beschreibung" rows={2} {...textField} />
          <Button
            variant="link"
            onClick={() => handleMarkdownEdit()}
            className="px-0 font-normal"
            title="Im Markdown-Editor bearbeiten"
          />
        </div>
        <div className="col-span-8" />
      </FormGrid>
    </OfferLinesEditorLineContainer>
  )
}
