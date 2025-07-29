import { useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import type * as React from 'react'

interface Props {
  contact: App.Data.ContactData
  address: App.Data.ContactAddressData
  countries: App.Data.CountryData[]
  categories: App.Data.AddressCategoryData[]
}

export const ContactEditFormAddress: React.FC<Props> = ({
  contact,
  address,
  countries,
  categories
}) => {
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

  return (
    <>
      <FormGroup>
        <div className="col-span-24">
          <Select<App.Data.AddressCategoryData>
            autoFocus
            {...form.register('address_category_id')}
            label="Kategorie"
            items={categories}
          />
        </div>
        <div className="col-span-24">
          <TextField label="Anschrift" textArea rows={2} {...form.register('address')} />
        </div>
        <div className="col-span-6">
          <TextField label="PLZ" {...form.register('zip')} />
        </div>
        <div className="col-span-18">
          <TextField label="Ort" {...form.register('city')} />
        </div>
        <div className="col-span-24">
          <Select<App.Data.CountryData>
            {...form.register('country_id')}
            label="Land"
            items={countries}
          />
        </div>
      </FormGroup>
    </>
  )
}
