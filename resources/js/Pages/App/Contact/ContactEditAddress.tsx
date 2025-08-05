import { useForm } from '@/Components/ui/twc-ui/form'
import type { PageProps } from '@/Types'
import type * as React from 'react'
import { useRef } from 'react'

interface Props extends PageProps {
  contact: App.Data.ContactData
  address: App.Data.ContactAddressData
  children: React.ReactNode
  countries: App.Data.CountryData[]
  categories: App.Data.AddressCategoryData[]
}

const ContactEditAddress: React.FC<Props> = () => {
  const selectRef = useRef<HTMLButtonElement>(null)

  const title = address.id ? 'Anschrift bearbeiten' : 'Neue Anschrift hinzufügen'

  const form = useForm<App.Data.ContactAddressData>(
    'form-contact-edit-address',
    address.id ? 'put' : 'post',
    route(address.id ? 'app.contact.address.update' : 'app.contact.address.store', {
      contact: address.contact_id,
      contact_address: address.id
    }),
    address
  )

  return <div />
}

export default ContactEditAddress
