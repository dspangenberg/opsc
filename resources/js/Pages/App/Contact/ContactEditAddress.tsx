import type * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useModal } from '@inertiaui/modal-react'
import { Form, useForm } from '@/Components/twcui/form'
import { InertiaDialog } from '@/Components/InertiaDialog'
import type { PageProps } from '@/Types'
import { FormErrors, FormCombobox, FormGroup, Button, FormNumberInput, FormInput, FormSelect, FormTextarea } from '@/Components/ui/tw-cloud-ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@/Components/ui/kibo-ui/combobox';
import { Popover, PopoverDialog, PopoverTrigger } from '@/Components/jolly-ui/popover'
import { cn } from '@/Lib/utils'
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/Components/ui/calendar"

interface Props extends PageProps {
  contact: App.Data.ContactData
  address: App.Data.ContactAddressData
  children: React.ReactNode
  countries: App.Data.CountryData[]
  categories: App.Data.AddressCategoryData[]
}


const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
  {
    value: 'vite',
    label: 'Vite',
  },
];

const ContactEditAddress: React.FC<Props> = () => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const { close } = useModal()
  const [hourly, setHourly] = useState<number>(0)

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
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      <Form
        form={form}
      >
        <FormErrors errors={form.errors} />
        <FormGroup>
        <div className="col-span-24">
        <Combobox
          data={frameworks}
          type="framework"
          onOpenChange={(open) => console.log('Combobox is open?', open)}
          onValueChange={(newValue) => console.log('Combobox value:', newValue)}
        >
          <ComboboxTrigger />
          <ComboboxContent>
            <ComboboxInput />
            <ComboboxEmpty />
            <ComboboxList>
              <ComboboxGroup>
                {frameworks.map((framework) => (
                  <ComboboxItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
          </div>
          <div className="col-span-12">
            <Popover>
              <PopoverTrigger>
                <Button
                  variant={"outline"}
                  type="button"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>

              <PopoverDialog   className="w-auto p-0" >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                />

              </PopoverDialog>
              </PopoverTrigger>
            </Popover>
          </div>
          <div className="col-span-24">
            <FormCombobox<App.Data.AddressCategoryData>
              ref={selectRef}
              required
              label="Kategorie"
              {...form.register('address_category_id')}
              options={categories}
            />
          </div>
          <div className="col-span-24">
            <FormTextarea
              name="address"
              label="Anschrift"
              rows={2}
              {...form.register('address')}
            />
          </div>
          <div className="col-span-4">
            <FormInput
              label="PLZ"
              required
              {...form.register('zip')}
            />
          </div>
          <div className="col-span-20">
            <FormInput
              name="city"
              label="Ort"
              required
              {...form.register('city')}
            />
          </div>
          <div className="col-span-24">
            <FormSelect<App.Data.CountryData>
              name="country_id"
              label="Land"
              {...form.register('country_id')}
              required
              options={countries}
            />
          </div>
        </FormGroup>
      </Form>
      <DialogFooter>
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form={form.id} type="submit">
            Speichern
          </Button>
        </div>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ContactEditAddress
