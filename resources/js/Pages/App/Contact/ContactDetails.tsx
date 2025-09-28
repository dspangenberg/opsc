import { Button, FormGroup } from '@dspangenberg/twcui'
import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { NotesView } from '@/Components/ui/twc-ui/NotesView'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import { ContactDetailsLayout } from '@/Pages/App/Contact/ContactDetailsLayout'
import { ContactDetailsOrg } from '@/Pages/App/Contact/ContactDetailsOrg'
import { ContactDetailsPerson } from '@/Pages/App/Contact/ContactDetailsPerson'
import type { PageProps } from '@/Types'

interface ContactIndexProps extends PageProps {
  contact: App.Data.ContactData
}

interface CommentProps extends Record<string, any> {
  note: string
}

const ContactDetails: React.FC = () => {
  const { contact } = usePage<ContactIndexProps>().props

  const form = useForm<CommentProps>(
    'contact-note-form',
    'post',
    route('app.contact.note-store', { contact: contact.id }),
    {
      note: ''
    }
  )

  return (
    <ContactDetailsLayout contact={contact}>
      <div className="flex-1">
        <Form form={form}>
          <FormGroup>
            <div className="col-span-24">
              <TextField textArea label="Notiz" {...form.register('note')} />
            </div>
            <div className="col-span-24 flex justify-end">
              <Button
                type="submit"
                variant="default"
                title="Notiz speichern"
                disabled={!form.data.note}
                loading={form.processing}
              />
            </div>
          </FormGroup>
        </Form>
        <NotesView notes={contact.notables || []} />
      </div>
      <div className="!space-y-6 h-fit w-sm flex-none overflow-hidden px-1 py-6">
        {contact.company_id !== 0 && <ContactDetailsPerson contact={contact} />}
        <ContactDetailsOrg
          contact={contact.company || contact}
          showSecondary={contact.company_id === 0}
        />
      </div>
    </ContactDetailsLayout>
  )
}

export default ContactDetails
