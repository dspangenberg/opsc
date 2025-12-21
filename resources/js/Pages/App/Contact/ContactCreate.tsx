import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { Dialog } from '@/Components/twc-ui/dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/select'
import { FormTextField } from '@/Components/twc-ui/text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  contact: App.Data.ContactData
  salutations: App.Data.SalutationData[]
  titles: App.Data.TitleData[]
}
const ContactCreate: React.FC<Props> = ({ contact, salutations, titles }) => {
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<App.Data.ContactData>(
    'form-contact-edit-address',
    'post',
    route('app.contact.store'),
    contact
  )

  const handleClose = () => {
    setIsOpen(false)
    router.visit(route('app.contacts.index'))
  }

  // Hilfsvariable für bessere Lesbarkeit
  const isOrganization = !!form.data.is_org

  return (
    <Dialog
      isOpen={isOpen}
      width="2xl"
      onClosed={handleClose}
      title="Neuen Kontakt hinzufügen"
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
      <Form form={form} onSubmitted={handleClose}>
        <FormGrid>
          <div className="col-span-24">
            <Checkbox {...form.registerCheckbox('is_org')} autoFocus className="pt-1.5">
              Neuer Kontakt ist eine Organisation
            </Checkbox>
          </div>

          {isOrganization ? (
            <div className="col-span-24">
              <FormTextField label="Name der Organisation" {...form.register('name')} />
            </div>
          ) : (
            <>
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
            </>
          )}
        </FormGrid>
      </Form>
    </Dialog>
  )
}

export default ContactCreate
