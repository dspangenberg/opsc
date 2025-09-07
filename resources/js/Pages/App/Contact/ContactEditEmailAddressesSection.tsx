import { Plus, Trash2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/Components/ui/twc-ui/button'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'

interface EmailAddressesSectionProps {
  mails: App.Data.ContactMailData[]
  mailCategories: App.Data.EmailCategoryData[]
  contactId: number
  onAddEmail: () => void
  onRemoveEmail: (index: number) => void
  onUpdateEmail: (index: number, field: keyof App.Data.ContactMailData, value: any) => void
}

export const ContactEditEmailAddressesSection: React.FC<EmailAddressesSectionProps> = ({
  mails,
  mailCategories,
  contactId,
  onAddEmail,
  onRemoveEmail,
  onUpdateEmail
}) => {
  return (
    <FormGroup
      title="E-Mail-Adressen"
      action={
        <Button type="button" variant="outline" size="icon-sm" onClick={onAddEmail} icon={Plus} />
      }
    >
      {mails && mails.length > 0 ? (
        mails.map((mail, index) => (
          <React.Fragment key={mail.id || `new-${index}`}>
            <div className="col-span-8">
              <Select<App.Data.EmailCategoryData>
                aria-label="Kategorie"
                name={`mails.${index}.email_category_id`}
                items={mailCategories}
                value={mail.email_category_id}
                onChange={(value: number) => onUpdateEmail(index, 'email_category_id', value)}
              />
            </div>
            <div className="col-span-14">
              <TextField
                aria-label="E-Mail-Adresse"
                name={`mails.${index}.email`}
                value={mail.email}
                onChange={(value: string) => onUpdateEmail(index, 'email', value)}
                type="email"
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveEmail(index)}
                className="flex h-9 w-full items-center justify-center text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="E-Mail-Adresse löschen"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Versteckte Felder für Form-Handling */}
            <input type="hidden" name={`mails.${index}.id`} value={mail.id || ''} />
            <input type="hidden" name={`mails.${index}.contact_id`} value={mail.contact_id} />
            <input type="hidden" name={`mails.${index}.pos`} value={mail.pos} />
          </React.Fragment>
        ))
      ) : (
        <div />
      )}
    </FormGroup>
  )
}

export default ContactEditEmailAddressesSection
