import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { FormDateRangePicker } from '@/Components/twc-ui/date-range-picker'
import { Dialog } from '@/Components/twc-ui/dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormNumberField } from '@/Components/twc-ui/number-field'
import { FormSelect } from '@/Components/twc-ui/select'
import { FormTextArea } from '@/Components/twc-ui/text-area'
import { FormTextField } from '@/Components/twc-ui/text-field'

interface Props {
  invoice: App.Data.InvoiceData
  invoiceLine: App.Data.InvoiceLineData
}

export const InvoiceDetailsEditLine: React.FC<Props> = ({ invoice, invoiceLine }) => {
  const form = useForm<App.Data.InvoiceLineData>(
    'invoice-line-edit-form',
    invoiceLine.id ? 'put' : 'post',
    invoiceLine.id
      ? route('app.invoice.line-update', {
          invoice: invoice.id,
          invoiceLine: invoiceLine.id
        })
      : route('app.invoice.line-store', {
          invoice: invoice.id
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
        <FormGrid>
          <div className="col-span-2">
            <FormNumberField
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
            <FormTextField label="Einheit" {...form.register('unit')} />
          </div>
          <div className="col-span-11">
            <FormTextArea label="Beschreibung" rows={2} {...form.register('text')} />
          </div>
          <div className="col-span-3">
            <FormNumberField label="Einzelpreis" {...form.register('price')} />
          </div>
          <div className="col-span-3">
            <FormNumberField
              label="Gesamtbetrag"
              isDisabled={form.data.type_id === 1}
              {...form.register('amount')}
            />
          </div>
          <div className="col-span-3">
            <FormSelect<App.Data.TaxRateData>
              {...form.register('tax_rate_id')}
              label="USt.-Satz"
              items={invoice.tax?.rates || []}
            />
          </div>
          <div className="col-span-4" />
          <div className="col-span-7">
            <FormDateRangePicker
              label="Leistungsdatum"
              {...form.registerDateRange('service_period_begin', 'service_period_end')}
            />
          </div>
        </FormGrid>
      </Form>
    </Dialog>
  )
}

export default InvoiceDetailsEditLine
