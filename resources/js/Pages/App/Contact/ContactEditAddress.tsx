import type * as React from 'react'
import { useEffect, useRef } from 'react'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { InertiaDialog } from '@/Components/InertiaDialog'
import type { PageProps } from '@/Types'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import { Button } from '@/Components/ui/twc-ui/button'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Tab, TabList, Tabs, TabPanel } from '@/Components/ui/twc-ui/tabs'
import { usePage } from '@inertiajs/react'

interface Props extends PageProps {
  contact: App.Data.ContactData
  address: App.Data.ContactAddressData
  children: React.ReactNode
  countries: App.Data.CountryData[]
  categories: App.Data.AddressCategoryData[]
}

const ContactEditAddress: React.FC<Props> = () => {
  const close = () => {}

  const address = usePage().props.address as App.Data.ContactAddressData
  const countries = usePage().props.countries as App.Data.CountryData[]
  const categories = usePage().props.categories as App.Data.AddressCategoryData[]

  const handleClose = () => {
    close()
  }
  const selectRef = useRef<HTMLButtonElement>(null)

  const title = address.id ? 'Anschrift bearbeiten' : 'Neue Anschrift hinzufügen'

  const
    form = useForm<App.Data.ContactAddressData>(
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
        className="flex flex-col bg-background"
      >

        <Tabs variant="classic" className="" tabClassName="data-[selected]:bg-background">
          <TabList aria-label="History of Ancient Rome" className='bg-muted px-4 pt-2'>
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
              <TextField
                label="Anschrift"
                textArea
                rows={2}
                {...form.register('address')}
              />
            </div>
            <div className="col-span-6">
              <TextField
                label="PLZ"
                {...form.register('zip')}
              />
            </div>
            <div className="col-span-18">
              <TextField
                label="Ort"
                {...form.register('city')}
              />
            </div>
            <div className="col-span-24">
              <Select<App.Data.CountryData>
                {...form.register('country_id')}
                label="Land"
                itemName='iso_code'
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
