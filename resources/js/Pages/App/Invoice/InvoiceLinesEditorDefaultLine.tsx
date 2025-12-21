import { format, parseISO } from 'date-fns'
import type * as React from 'react'
import { useEffect } from 'react'
import { FormDateRangePicker } from '@/Components/twc-ui/date-range-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormNumberField } from '@/Components/twc-ui/number-field'
import { FormTextArea } from '@/Components/twc-ui/text-area'
import { FormTextField } from '@/Components/twc-ui/text-field'
import { InvoiceLinesEditorLineContainer } from '@/Pages/App/Invoice/InvoiceLinesEditorLineContainer'
import { useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'

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
        <div className="col-span-3">
          <FormNumberField
            autoFocus
            formatOptions={{
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }}
            aria-label="Menge"
            value={invoiceLine.quantity}
            onChange={(value: number | null) =>
              updateLine(invoiceLine.id as number, { quantity: value ?? 0 })
            }
          />
        </div>
        <div className="col-span-2">
          <FormTextField
            aria-label="Einheit"
            value={invoiceLine.unit}
            onChange={(value: string) => updateLine(invoiceLine.id as number, { unit: value })}
          />
        </div>
        <div className="col-span-10 space-y-1.5">
          <FormTextArea
            aria-label="Beschreibung"
            autoSize
            rows={2}
            value={invoiceLine.text}
            onChange={(value: string) => updateLine(invoiceLine.id as number, { text: value })}
          />

          <FormDateRangePicker
            name="service_period"
            aria-label="Leistungsdatum"
            value={
              invoiceLine.service_period_begin && invoiceLine.service_period_end
                ? {
                    start: invoiceLine.service_period_begin,
                    end: invoiceLine.service_period_end
                  }
                : undefined
            }
            onChange={range => {
              if (!invoiceLine.id) return

              const formatDate = (date: any) => {
                if (!date) return null
                // Check if date is already a string in the correct format
                if (typeof date === 'string' && date.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
                  return date
                }
                // Otherwise parse and format
                try {
                  return format(parseISO(date), 'dd.MM.yyyy')
                } catch {
                  return null
                }
              }

              updateLine(invoiceLine.id, {
                service_period_begin: formatDate(range?.start),
                service_period_end: formatDate(range?.end)
              })
            }}
          />
        </div>
        <div className="col-span-4">
          <FormNumberField
            aria-label="Einzelpreis"
            value={invoiceLine.price}
            onChange={(value: number | null) =>
              updateLine(invoiceLine.id as number, { price: value ?? 0 })
            }
          />
        </div>
        <div className="col-span-4">
          <FormNumberField
            aria-label="Gesamtbetrag"
            isDisabled={invoiceLine.type_id === 1}
            value={invoiceLine.amount}
            onChange={(value: number | null) =>
              updateLine(invoiceLine.id as number, { amount: value ?? 0 })
            }
          />
        </div>
        <div className="pt-2 font-medium text-sm">{invoiceLine.rate?.rate}%</div>
      </FormGrid>
    </InvoiceLinesEditorLineContainer>
  )
}
