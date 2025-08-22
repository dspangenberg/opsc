import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect, useState } from 'react'

import { Button } from '@/Components/ui/twc-ui/button'
import { DateRangePicker } from '@/Components/ui/twc-ui/date-picker'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { NumberField } from '@/Components/ui/twc-ui/number-field'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'

import { Dialog } from '@/Components/ui/twc-ui/dialog'

interface Props {
  invoice: App.Data.InvoiceData
  invoiceLine: App.Data.InvoiceLineData
}

export const InvoiceDetailsEditLine: React.FC<Props> = ({ invoice, invoiceLine }) => {
  const form = useForm<App.Data.InvoiceLineData>(
    'invoice-line-edit-form',
    'put',
    route('app.invoice.line-update', {
      invoice: invoice.id,
      invoiceLine: invoiceLine.id
    }),
    invoiceLine
  )

  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (form.data.type_id === 1 && form.data.quantity && form.data.price) {
      const totalPrice = form.data.quantity * form.data.price
      form.updateAndValidateWithoutEvent('amount', totalPrice)
    }
  }, [form.data.quantity, form.data.price, form.data.type_id])

  const handleOnClosed = () => {
    setIsOpen(false)
    router.get(route('app.invoice.details', { invoice: invoice.id }))
  }

  return (
    <Dialog
      isOpen={isOpen}
      confirmClose={form.isDirty}
      title="Rechnungsposition bearbeiten"
      confirmationVariant="destructive"
      onClosed={handleOnClosed}
      width="5xl"
      bodyPadding
      description="Rechnungstammdaten wie Rechnungsnummer, Rechnungsdatum, Leistungsdatum, Rechnungsart, Projekt, Umsatzsteuer, etc. bearbeiten"
      footer={renderProps => (
        <>
          <Button id="dialog-cancel-button" variant="outline" onClick={() => renderProps.close()}>
            {form.isDirty ? 'Abbrechen' : 'Schließen'}
          </Button>
          <Button form={form.id} type="submit">
            Speichern
          </Button>
        </>
      )}
    >
      <Form form={form} onSubmitted={() => setIsOpen(false)}>
        <FormGroup>
          <div className="col-span-2">
            <NumberField
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
            <TextField label="Einheit" {...form.register('unit')} />
          </div>
          <div className="col-span-11">
            <TextField label="Beschreibung" rows={2} textArea={true} {...form.register('text')} />
          </div>
          <div className="col-span-3">
            <NumberField label="Einzelpreis" {...form.register('price')} />
          </div>
          <div className="col-span-3">
            <NumberField
              label="Gesamtbetrag"
              isDisabled={form.data.type_id === 1}
              {...form.register('amount')}
            />
          </div>
          <div className="col-span-3">
            <Select<App.Data.TaxRateData>
              {...form.register('tax_rate_id')}
              label="USt.-Satz"
              items={invoice.tax?.rates || []}
            />
          </div>
          <div className="col-span-4" />
          <div className="col-span-7">
            <DateRangePicker
              label="Leistungsdatum"
              {...form.registerDateRange('service_period_begin', 'service_period_end')}
            />
          </div>
        </FormGroup>
      </Form>
    </Dialog>
  )
}

export default InvoiceDetailsEditLine
