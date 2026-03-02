import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { DataTable } from '@/Components/DataTable'
import { ContactDetailsLayout } from '@/Pages/App/Contact/ContactDetailsLayout'
import { createColumns } from '@/Pages/App/Contact/ContactDetailsPersonsColumns'
import type { PageProps } from '@/Types'

interface ContactDetailsPersons extends PageProps {
  contact: App.Data.ContactData
}

const ContactDetailsPersons: React.FC = () => {
  const { contact } = usePage<ContactDetailsPersons>().props
  const columns = createColumns(contact)

  return (
    <ContactDetailsLayout contact={contact}>
      <DataTable columns={columns} data={contact.contacts || []} />
    </ContactDetailsLayout>
  )
}

export default ContactDetailsPersons
