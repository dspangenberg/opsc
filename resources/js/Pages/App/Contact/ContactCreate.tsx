import { Clock05Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/ui/twc-ui/button'
import { Checkbox } from '@/Components/ui/twc-ui/checkbox'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { RadioGroup } from '@/Components/ui/twc-ui/radio-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  contact: App.Data.ContactData
  salutations: App.Data.SalutationData[]
  titles: App.Data.TitleData[]
}

interface TypeOptionsInterface extends Record<string, unknown> {
  id: string
  name: string
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
        <FormGroup>
          <div className="col-span-24">
            <Checkbox {...form.registerCheckbox('is_org')} autoFocus className="pt-1.5">
              Neuer Kontakt ist eine Organisation
            </Checkbox>
          </div>

          {isOrganization ? (
            <div className="col-span-24">
              <TextField label="Name der Organisation" {...form.register('name')} />
            </div>
          ) : (
            <>
              <div className="col-span-3">
                <Select<App.Data.SalutationData>
                  {...form.register('salutation_id')}
                  label="Geschl."
                  items={salutations}
                  itemName="gender"
                />
              </div>
              <div className="col-span-5">
                <Select<App.Data.TitleData>
                  label="Titel"
                  isOptional
                  {...form.register('title_id')}
                  items={titles}
                />
              </div>
              <div className="col-span-8">
                <TextField label="Vorname" {...form.register('first_name')} />
              </div>
              <div className="col-span-8">
                <TextField label="Nachname" {...form.register('name')} />
              </div>
            </>
          )}
        </FormGroup>
      </Form>
    </Dialog>
  )
}

export default ContactCreate
