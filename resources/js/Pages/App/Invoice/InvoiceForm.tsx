import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect, useMemo } from 'react'
import type { RouteUrl } from 'ziggy-js'
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
import { cn } from '@/Lib/utils'

type InvoiceFormData = Omit<
  App.Data.InvoiceData,
  | 'parent_invoice'
  | 'contact'
  | 'invoice_contact'
  | 'project'
  | 'lines'
  | 'offer'
  | 'notables'
  | 'type'
  | 'payment_deadline'
  | 'tax'
  | 'payable'
  | 'booking'
>

interface Props {
  invoice: App.Data.InvoiceData
  invoice_types: App.Data.InvoiceTypeData[]
  projects: App.Data.ProjectData[]
  taxes: App.Data.TaxData[]
  payment_deadlines: App.Data.PaymentDeadlineData[]
  contacts: App.Data.ContactData[]
  method: 'post' | 'put'
  saveRoute: RouteUrl
  cancelRoute: RouteUrl
  className?: string
}

export const InvoiceForm: React.FC<Props> = ({
  className,
  method,
  saveRoute,
  cancelRoute,
  contacts,
  invoice,
  invoice_types,
  payment_deadlines,
  projects,
  taxes
}) => {
  const form = useForm<InvoiceFormData>('invoice-form', method, saveRoute, invoice)

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
        router.visit(cancelRoute)
      }
    } else {
      router.visit(cancelRoute)
    }
  }

  const invoiceContacts =
    contacts.find(contact => contact.id === form.data.contact_id)?.contacts ?? []

  useEffect(() => {
    const selectedContact = contacts.find(contact => contact.id === form.data.contact_id)

    if (!selectedContact) {
      form.setData('invoice_contact_id', 0 as number)
      form.setData('dunning_block', false)
      return
    }

    form.setData('invoice_contact_id', selectedContact.invoice_contact_id ?? (0 as number))
    form.setData('dunning_block', Boolean(selectedContact.has_dunning_block))
  }, [form.data.contact_id, contacts])

  return (
    <FormCard
      className={cn('flex max-w-3xl flex-1 overflow-y-hidden', className)}
      innerClassName="bg-background"
      footer={
        <div className="flex flex-none items-center justify-end gap-2">
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
          <div className="col-span-5">
            <FormDatePicker
              label="Rechnungsdatum"
              {...form.register('issued_on')}
              isDisabled={!invoice.is_draft}
            />
          </div>

          <div className="col-span-19" />
          <div className="col-span-12">
            <FormComboBox<App.Data.ContactData>
              label="Debitor"
              isDisabled={!invoice.is_draft}
              itemName="reverse_full_name"
              {...form.register('contact_id')}
              items={contacts}
            />
          </div>
          <div className="col-span-12">
            <FormComboBox<App.Data.ContactData>
              label="Rechnungskontakt"
              isDisabled={!invoice.is_draft || !invoiceContacts.length}
              itemName="reverse_full_name"
              isOptional
              {...form.register('invoice_contact_id')}
              items={invoiceContacts}
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
          <div className="col-span-12">
            <FormDateRangePicker
              label="Leistungsdatum"
              isDisabled={!invoice.is_draft}
              {...form.registerDateRange('service_period_begin', 'service_period_end')}
            />
          </div>
          <div className="col-span-12">
            <FormComboBox<App.Data.ProjectData>
              label="Projekt"
              {...form.register('project_id')}
              isOptional
              isDisabled={!invoice.is_draft}
              optionalValue="(kein Projekt)"
              items={projects}
            />
          </div>
          <div className="col-span-24">
            <FormTextArea
              label="Zusatztext"
              {...form.register('additional_text')}
              isDisabled={!invoice.is_draft}
            />
            <div className="flex flex-none gap-4 pt-1.5">
              <Checkbox {...form.registerCheckbox('is_recurring')}>
                Wiederkehrende Rechnung
              </Checkbox>
              <Checkbox {...form.registerCheckbox('dunning_block')}>Mahnsperre</Checkbox>
            </div>
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
  )
}
