import type * as React from 'react'
import { useEffect } from 'react'
import { FormErrors, FormGroup } from '@dspangenberg/twcui'
import { router } from '@inertiajs/react'

import { Button } from "@/Components/twcui/button"
import { Form, useForm } from '@/Components/twcui/form'
import { createDateRangeChangeHandler, DateRangePicker } from '@/Components/twcui/date-picker'
import { Select } from '@/Components/twcui/select'

import { Input } from '@/Components/twcui/input'
import { NumberInput } from '@/Components/twcui/number-input'
import { Dialog } from '@/Components/twcui/dialog'

interface Props {
  invoice: App.Data.InvoiceData
  invoiceLine: App.Data.InvoiceLineData
}

export const InvoiceDetailsEditLineDialog: React.FC<Props> = ({
  invoice,
  invoiceLine
}) => {


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

  const handleOnClosed = () => {
    router.get(route('app.invoice.details', { invoice: invoice.id }))
  }

  return (
    <Dialog
      isOpen={true}
      confirmClose={form.isDirty}
      title="Rechnungsposition bearbeiten"
      confirmationVariant="destructive"
      onClosed={handleOnClosed}
      width="5xl"
      bodyPadding
      description="Rechnungstammdaten wie Rechnungsnummer, Rechnungsdatum, Leistungsdatum, Rechnungsart, Projekt, Umsatzsteuer, etc. bearbeiten"
      footer={(renderProps) => (
        <>
          <Button
            id="dialog-cancel-button"
            variant="outline"
            onClick={() => renderProps.close()}
          >
            {form.isDirty ? 'Abbrechen' : 'Schließen'}
          </Button>
          <Button form={form.id} type="submit">Speichern</Button>
        </>
      )}
    >
      <Form
        form={form}
      >
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
              label="Einzelpreis"
              {...form.register('price')}
            />
          </div>
          <div className="col-span-3">
            <NumberInput
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
          <div className="col-span-7">
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
    </Dialog>
  )
}
