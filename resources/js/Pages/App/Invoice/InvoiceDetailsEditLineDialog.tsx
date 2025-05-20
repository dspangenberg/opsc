import type * as React from 'react'
import { type FormEvent, useEffect, useState } from 'react'
import { FormErrors, FormGroup } from '@dspangenberg/twcui'
import { useForm } from '@/Hooks/use-form'
import { router } from '@inertiajs/react'

import { JollyTextField } from '@/Components/jolly-ui/textfield'
import { Button } from '@/Components/jolly-ui/button'
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from '@/Components/jolly-ui/dialog'
import { JollyNumberField } from '@/Components/jolly-ui/numberfield'
import { JollySelect, SelectItem } from '@/Components/jolly-ui/select'
import { createDateRangeChangeHandler, DateRangePicker } from '@/Components/twice-ui/date-range-picker'

interface Props {
  invoice: App.Data.InvoiceData
  invoiceLine: App.Data.InvoiceLineData
}

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 0
})

export const InvoiceDetailsEditLineDialog: React.FC<Props> = ({
  invoice,
  invoiceLine
}) => {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    router.visit(route('app.invoice.details', { invoice: invoice.id }))
  }

  const {
    data,
    errors,
    updateAndValidate,
    submit,
    updateAndValidateWithoutEvent
  } =
    useForm<App.Data.InvoiceLineData>(
      'put',
      route('app.invoice.line-update', {
        invoice: invoice.id,
        invoiceLine: invoiceLine.id
      }),
      invoiceLine
    )

  useEffect(() => {
    if (data.type_id === 1 && data.quantity && data.price) {
      const totalPrice = data.quantity * data.price
      updateAndValidateWithoutEvent('amount', totalPrice)
    }
  }, [data.quantity, data.price, data.type_id])

  const handleValueChange = (name: keyof App.Data.InvoiceLineData, value: number) => {
    updateAndValidateWithoutEvent(name, value)
  }

  const handleTextChange =
    (name: keyof App.Data.InvoiceLineData) => (value: string | undefined) => {
      updateAndValidateWithoutEvent(name, value || '')
    }

  const handleNumberInputChange =
    (name: keyof App.Data.InvoiceLineData) => (value: number | undefined) => {
      updateAndValidateWithoutEvent(name, value ?? null)
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      await submit(event)
      handleClose()
    } catch (error) {
    }
  }

  const handlePeriodChange = createDateRangeChangeHandler(
    updateAndValidateWithoutEvent,
    'service_period_begin',
    'service_period_end'
  )

  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-6xl">
        <DialogHeader>
          <DialogTitle>Rechnungsposition bearbeiten</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <form onSubmit={handleSubmit} id="invoiceLineForm">
            <FormErrors errors={errors} />
            <FormGroup>
              <div className="col-span-3">
                <JollyNumberField
                  autoFocus
                  formatOptions={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }}
                  label="Menge"
                  value={data.quantity as unknown as number}
                  isInvalid={!!errors.quantity || false}
                  onChange={handleNumberInputChange('quantity')}
                />
              </div>
              <div className="col-span-2">
                <JollyTextField
                  name="unit"
                  label="Einheit"
                  className="pointer-events-auto"
                  value={data.unit as unknown as string}
                  onChange={handleTextChange('unit')}
                  isInvalid={!!errors.unit || false}
                />
              </div>
              <div className="col-span-11">
                <JollyTextField
                  name="text"
                  label="Beschreibung"
                  rows={2}
                  textArea={true}
                  value={data.text}
                  isInvalid={!!errors.text || false}
                  onChange={value => handleTextChange('text')(value)}
                />
              </div>
              <div className="col-span-3">
                <JollyNumberField
                  formatOptions={{
                    style: 'currency',
                    currency: 'EUR'
                  }}
                  label="Einzelpreis"
                  value={data.price as unknown as number}
                  onChange={handleNumberInputChange('price')}
                />
              </div>
              <div className="col-span-3">
                <JollyNumberField
                  formatOptions={{
                    style: 'currency',
                    currency: 'EUR'
                  }}
                  label="Gesamtbetrag"
                  value={data.amount as unknown as number}
                  isDisabled={data.type_id === 1}
                  onChange={handleNumberInputChange('amount')}
                />
              </div>
              <div className="col-span-2">
                <JollySelect<App.Data.TaxRateData>
                  onSelectionChange={selected =>
                    handleValueChange('tax_rate_id', selected as unknown as number)
                  }
                  selectedKey={data.tax_rate_id}
                  label="USt.-Satz"
                  items={invoice.tax?.rates || []}
                >
                  {item => (
                    <SelectItem className="!text-right">
                      {currencyFormatter.format(item.rate)}
                    </SelectItem>
                  )}
                </JollySelect>
              </div>
              <div className="col-span-5" />
              <div className="col-span-6">
                <DateRangePicker
                  label="Leistungsdatum"
                  value={{
                    start: data.service_period_begin,
                    end: data.service_period_end
                  }}
                  name="service_period"
                  onChange={handlePeriodChange}
                  hasError={!!errors.service_period_begin || !!errors.service_period_end}
                />
              </div>
            </FormGroup>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form="invoiceLineForm" type="submit">
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogOverlay>
  )
}
