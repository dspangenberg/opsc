import { InertiaDialog } from '@/Components/InertiaDialog'
import { Button } from '@/Components/ui/twc-ui/button'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { Tab, TabList, TabPanel, Tabs } from '@/Components/ui/twc-ui/tabs'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import type { PageProps } from '@/Types'
import { useModal } from '@inertiaui/modal-react'
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
  const { close, afterLeave } = useModal()

  const address = useModal().props.address as App.Data.ContactAddressData
  const contact = useModal().props.address as App.Data.ContactData
  const countries = useModal().props.countries as App.Data.CountryData[]
  const categories = useModal().props.categories as App.Data.AddressCategoryData[]

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

  return (
    <InertiaDialog
      confirmClose={form.isDirty}
      onClosed={afterLeave}
      title={title}
      footer={handleFooterEvents => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => handleFooterEvents?.(true)} // true = isCancel
          >
            Abbrechen
          </Button>
          <Button form={form.id} type="submit">
            Speichern
          </Button>
        </div>
      )}
    >
      <Form
        form={form}
        onSubmitted={() => {
          close()
          afterLeave()
        }}
        className="flex flex-col bg-background"
      >
        <Tabs
          variant="classic"
          className=""
          tabClassName="data-[selected]:bg-background"
          defaultSelectedKey="addresses"
        >
          <TabList aria-label="History of Ancient Rome" className="bg-muted px-4 pt-2">
            <Tab id="base">Stammdaten</Tab>
            <Tab id="addresses">Anschriften</Tab>
            <Tab id="communicaion">Kommunikation</Tab>
            <Tab id="Emp">Empire</Tab>
          </TabList>
          <TabPanel id="addresses">
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
          </TabPanel>
          <TabPanel id="MaR">Senatus Populusque Romanus.</TabPanel>
          <TabPanel id="Emp">Alea jacta est.</TabPanel>
        </Tabs>
      </Form>
    </InertiaDialog>
  )
}

export default ContactEditAddress
