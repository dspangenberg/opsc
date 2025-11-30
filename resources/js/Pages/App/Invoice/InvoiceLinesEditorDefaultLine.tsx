import { DragDropVerticalIcon, MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'
import { format, parseISO } from 'date-fns'
import type * as React from 'react'
import { Focusable, Pressable } from 'react-aria-components'
import { BorderedBox } from '@/Components/twcui/bordered-box'
import { Button } from '@/Components/ui/twc-ui/button'
import { DateRangePicker } from '@/Components/ui/twc-ui/date-picker'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Icon } from '@/Components/ui/twc-ui/icon'
import { NumberField } from '@/Components/ui/twc-ui/number-field'
import { Popover, PopoverDialog, PopoverTrigger } from '@/Components/ui/twc-ui/popover'
import { RadioGroup } from '@/Components/ui/twc-ui/radio-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import { InvoiceLinesEditorLineContainer } from '@/Pages/App/Invoice/InvoiceLinesEditorLineContainer'
import { useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'

const DATE_FORMAT = 'dd.MM.yyyy'

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

  return (
    <InvoiceLinesEditorLineContainer invoiceLine={invoiceLine}>
      <FormGroup>
        <div className="col-span-3">
          <NumberField
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
          <TextField
            aria-label="Einheit"
            value={invoiceLine.unit}
            onChange={(value: string) => updateLine(invoiceLine.id as number, { unit: value })}
          />
        </div>
        <div className="col-span-10 space-y-1.5">
          <TextField
            aria-label="Beschreibung"
            autoSize
            rows={2}
            textArea={true}
            value={invoiceLine.text}
            onChange={(value: string) => updateLine(invoiceLine.id as number, { text: value })}
          />
          <span className="px-3.5 font-medium text-sm">
            <PopoverTrigger>
              <Pressable>
                <span className="cursor-pointer font-medium text-sm">
                  ({invoiceLine.service_period_begin} - {invoiceLine.service_period_end})
                </span>
              </Pressable>

              <Popover>
                <PopoverDialog>
                  <DateRangePicker
                    label="Leistungsdatum"
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
                        return format(parseISO(date), 'dd.MM.yyyy')
                      }

                      updateLine(invoiceLine.id, {
                        service_period_begin: formatDate(range?.start),
                        service_period_end: formatDate(range?.end)
                      })
                    }}
                  />
                </PopoverDialog>
              </Popover>
            </PopoverTrigger>
          </span>
        </div>
        <div className="col-span-4">
          <NumberField
            aria-label="Einzelpreis"
            value={invoiceLine.price}
            onChange={(value: number | null) =>
              updateLine(invoiceLine.id as number, { price: value ?? 0 })
            }
          />
        </div>
        <div className="col-span-4">
          <NumberField
            aria-label="Gesamtbetrag"
            isDisabled={invoice.type_id !== 2}
            value={invoiceLine.amount}
            onChange={(value: number | null) =>
              updateLine(invoiceLine.id as number, { amount: value ?? 0 })
            }
          />
        </div>
        <div className="pt-2 font-medium text-sm">{invoiceLine.rate?.rate}%</div>
      </FormGroup>
    </InvoiceLinesEditorLineContainer>
  )
}
