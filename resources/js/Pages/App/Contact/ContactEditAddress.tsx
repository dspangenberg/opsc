/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/ui/twc-ui/button'
import { Checkbox } from '@/Components/ui/twc-ui/checkbox'
import { ComboBox } from '@/Components/ui/twc-ui/combo-box'
import { DatePicker, DateRangePicker } from '@/Components/ui/twc-ui/date-picker'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { RadioGroup } from '@/Components/ui/twc-ui/radio-group'
import { Select } from '@/Components/ui/twc-ui/select'

interface Props {
  contact: App.Data.ContactData
  taxes: App.Data.TaxData[]
  payment_deadlines: App.Data.PaymentDeadlineData[]
}

export const ContactEdit: React.FC<Props> = ({ contact, payment_deadlines, taxes }) => {
  const form = useForm<App.Data.ContactData>(
    'contact-form',
    'put',
    route('app.contact.update', { contact: contact.id }),
    contact
  )
  const [isOpen, setIsOpen] = useState(true)
  const handleOnClosed = () => {
    setIsOpen(false)
    router.visit(route('app.contact.details', { contact: contact.id }))
  }

  return (
    <Dialog
      isOpen={isOpen}
      confirmClose={form.isDirty}
      title="Kontakt bearbeiten"
      onClosed={handleOnClosed}
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
          <div className="col-span-24"></div>
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
        </FormGroup>
      </Form>
    </Dialog>
  )
}

export default ContactEdit
