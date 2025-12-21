import { Plus, Trash2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/Components/twc-ui/button'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'

interface AddressesSectionProps {
  addressCategories: App.Data.AddressCategoryData[]
  countries: App.Data.CountryData[]
  onAddAddress: () => void
  onRemoveAddress: (index: number) => void
}

export const ContactEditAddressesSection: React.FC<AddressesSectionProps> = ({
  addressCategories,
  countries,
  onAddAddress,
  onRemoveAddress
}) => {
  const form = useFormContext()

  if (!form) {
    console.error('ContactEditEmailAddressesSection must be used within a Form component')
    return null
  }

  const addresses = (form.data.addresses as App.Data.ContactAddressData[]) || []

  return (
    <FormGrid
      title="Anschriften"
      className="gap-y-3"
      action={
        <Button type="button" variant="outline" size="icon-sm" onClick={onAddAddress} icon={Plus} />
      }
    >
      {addresses && addresses.length > 0 ? (
        addresses.map((address, index) => (
          <React.Fragment key={address.id || `new-${index}`}>
            <div className="col-span-8">
              <FormSelect<App.Data.AddressCategoryData>
                {...form.register(`addresses[${index}].address_category_id`)}
                aria-label="Kategorie"
                items={addressCategories}
              />
            </div>
            <div className="col-span-14">
              <FormTextArea
                {...form.register(`addresses[${index}].address`)}
                aria-label="Anschrift"
              />
            </div>
            <div className="col-span-8" />
            <div className="col-span-5">
              <FormTextField {...form.register(`addresses[${index}].zip`)} aria-label="PLZ" />
            </div>
            <div className="col-span-9">
              <FormTextField {...form.register(`addresses[${index}].city`)} aria-label="Ort" />
            </div>
            <div className="col-span-8" />
            <div className="col-span-14">
              <FormComboBox<App.Data.CountryData>
                {...form.register(`addresses[${index}].country_id`)}
                aria-label="Land"
                items={countries}
              />
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <Button
                type="button"
                variant="ghost-destructive"
                size="icon-sm"
                onClick={() => onRemoveAddress(index)}
                icon={Trash2}
                aria-label="E-Mail-Adresse löschen"
              />
            </div>

            {/* Versteckte Felder für Form-Handling */}
            <input type="hidden" {...form.registerEvent(`mails[${index}].id`)} />
            <input type="hidden" {...form.registerEvent(`mails[${index}].contact_id`)} />
            <input type="hidden" {...form.registerEvent(`mails[${index}].pos`)} />
          </React.Fragment>
        ))
      ) : (
        <div />
      )}
    </FormGrid>
  )
}

export default ContactEditAddressesSection
