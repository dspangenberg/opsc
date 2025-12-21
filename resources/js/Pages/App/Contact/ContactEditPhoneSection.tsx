import { Plus, Trash2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/Components/twc-ui/button'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/select'
import { FormTextField } from '@/Components/twc-ui/text-field'

interface ContactEditPhonedSectionProps {
  phoneCategories: App.Data.PhoneCategoryData[]
  onAddPhone: () => void
  onRemovePhone: (index: number) => void
}

export const ContactEditPhoneSection: React.FC<ContactEditPhonedSectionProps> = ({
  phoneCategories,
  onAddPhone,
  onRemovePhone
}) => {
  const form = useFormContext()

  if (!form) {
    console.error('ContactEditPhoneSection must be used within a Form component')
    return null
  }

  const phones = (form.data.phones as App.Data.ContactPhoneData[]) || []

  return (
    <FormGrid
      title="Telefon"
      action={
        <Button type="button" variant="outline" size="icon-sm" onClick={onAddPhone} icon={Plus} />
      }
    >
      {phones && phones.length > 0 ? (
        phones.map((phone, index) => (
          <React.Fragment key={phone.id || `new-${index}`}>
            <div className="col-span-8">
              <FormSelect<App.Data.EmailCategoryData>
                {...form.register(`phones[${index}].phone_category_id`)}
                aria-label="Kategorie"
                items={phoneCategories}
              />
            </div>
            <div className="col-span-14">
              <FormTextField
                {...form.register(`phones[${index}].phone`)}
                aria-label="Telefonnummer"
              />
            </div>
            <div className="col-span-2 flex items-center">
              <Button
                type="button"
                variant="ghost-destructive"
                size="icon-sm"
                onClick={() => onRemovePhone(index)}
                icon={Trash2}
                aria-label="E-Mail-Adresse löschen"
              />
            </div>

            {/* Versteckte Felder für Form-Handling */}
            <input type="hidden" {...form.registerEvent(`phones[${index}].id`)} />
            <input type="hidden" {...form.registerEvent(`phones[${index}].contact_id`)} />
            <input type="hidden" {...form.registerEvent(`phones[${index}].pos`)} />
          </React.Fragment>
        ))
      ) : (
        <div />
      )}
    </FormGrid>
  )
}

export default ContactEditPhoneSection
