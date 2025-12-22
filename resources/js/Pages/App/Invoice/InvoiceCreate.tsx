import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormDateRangePicker } from '@/Components/twc-ui/form-date-range-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormRadioGroup } from '@/Components/twc-ui/form-radio-group'
import { FormSelect } from '@/Components/twc-ui/form-select'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  invoice: App.Data.InvoiceData
  projects: App.Data.ProjectData[]
  invoice_types: App.Data.InvoiceTypeData[]
  taxes: App.Data.TaxData[]
  payment_deadlines: App.Data.PaymentDeadlineData[]
  contacts: App.Data.ContactData[]
}

const InvoiceCreate: React.FC<Props> = ({
  invoice,
  contacts,
  projects,
  invoice_types,
  taxes,
  payment_deadlines
}) => {
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<App.Data.InvoiceData>(
    'form-invoice-create',
    'post',
    route('app.invoice.store'),
    invoice
  )

  const handleClose = () => {
    router.visit(route('app.invoice.index'))
  }

  const handleSubmit = () => {
    setIsOpen(false)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClosed={handleClose}
      title="Rechnung erstellen"
      confirmClose={form.isDirty}
      footer={dialogRenderProps => (
        <div className="mx-0 flex w-full gap-2">
          <div className="flex flex-1 justify-start" />
          <div className="flex flex-none gap-2">
            <Button variant="outline" onClick={dialogRenderProps.close}>
              Abbrechen
            </Button>
            <Button variant="default" form={form.id} type="submit">
              Speichern
            </Button>
          </div>
        </div>
      )}
    >
      <Form form={form} onSubmitted={handleSubmit}>
        <FormGrid>
          <div className="col-span-24">
            <FormComboBox<App.Data.ContactData>
              label="Kunde"
              {...form.register('contact_id')}
              autoFocus
              itemName="reverse_full_name"
              items={contacts}
            />
          </div>
          <div className="col-span-24">
            <FormRadioGroup<App.Data.InvoiceTypeData>
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
            <FormSelect<App.Data.ProjectData>
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

export default InvoiceCreate
