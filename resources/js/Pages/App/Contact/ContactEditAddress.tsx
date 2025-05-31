import type * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useModal } from '@inertiaui/modal-react'
import { Form, useForm } from '@/Components/twcui/form'
import { InertiaDialog } from '@/Components/InertiaDialog'
import type { PageProps } from '@/Types'
import { Select } from '@/Components/twcui/select'
import { Input } from '@/Components/twcui/input'
import { Button } from '@/Components/twcui/button'
import { FormGroup } from '@/Components/twcui/form-group'
import { Tab, TabList, TabPanel, Tabs } from "@/Components/twcui/tabs"

interface Props extends PageProps {
  contact: App.Data.ContactData
  address: App.Data.ContactAddressData
  children: React.ReactNode
  countries: App.Data.CountryData[]
  categories: App.Data.AddressCategoryData[]
}

const ContactEditAddress: React.FC<Props> = () => {
  const { close } = useModal()

  const address = useModal().props.address as App.Data.ContactAddressData
  const countries = useModal().props.countries as App.Data.CountryData[]
  const categories = useModal().props.categories as App.Data.AddressCategoryData[]
  const [date, setDate] = useState<Date>()

  const handleClose = () => {
    close()
  }
  const selectRef = useRef<HTMLButtonElement>(null)

  const title = address.id ? 'Anschrift bearbeiten' : 'Neue Anschrift hinzufügen'

  const {
    form
  } =
    useForm<App.Data.ContactAddressData>(
      'form-contact-edit-address',
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

  return (
    <InertiaDialog
      title={title}
      dismissible={true}
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form={form.id} type="submit">
            Speichern
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        onSubmitted={() => {handleClose()}}
      >
      <Tabs className="w-full flex">
        <TabList aria-label="History of Ancient Rome" className="flex-1 bg-page-content border-b justify-start">
          <Tab id="FoR">Stammdaten</Tab>
          <Tab id="MaR">Komunikation</Tab>
          <Tab id="Emp">Empire</Tab>
        </TabList>
        <TabPanel id="FoR">
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
              <Input
                name="address"
                label="Anschrift"
                textArea
                rows={2}
                {...form.register('address')}
              />
            </div>
            <div className="col-span-6">
              <Input
                label="PLZ"
                required
                {...form.register('zip')}
              />
            </div>
            <div className="col-span-18">
              <Input
                name="city"
                label="Ort"
                required
                {...form.register('city')}
              />
            </div>
            <div className="col-span-24">
              <Select<App.Data.CountryData>
                {...form.register('country_id')}
                label="Land"
                items={countries}
              />
            </div>
          </FormGroup>
        </TabPanel>
        <TabPanel id="MaR">Senatus Populusque Romanus.</TabPanel>
        <TabPanel id="Emp">Alea jacta est.</TabPanel>
      </Tabs>




      </Form>
    </InertiaDialog>
  )
}

export default ContactEditAddress
