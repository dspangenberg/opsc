import { Plus, Trash2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/Components/ui/twc-ui/button'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'

interface ContactEditPhonedSectionProps {
  phones: App.Data.ContactPhoneData[]
  phoneCategories: App.Data.PhoneCategoryData[]
  contactId: number
  onAddPhone: () => void
  onRemovePhone: (index: number) => void
  onUpdatePhone: (index: number, field: keyof App.Data.ContactPhoneData, value: any) => void
}

export const ContactEditPhoneSection: React.FC<ContactEditPhonedSectionProps> = ({
  phones,
  phoneCategories,
  contactId,
  onAddPhone,
  onRemovePhone,
  onUpdatePhone
}) => {
  return (
    <FormGroup
      title="Telefon"
      action={
        <Button type="button" variant="outline" size="icon-sm" onClick={onAddPhone} icon={Plus} />
      }
    >
      {phones && phones.length > 0 ? (
        phones.map((phone, index) => (
          <React.Fragment key={phone.id || `new-${index}`}>
            <div className="col-span-8">
              <Select<App.Data.EmailCategoryData>
                aria-label="Kategorie"
                name={`phones.${index}.phone_category_id`}
                items={phoneCategories}
                value={phone.phone_category_id}
                onChange={(value: number) => onUpdatePhone(index, 'phone_category_id', value)}
              />
            </div>
            <div className="col-span-14">
              <TextField
                aria-label="Telefonnummer"
                name={`phones.${index}.email`}
                value={phone.phone}
                onChange={(value: string) => onUpdatePhone(index, 'phone', value)}
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemovePhone(index)}
                className="flex h-9 w-full items-center justify-center text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="E-Mail-Adresse löschen"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Versteckte Felder für Form-Handling */}
            <input type="hidden" name={`phones.${index}.id`} value={phone.id || ''} />
            <input type="hidden" name={`phones.${index}.contact_id`} value={phone.contact_id} />
            <input type="hidden" name={`phones.${index}.pos`} value={phone.pos} />
          </React.Fragment>
        ))
      ) : (
        <div />
      )}
    </FormGroup>
  )
}

export default ContactEditPhoneSection
