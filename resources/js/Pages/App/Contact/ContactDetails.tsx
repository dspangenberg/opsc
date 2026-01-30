import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { NotesView } from '@/Components/NotesView'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
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
        <Form form={form} onSubmitted={() => form.reset()}>
          <FormGrid>
            <div className="col-span-24">
              <FormTextArea label="Notiz" {...form.register('note')} />
            </div>
            <div className="col-span-24 flex justify-end">
              <Button
                type="submit"
                variant="default"
                title="Notiz speichern"
                disabled={!form.data.note}
                isLoading={form.processing}
              />
            </div>
          </FormGrid>
        </Form>
        <NotesView notes={contact.notables || []} />
      </div>
      <div className="h-fit w-sm max-w-sm flex-none space-y-6! overflow-hidden px-1 py-6">
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
