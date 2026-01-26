import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormDateRangePicker } from '@/Components/twc-ui/form-date-range-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormNumberField } from '@/Components/twc-ui/form-number-field'
import { FormRadioGroup } from '@/Components/twc-ui/form-radio-group'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoiceDetailsLayout } from './InvoiceDetailsLayout'

interface Props {
  invoice: App.Data.InvoiceData
  invoice_types: App.Data.InvoiceTypeData[]
  projects: App.Data.ProjectData[]
  taxes: App.Data.TaxData[]
  payment_deadlines: App.Data.PaymentDeadlineData[]
  contacts: App.Data.ContactData[]
}

export const InvoiceDetailsEditBaseData: React.FC<Props> = ({
  contacts,
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

  const cancelButtonTitle = form.isDirty ? 'Abbrechen' : 'Zurück'

  const recurringIntervalOptions = useMemo(
    () => [
      { name: 'Tage', id: 'days' },
      { name: 'Wochen', id: 'weeks' },
      { name: 'Monate', id: 'months' },
      { name: 'Jahre', id: 'years' }
    ],
    []
  )

  const handleCancel = async () => {
    if (form.isDirty) {
      const promise = await AlertDialog.call({
        title: 'Änderungen verwerfen',
        message: `Möchtest Du die Änderungen verwerfen?`,
        buttonTitle: 'Verwerfen'
      })
      if (promise) {
        router.visit(route('app.invoice.details', { invoice: invoice.id }))
      }
    } else {
      router.visit(route('app.invoice.details', { invoice: invoice.id }))
    }
  }

  return (
    <InvoiceDetailsLayout invoice={invoice}>
      <FormCard
        className="flex max-w-4xl flex-1 overflow-y-hidden"
        innerClassName="bg-background"
        footer={
          <div className="flex flex-none items-center justify-end gap-2 px-4 py-2">
            <Button variant="outline" onClick={handleCancel} title={cancelButtonTitle} />
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        <Form form={form}>
          <FormGrid>
            <div className="col-span-24">
              <FormRadioGroup<App.Data.InvoiceTypeData>
                autoFocus
                label="Rechnungsart"
                itemName={'display_name'}
                isDisabled={!invoice.is_draft}
                items={invoice_types}
                {...form.register('type_id')}
              />
            </div>
          </FormGrid>
          <FormGrid>
            <div className="col-span-4">
              <FormDatePicker
                label="Rechnungsdatum"
                {...form.register('issued_on')}
                isDisabled={!invoice.is_draft}
              />
            </div>

            <div className="col-span-8">
              <FormDateRangePicker
                label="Leistungsdatum"
                isDisabled={!invoice.is_draft}
                {...form.registerDateRange('service_period_begin', 'service_period_end')}
              />
            </div>
            <div className="col-span-12">
              <FormComboBox<App.Data.ContactData>
                label="Debitor"
                isDisabled={!invoice.is_draft}
                itemName="reverse_full_name"
                {...form.register('contact_id')}
                items={contacts}
              />
            </div>
          </FormGrid>
          <FormGrid>
            <div className="col-span-12">
              <FormSelect<App.Data.PaymentDeadlineData>
                isDisabled={!invoice.is_draft}
                {...form.register('payment_deadline_id')}
                label="Zahlungsziel"
                items={payment_deadlines}
              />
            </div>
            <div className="col-span-12">
              <FormSelect<App.Data.TaxData>
                isDisabled={!invoice.is_draft}
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
                isDisabled={!invoice.is_draft}
                optionalValue="(kein Projekt)"
                items={projects}
              />
              <Checkbox {...form.registerCheckbox('is_recurring')} className="pt-1.5">
                Wiederkehrende Rechnung
              </Checkbox>
            </div>
            <div className="col-span-24">
              <FormTextArea
                label="Zusatztext"
                {...form.register('additional_text')}
                isDisabled={!invoice.is_draft}
              />
            </div>
          </FormGrid>
          {form.data.is_recurring && (
            <FormGrid title="Wiederkehrende Rechnung">
              <div className="col-span-4">
                <FormNumberField
                  label="Anzahl"
                  formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                  {...form.register('recurring_interval_units')}
                />
              </div>
              <div className="col-span-8">
                <FormSelect
                  items={recurringIntervalOptions}
                  label="Interval"
                  {...form.register('recurring_interval')}
                />
              </div>
              <div className="col-span-6">
                <FormDatePicker label="Startdatum" {...form.register('recurring_begin_on')} />
              </div>
              <div className="col-span-6">
                <FormDatePicker label="Enddatum" {...form.register('recurring_end_on')} />
              </div>
            </FormGrid>
          )}
        </Form>
      </FormCard>
      <div className="h-fit w-sm flex-none space-y-6 px-1">
        <InvoiceDetailsSide invoice={invoice} />
      </div>
    </InvoiceDetailsLayout>
  )
}

export default InvoiceDetailsEditBaseData
