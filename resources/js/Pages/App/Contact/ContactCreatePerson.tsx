import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  contact: App.Data.ContactData
  salutations: App.Data.SalutationData[]
  titles: App.Data.TitleData[]
}
const ContactCreate: React.FC<Props> = ({ contact, salutations, titles }) => {
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<App.Data.ContactData>(
    'form-contact-create-person',
    'post',
    route('app.contact.store-person'),
    contact
  )

  const handleClose = () => {
    setIsOpen(false)
    router.visit(route('app.contact.details', { contact: contact.company_id }))
  }

  const handleOnSubmit = () => setIsOpen(false)

  return (
    <Dialog
      isOpen={isOpen}
      width="2xl"
      onClosed={handleClose}
      title="Neue Ansprechparon hinzufügen"
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
      <Form form={form} onSubmitted={handleOnSubmit}>
        <FormGrid>
          <div className="col-span-3">
            <FormSelect<App.Data.SalutationData>
              {...form.register('salutation_id')}
              label="Geschl."
              items={salutations}
              itemName="gender"
            />
          </div>
          <div className="col-span-5">
            <FormSelect<App.Data.TitleData>
              label="Titel"
              isOptional
              {...form.register('title_id')}
              items={titles}
            />
          </div>
          <div className="col-span-8">
            <FormTextField label="Vorname" {...form.register('first_name')} />
          </div>
          <div className="col-span-8">
            <FormTextField label="Nachname" {...form.register('name')} />
          </div>
        </FormGrid>
      </Form>
    </Dialog>
  )
}

export default ContactCreate
