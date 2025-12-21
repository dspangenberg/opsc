/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Dialog } from '@/Components/twc-ui/dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/select'

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
        <FormGrid>
          <div className="col-span-24"></div>
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
        </FormGrid>
      </Form>
    </Dialog>
  )
}

export default ContactEdit
