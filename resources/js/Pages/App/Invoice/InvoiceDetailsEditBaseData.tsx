import type * as React from 'react'

import { Button } from '@/Components/ui/twc-ui/button'
import { Checkbox } from '@/Components/ui/twc-ui/checkbox'
import { ComboBox } from '@/Components/ui/twc-ui/combo-box'
import { DatePicker, DateRangePicker } from '@/Components/ui/twc-ui/date-picker'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { RadioGroup } from '@/Components/ui/twc-ui/radio-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { router } from '@inertiajs/react'
import { useState } from 'react'

interface Props {
  invoice: App.Data.InvoiceData
  invoice_types: App.Data.InvoiceTypeData[]
  projects: App.Data.ProjectData[]
  taxes: App.Data.TaxData[]
  payment_deadlines: App.Data.PaymentDeadlineData[]
}

export const InvoiceDetailsEditBaseData: React.FC<Props> = ({
  invoice,
  invoice_types,
  payment_deadlines,
  projects,
  taxes
}) => {
  const form = useForm<App.Data.InvoiceData>(
    'basedata-form',
    'put',
    route('app.invoice.base-update', { invoice: invoice.id }),
    invoice
  )
  const [isOpen, setIsOpen] = useState(true)
  const handleOnClosed = () => {
    setIsOpen(false)
    router.get(route('app.invoice.details', { invoice: invoice.id }))
  }

  return (
    <Dialog
      isOpen={isOpen}
      confirmClose={form.isDirty}
      title="Rechnungsstammdaten bearbeiten"
      onClosed={handleOnClosed}
      description="Rechnungstammdaten wie Rechnungsnummer, Rechnungsdatum, Leistungsdatum, Rechnungsart, Projekt, Umsatzsteuer, etc. bearbeiten"
      footer={renderProps => (
        <>
          <Button id="dialog-cancel-button" variant="outline" onClick={() => renderProps.close()}>
            {form.isDirty ? 'Abbrechen' : 'Schließen'}
          </Button>
          <Button isLoading={form.processing} form={form.id} type="submit">
            Speichern
          </Button>
        </>
      )}
    >
      <Form form={form} onSubmitted={() => setIsOpen(false)}>
        <FormGroup>
          <div className="col-span-24">
            <RadioGroup<App.Data.InvoiceTypeData>
              autoFocus
              label="Rechnungsart"
              itemName={'display_name'}
              items={invoice_types}
              {...form.register('type_id')}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className="col-span-8">
            <DatePicker label="Rechnungsdatum" {...form.register('issued_on')} />
          </div>
          <div className="col-span-4" />

          <div className="col-span-12">
            <DateRangePicker
              label="Leistungsdatum"
              {...form.registerDateRange('service_period_begin', 'service_period_end')}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className="col-span-12">
            <Select<App.Data.PaymentDeadlineData>
              {...form.register('payment_deadline_id')}
              label="Zahlungsziel"
              items={payment_deadlines}
            />
          </div>
          <div className="col-span-12">
            <Select<App.Data.TaxData, number | null>
              {...form.register('tax_id')}
              label="Umsatzsteuer"
              items={taxes}
            />
          </div>
          <div className="col-span-24">
            <ComboBox<App.Data.ProjectData>
              label="Projekt"
              {...form.register('project_id')}
              isOptional
              optionalValue="(kein Projekt)"
              items={projects}
            />
            <Checkbox {...form.registerCheckbox('is_recurring')} className="pt-1.5">
              Wiederkehrende Rechnung
            </Checkbox>
          </div>
        </FormGroup>
      </Form>
    </Dialog>
  )
}

export default InvoiceDetailsEditBaseData
