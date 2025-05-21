import type * as React from 'react'
import { useEffect, useState } from 'react'
import { FormErrors, FormGroup } from '@dspangenberg/twcui'
import { router } from '@inertiajs/react'

import { Button } from '@/Components/jolly-ui/button'
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from '@/Components/jolly-ui/dialog'
import { Form, useForm } from '@/Components/twice-ui/form'
import { createDateRangeChangeHandler, DateRangePicker } from '@/Components/twice-ui/date-picker'
import { Select } from '@/Components/twice-ui/select'
import { Input } from '@/Components/twice-ui/input'
import { NumberInput } from '@/Components/twice-ui/number-input'

interface Props {
  invoice: App.Data.InvoiceData
  invoiceLine: App.Data.InvoiceLineData
}

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
    form,
    errors,
    data,
    updateAndValidateWithoutEvent
  } = useForm<App.Data.InvoiceLineData>(
    'invoice-line-edit-form',
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
          <Form
            form={form}
          >
            <FormErrors errors={errors} />
            <FormGroup>
              <div className="col-span-2">
                <NumberInput
                  autoFocus
                  formatOptions={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }}
                  label="Menge"
                  {...form.register('quantity')}
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="Einheit"
                  {...form.register('unit')}
                />
              </div>
              <div className="col-span-11">
                <Input
                  label="Beschreibung"
                  rows={2}
                  textArea={true}
                  {...form.register('text')}
                />
              </div>
              <div className="col-span-3">
                <NumberInput
                  formatOptions={{
                    style: 'currency',
                    currency: 'EUR'
                  }}
                  label="Einzelpreis"
                  {...form.register('price')}
                />
              </div>
              <div className="col-span-3">
                <NumberInput
                  formatOptions={{
                    style: 'currency',
                    currency: 'EUR'
                  }}
                  label="Gesamtbetrag"
                  isDisabled={data.type_id === 1}
                  {...form.register('amount')}
                />
              </div>
              <div className="col-span-3">
                <Select<App.Data.TaxRateData>
                  {...form.register('tax_rate_id')}
                  label="USt.-Satz"
                  items={invoice.tax?.rates}
                />
              </div>
              <div className="col-span-4" />
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
          </Form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form={form.id} type="submit">Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </DialogOverlay>
  )
}
