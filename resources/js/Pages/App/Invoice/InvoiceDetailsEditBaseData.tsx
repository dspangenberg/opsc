import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { Dialog } from '@/Components/twc-ui/dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormDateRangePicker } from '@/Components/twc-ui/form-date-range-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormRadioGroup } from '@/Components/twc-ui/form-radio-group'
import { FormSelect } from '@/Components/twc-ui/form-select'

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
        <FormGrid>
          <div className="col-span-24">
            <FormRadioGroup<App.Data.InvoiceTypeData>
              autoFocus
              label="Rechnungsart"
              itemName={'display_name'}
              items={invoice_types}
              {...form.register('type_id')}
            />
          </div>
        </FormGrid>
        <FormGrid>
          <div className="col-span-8">
            <FormDatePicker label="Rechnungsdatum" {...form.register('issued_on')} />
          </div>
          <div className="col-span-4" />

          <div className="col-span-12">
            <FormDateRangePicker
              label="Leistungsdatum"
              {...form.registerDateRange('service_period_begin', 'service_period_end')}
            />
          </div>
        </FormGrid>
        <FormGrid>
          <div className="col-span-12">
            <FormSelect<App.Data.PaymentDeadlineData>
              {...form.register('payment_deadline_id')}
              label="Zahlungsziel"
              items={payment_deadlines}
            />
          </div>
          <div className="col-span-12">
            <FormSelect<App.Data.TaxData>
              {...form.register('tax_id')}
              label="Umsatzsteuer"
              items={taxes}
            />
          </div>
          <div className="col-span-24">
            <FormComboBox<App.Data.ProjectData>
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
        </FormGrid>
      </Form>
    </Dialog>
  )
}

export default InvoiceDetailsEditBaseData
