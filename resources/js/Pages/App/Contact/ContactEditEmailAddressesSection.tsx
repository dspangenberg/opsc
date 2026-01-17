import { Plus, Trash2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/Components/twc-ui/button'
import { useFormContext } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextField } from '@/Components/twc-ui/form-text-field'

interface EmailAddressesSectionProps {
  mailCategories: App.Data.EmailCategoryData[]
  onAddEmail: () => void
  onRemoveEmail: (index: number) => void
}

export const ContactEditEmailAddressesSection: React.FC<EmailAddressesSectionProps> = ({
  mailCategories,
  onAddEmail,
  onRemoveEmail
}) => {
  const form = useFormContext()

  if (!form) {
    console.error('ContactEditEmailAddressesSection must be used within a Form component')
    return null
  }

  const mails = (form.data.mails as App.Data.ContactMailData[]) || []

  return (
    <FormGrid
      title="E-Mail-Adressen"
      action={
        <Button type="button" variant="outline" size="icon-sm" onClick={onAddEmail} icon={Plus} />
      }
    >
      {mails && mails.length > 0 ? (
        mails.map((mail, index) => (
          <React.Fragment key={mail.id || `new-${index}`}>
            <div className="col-span-4">
              <FormSelect<App.Data.EmailCategoryData>
                {...form.register(`mails[${index}].email_category_id`)}
                aria-label="Kategorie"
                items={mailCategories}
              />
            </div>
            <div className="col-span-7">
              <FormTextField
                {...form.register(`mails[${index}].email`)}
                aria-label="E-Mail-Adresse"
                type="email"
              />
            </div>
            <div className="col-span-1 flex items-center">
              <Button
                type="button"
                variant="ghost-destructive"
                size="icon-sm"
                onClick={() => onRemoveEmail(index)}
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

export default ContactEditEmailAddressesSection
