import type * as React from 'react'

import { Button } from "@/Components/twcui/button"
import { Select } from '@/Components/twcui/select'
import { Form, useForm } from '@/Components/twcui/form'
import { Combobox } from '@/Components/twcui/combobox'
import { Dialog } from '@/Components/twcui/dialog'
import { createDateRangeChangeHandler, DatePicker, DateRangePicker } from '@/Components/twcui/date-picker'
import { Checkbox } from '@/Components/jolly-ui/checkbox'
import { RadioGroup } from '@/Components/twcui/radio-group'
import { FormGroup } from '@/Components/twcui/form-group'
import { router } from '@inertiajs/react'

interface Props {
  invoice: App.Data.InvoiceData
  invoice_types: App.Data.InvoiceTypeData[]
  projects: App.Data.ProjectData[]
  taxes: App.Data.TaxData[]
  payment_deadlines: App.Data.PaymentDeadlineData[]
}

export const InvoiceDetailsEditBaseDataDialog: React.FC<Props> = ({
  invoice,
  invoice_types,
  payment_deadlines,
  projects,
  taxes
}) => {

  const {
    form,
    errors,
    data,
    updateAndValidateWithoutEvent
  } = useForm<App.Data.InvoiceData>(
    'basedata-form',
    'put',
    route('app.invoice.base-update', { invoice: invoice.id }),
    invoice
  )

  const handlePeriodChange = createDateRangeChangeHandler(
    updateAndValidateWithoutEvent,
    'service_period_begin',
    'service_period_end'
  )
  // No need for isClosingAfterConfirmation state anymore since we're using renderProps.close() directly

  const handleOnClosed = () => {
    router.get(route('app.invoice.details', { invoice: invoice.id }))
  }

  return (
    <Dialog
      isOpen={true}
      confirmClose={form.isDirty}
      title="Rechnungsstammdaten bearbeiten"
      confirmationVariant='destructive'
      onClosed={handleOnClosed}
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
          <div className="col-span-24">
            <RadioGroup
              autoFocus
              label='Rechnungsart'
              itemName={'display_name'}
              items={invoice_types}
              {...form.register('type_id')}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className="col-span-8">
            <DatePicker
              label="Rechnungsdatum"
              {...form.register('issued_on')}
            />
          </div>
          <div className="col-span-4" />

          <div className="col-span-12">
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
        <FormGroup>

          <div className="col-span-12">
            <Select<App.Data.PaymentDeadlineData>
              {...form.register('payment_deadline_id')}
              label="Zahlungsziel"
              items={payment_deadlines}
            />
          </div>
          <div className="col-span-12">
            <Select<App.Data.TaxData>
              {...form.register('tax_id')}
              label="Umsatzsteuer"
              items={taxes}
            />
          </div>
          <div className="col-span-24">
            <Combobox<App.Data.ProjectData>
              label="Projekt"
              {...form.register('project_id')}
              isOptional
              optionalValue="(kein Projekt)"
              items={projects}
            />
            <Checkbox
              {...form.registerCheckbox('is_recurring')}
              className="pt-1.5"
            >
              Wiederkehrende Rechnung
            </Checkbox>
          </div>
        </FormGroup>
      </Form>
    </Dialog>
  )
}
