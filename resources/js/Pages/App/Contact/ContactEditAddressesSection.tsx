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
            <div className="col-span-4">
              <FormSelect<App.Data.AddressCategoryData>
                {...form.register(`addresses[${index}].address_category_id`)}
                aria-label="Kategorie"
                items={addressCategories}
              />
            </div>
            <div className="col-span-7">
              <FormTextArea
                {...form.register(`addresses[${index}].address`)}
                aria-label="Anschrift"
                rows={2}
              />
            </div>
            <div className="col-span-3">
              <FormComboBox<App.Data.CountryData>
                {...form.register(`addresses[${index}].country_id`)}
                aria-label="Land"
                itemName="iso_code"
                items={countries}
              />
            </div>
            <div className="col-span-3">
              <FormTextField {...form.register(`addresses[${index}].zip`)} aria-label="PLZ" />
            </div>
            <div className="col-span-6">
              <FormTextField {...form.register(`addresses[${index}].city`)} aria-label="Ort" />
            </div>
            <div className="col-span-1 flex pt-1">
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
