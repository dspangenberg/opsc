import type * as React from 'react'
import { usePage } from '@inertiajs/react'
import type { PageProps } from '@/Types'
import { ContactDetailsOrg } from '@/Pages/App/Contact/ContactDetailsOrg'
import { ContactDetailsPerson } from '@/Pages/App/Contact/ContactDetailsPerson'
import { ContactDetailsLayout } from '@/Pages/App/Contact/ContactDetailsLayout'

interface ContactIndexProps extends PageProps {
  contact: App.Data.ContactData
}

const ContactDetails: React.FC = () => {
  const { contact } = usePage<ContactIndexProps>().props

  return (
    <ContactDetailsLayout contact={contact}>
      <div className="flex-1">xxx</div>
      <div className="w-sm flex-none overflow-hidden py-6 h-fit px-1 !space-y-6">
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
