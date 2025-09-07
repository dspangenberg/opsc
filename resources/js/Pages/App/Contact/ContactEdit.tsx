import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/ui/twc-ui/button'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { Tab, TabList, TabPanel, Tabs } from '@/Components/ui/twc-ui/tabs'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import { ContactEditEmailAddressesSection } from '@/Pages/App/Contact/ContactEditEmailAddressesSection'
import { ContactEditPhoneSection } from '@/Pages/App/Contact/ContactEditPhoneSection'

interface Props {
  contact: App.Data.ContactData
  taxes: App.Data.TaxData[]
  payment_deadlines: App.Data.PaymentDeadlineData[]
  salutations: App.Data.SalutationData[]
  titles: App.Data.TitleData[]
  mail_categories: App.Data.EmailCategoryData[]
  phone_categories: App.Data.PhoneCategoryData[]
}

// Typisierung für Formular ohne zirkuläre Referenzen
type FormData = Omit<
  App.Data.ContactData,
  'company' | 'contacts' | 'title' | 'salutation' | 'payment_deadline' | 'sales' | 'addresses'
> & {
  mails: App.Data.ContactMailData[]
  phones: App.Data.ContactPhoneData[]
}

export const ContactEdit: React.FC<Props> = ({
  contact,
  salutations,
  titles,
  mail_categories,
  phone_categories,
  payment_deadlines,
  taxes
}) => {
  // Form-Daten vorbereiten
  const initialData: FormData = {
    id: contact.id,
    name: contact.name,
    first_name: contact.first_name,
    company_name: contact.company_name,
    company_id: contact.company_id,
    full_name: contact.full_name,
    reverse_full_name: contact.reverse_full_name,
    initials: contact.initials,
    title_id: contact.title_id,
    salutation_id: contact.salutation_id,
    creditor_number: contact.creditor_number,
    is_favorite: contact.is_favorite,
    is_org: contact.is_org,
    debtor_number: contact.debtor_number,
    primary_mail: contact.primary_mail,
    vat_id: contact.vat_id,
    short_name: contact.short_name,
    register_court: contact.register_court,
    register_number: contact.register_number,
    department: contact.department,
    position: contact.position,
    tax_number: contact.tax_number,
    formated_debtor_number: contact.formated_debtor_number,
    formated_creditor_number: contact.formated_creditor_number,
    payment_deadline_id: contact.payment_deadline_id,
    tax_id: contact.tax_id,
    mails: contact.mails || [],
    phones: contact.phones || []
  }

  const form = useForm<FormData>(
    'contact-form',
    'put',
    route('app.contact.update', { contact: contact.id }),
    initialData
  )

  const [isOpen, setIsOpen] = useState(true)
  const handleOnClosed = () => {
    setIsOpen(false)
    router.get(route('app.contact.details', { contact: contact.id }))
  }

  const isOrganization = !!form.data.is_org

  // Funktion zum Hinzufügen einer neuen E-Mail-Adresse
  const addEmailAddress = () => {
    const defaultCategoryId = mail_categories[0]?.id || 1
    const newMail: App.Data.ContactMailData = {
      id: null,
      email: '',
      email_category_id: defaultCategoryId,
      contact_id: contact.id as number,
      pos: form.data.mails.length || 0,
      category: mail_categories.find(cat => cat.id === defaultCategoryId) || null
    }

    const updatedMails = [...form.data.mails, newMail]
    form.setData('mails', updatedMails)
  }

  const addPhone = () => {
    const defaultCategoryId = phone_categories[0]?.id || 1
    const newPhone: App.Data.ContactPhoneData = {
      id: null,
      phone: '',
      phone_category_id: defaultCategoryId,
      contact_id: contact.id as number,
      pos: form.data.mails.length || 0,
      category: phone_categories.find(cat => cat.id === defaultCategoryId) || null
    }

    const updatedPhones = [...form.data.phones, newPhone]
    form.setData('phones', updatedPhones)
  }

  // Funktion zum Löschen einer E-Mail-Adresse
  const removeEmailAddress = (index: number) => {
    const updatedMails = form.data.mails.filter((_, i) => i !== index)
    form.setData('mails', updatedMails)
  }

  const removePhone = (index: number) => {
    const updatedPhones = form.data.phones.filter((_, i) => i !== index)
    form.setData('phones', updatedPhones)
  }

  // Funktion zum Aktualisieren einer E-Mail-Adresse
  const updateEmailAddress = (index: number, field: keyof App.Data.ContactMailData, value: any) => {
    const updatedMails = form.data.mails.map((mail, i) => {
      if (i === index) {
        const updatedMail = { ...mail, [field]: value }

        // Wenn die email_category_id geändert wird, auch die category aktualisieren
        if (field === 'email_category_id') {
          updatedMail.category = mail_categories.find(cat => cat.id === value) || null
        }

        return updatedMail
      }
      return mail
    })

    form.setData('mails', updatedMails)
  }

  const updatePhone = (index: number, field: keyof App.Data.ContactPhoneData, value: any) => {
    const updatedPhones = form.data.phones.map((phone, i) => {
      if (i === index) {
        const updatedPhone = { ...phone, [field]: value }

        // Wenn die email_category_id geändert wird, auch die category aktualisieren
        if (field === 'phone_category_id') {
          updatedPhone.category = mail_categories.find(cat => cat.id === value) || null
        }

        return updatedPhone
      }
      return phone
    })

    form.setData('phones', updatedPhones)
  }

  return (
    <Dialog
      isOpen={isOpen}
      confirmClose={form.isDirty}
      title="Kontakt bearbeiten"
      onClosed={handleOnClosed}
      footer={renderProps => (
        <>
          <Button id="dialog-cancel-button" variant="outline" onClick={() => renderProps.close()}>
            {form.isDirty ? 'Abbrechen' : 'Schließen'}
          </Button>
          <Button isLoading={form.processing} form={form.id} type="submit">
            Speichern
          </Button>
        </>
      )}
    >
      <Form form={form} onSubmitted={() => setIsOpen(false)} className="bg-white p-0">
        <Tabs
          variant="classic"
          defaultSelectedKey="base"
          className="bg-accent"
          tabClassName="data-[selected]:bg-white"
          panelClassName="bg-white p-0"
        >
          <TabList aria-label="Ansicht" className="px-4">
            <Tab id="base">Stammdaten</Tab>
            <Tab key="addresses" isDisabled={!isOrganization}>
              Anschriften
            </Tab>
            <Tab isDisabled={!isOrganization} key="fiance">
              Finanz- und Firmendaten
            </Tab>
          </TabList>
          <TabPanel id="base" className="my-0 border border-transparent py-0">
            <FormGroup>
              {isOrganization ? (
                <div className="col-span-24">
                  <TextField autoFocus label="Organisation" {...form.register('name')} />
                </div>
              ) : (
                <>
                  <div className="col-span-3">
                    <Select<App.Data.SalutationData>
                      {...form.register('salutation_id')}
                      label="Anrede"
                      autoFocus
                      items={salutations}
                      itemName="gender"
                    />
                  </div>
                  <div className="col-span-5">
                    <Select<App.Data.TitleData>
                      label="Titel"
                      isOptional
                      {...form.register('title_id')}
                      items={titles}
                    />
                  </div>
                  <div className="col-span-8">
                    <TextField label="Vorname" {...form.register('first_name')} />
                  </div>
                  <div className="col-span-8">
                    <TextField label="Nachname" {...form.register('name')} />
                  </div>
                  <div className="col-span-12">
                    <TextField label="Abteilung" {...form.register('department')} />
                  </div>
                  <div className="col-span-12">
                    <TextField label="Position" {...form.register('position')} />
                  </div>
                </>
              )}
            </FormGroup>

            <ContactEditEmailAddressesSection
              mails={form.data.mails}
              mailCategories={mail_categories}
              contactId={contact.id as number}
              onAddEmail={addEmailAddress}
              onRemoveEmail={removeEmailAddress}
              onUpdateEmail={updateEmailAddress}
            />

            <ContactEditPhoneSection
              phones={form.data.phones}
              phoneCategories={phone_categories}
              contactId={contact.id as number}
              onAddPhone={addPhone}
              onRemovePhone={removePhone}
              onUpdatePhone={updatePhone}
            />
          </TabPanel>
        </Tabs>
      </Form>
    </Dialog>
  )
}

export default ContactEdit
