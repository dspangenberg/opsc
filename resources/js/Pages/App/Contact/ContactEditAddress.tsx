import {type FormEvent, useEffect, useRef} from 'react'
import type * as React from 'react'
import { useModal } from '@inertiaui/modal-react'

import {
  Button,
  FormErrors,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  type Option
} from '@dspangenberg/twcui'
import { InertiaDialog } from '@/Components/InertiaDialog'
import type { PageProps } from '@/Types'
import { useForm } from '@/Hooks/use-form-old'
interface Props extends PageProps {
  contact: App.Data.ContactData
  address: App.Data.ContactAddressData
  children: React.ReactNode
  countries: App.Data.CountryData[]
  categories: App.Data.AddressCategoryData[]
}

const ContactEditAddress: React.FC<Props> = () => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const { close } = useModal()


  const address = useModal().props.address as App.Data.ContactAddressData
  const countries = useModal().props.countries as App.Data.CountryData[]
  const categories = useModal().props.categories as App.Data.AddressCategoryData[]

  const handleClose = () => {
    close()
  }
  const selectRef = useRef<HTMLButtonElement>(null)

  const title = address.id ? 'Anschrift bearbeiten' : 'Neue Anschrift hinzufügen'

  const { data, errors, updateAndValidate, submit, updateAndValidateWithoutEvent } =
    useForm<App.Data.ContactAddressData>(
      address.id ? 'put' : 'post',
      route(address.id ? 'app.contact.address.update' : 'app.contact.address.store', {
        contact: address.contact_id,
        contact_address: address.id
      }),
      address
    )

  useEffect(() => {
    selectRef.current?.focus()
  }, [])

  const categoryOptions: Option[] = categories.map(category => ({
    value: category.id as unknown as string,
    label: category.name
  }))

  const countryOptions: Option[] = countries.map(category => ({
    value: category.id as unknown as string,
    label: category.name
  }))

  const handleValueChange = (name: keyof App.Data.ContactAddressData, value: string) => {
    updateAndValidateWithoutEvent(name, Number.parseInt(value))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      await submit(event)
      close()
    } catch (error) {}
  }

  return (
    <InertiaDialog
      ref={dialogRef}
      title={title}
      onClose={handleClose}
      className="max-w-xl"
      description="Saisons, Zeiträume und Buchungsbeschränkungen werden hier festgelegt."
      data-inertia-dialog
      dismissible={true}
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form="contactAddressForm" type="submit">
            Speichern
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} id="contactAddressForm">
        <FormErrors errors={errors} />
        <FormGroup>
          <div className="col-span-24">
            <FormSelect
              ref={selectRef}
              name="address_category_id"
              label="Kategorie"
              value={data.address_category_id as unknown as string}
              error={errors?.address_category_id || ''}
              onValueChange={value => handleValueChange('address_category_id', value)}
              options={categoryOptions}
            />
          </div>
          <div className="col-span-24">
            <FormTextarea
              name="address"
              label="Anschrift"
              rows={2}
              value={data.address}
              error={errors?.address || ''}
              onChange={updateAndValidate}
            />
          </div>
          <div className="col-span-4">
            <FormInput
              name="zip"
              label="PLZ"
              value={data.zip}
              error={errors?.zip || ''}
              onChange={updateAndValidate}
            />
          </div>
          <div className="col-span-20">
            <FormInput
              name="city"
              label="Ort"
              value={data.city}
              error={errors?.city || ''}
              onChange={updateAndValidate}
            />
          </div>
          <div className="col-span-24">
            <FormSelect
              name="country_id"
              label="Land"
              value={data.country_id as unknown as string}
              error={errors?.country_id || ''}
              onValueChange={value => handleValueChange('country_id', value)}
              options={countryOptions}
            />
          </div>
        </FormGroup>
      </form>
    </InertiaDialog>
  )
}

export default ContactEditAddress
