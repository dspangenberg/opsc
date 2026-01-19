import type * as React from 'react'
import { useEffect } from 'react'
import { I18nProvider } from 'react-aria-components'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormDateRangePicker } from '@/Components/twc-ui/form-date-range-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormNumberField } from '@/Components/twc-ui/form-number-field'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import { InvoiceLinesEditorLineContainer } from '@/Pages/App/Invoice/InvoiceLinesEditorLineContainer'

interface InvoiceLinesEditorProps {
  invoiceLine: App.Data.InvoiceLineData
  invoice: App.Data.InvoiceData
  index: number
}

export const InvoiceLinesEditorDefaultLine: React.FC<InvoiceLinesEditorProps> = ({
  index,
  invoice,
  invoiceLine
}) => {
  const form = useFormContext<App.Data.InvoiceData>()

  if (!form) {
    throw new Error('InvoiceLinesEditorDefaultLine must be used within a Form context')
  }

  const quantityField = form.register(`lines[${index}].quantity`)
  const unitField = form.register(`lines[${index}].unit`)
  const textField = form.register(`lines[${index}].text`)
  const priceField = form.register(`lines[${index}].price`)
  const amountField = form.register(`lines[${index}].amount`)
  const servicePeriodBeginField = form.register(`lines[${index}].service_period_begin`)
  const serviceEndField = form.register(`lines[${index}].service_period_end`)

  useEffect(() => {
    if (invoiceLine.type_id === 1 && quantityField.value && priceField.value) {
      const totalPrice = Number(quantityField.value) * Number(priceField.value)
      amountField.onChange(totalPrice ?? 0)
    }
  }, [invoiceLine.type_id, quantityField.value, priceField.value])

  return (
    <I18nProvider locale="de-DE">
      <InvoiceLinesEditorLineContainer invoiceLine={invoiceLine}>
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
            <div className="flex items-center gap-2">
              <FormDatePicker aria-label="Leistungsdatum Beginn" {...servicePeriodBeginField} />
              <FormDatePicker aria-label="Leistungsdatum Ende" {...serviceEndField} />
            </div>
          </div>
          <div className="col-span-4">
            <FormNumberField aria-label="Einzelpreis" {...priceField} />
          </div>
          <div className="col-span-4">
            <FormNumberField
              aria-label="Gesamtbetrag"
              isDisabled={invoiceLine.type_id === 1}
              {...amountField}
            />
          </div>
          <div className="pt-2 font-medium text-sm">{invoiceLine.rate?.rate}%</div>
        </FormGrid>
      </InvoiceLinesEditorLineContainer>
    </I18nProvider>
  )
}
