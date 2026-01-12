import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Alert } from '@/Components/twc-ui/alert'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import { Tab, TabList, TabPanel, Tabs } from '@/Components/twc-ui/tabs'
import { ContactEditAddressesSection } from '@/Pages/App/Contact/ContactEditAddressesSection'
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
  address_categories: App.Data.AddressCategoryData[]
  bookkeeping_accounts: App.Data.BookkeepingAccountData[]
  cost_centers: App.Data.CostCenterData[]
  countries: App.Data.CountryData[]
}

// Typisierung für Formular ohne zirkuläre Referenzen
type FormData = Omit<
  App.Data.ContactData,
  | 'company'
  | 'contacts'
  | 'title'
  | 'salutation'
  | 'payment_deadline'
  | 'sales'
  | 'tax'
  | 'notables'
  | 'bookkeeping_account'
  | 'outturn_account'
  | 'cost_center'
  | 'primary_phone'
  | 'primary_mail'
  | 'is_archived'
> & {
  mails: App.Data.ContactMailData[]
  phones: App.Data.ContactPhoneData[]
  addresses: App.Data.ContactAddressData[]
}

export const ContactEdit: React.FC<Props> = ({
  contact,
  salutations,
  titles,
  mail_categories,
  phone_categories,
  payment_deadlines,
  cost_centers,
  countries,
  bookkeeping_accounts,
  address_categories,
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
    cc_name: contact.cc_name,
    paypal_email: contact.paypal_email,
    cost_center_id: contact.cost_center_id,
    tax_id: contact.tax_id,
    mails: contact.mails || [],
    phones: contact.phones || [],
    addresses: contact.addresses || [],
    iban: contact.iban,
    outturn_account_id: contact.outturn_account_id,
    website: contact.website,
    is_primary: contact.is_primary,
    is_creditor: contact.is_creditor,
    is_debtor: contact.is_debtor
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

  const addAddress = () => {
    const defaultCategoryId = address_categories[0]?.id || 1
    const defaultCountry = countries[0]?.id || 1
    const newAddress: App.Data.ContactAddressData = {
      id: null,
      address: '',
      zip: '',
      city: '',
      country_id: 1,
      address_category_id: defaultCategoryId,
      contact_id: contact.id as number,
      full_address: '',
      category: address_categories.find(cat => cat.id === defaultCategoryId) || null,
      country: countries.find(country => country.id === defaultCountry) || null
    }

    const updatedAddresses = [...form.data.addresses, newAddress]
    form.setData('addresses', updatedAddresses)
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

  const removeAddress = (index: number) => {
    const updatedAddresses = form.data.addresses.filter((_, i) => i !== index)
    form.setData('addresses', updatedAddresses)
  }

  const removePhone = (index: number) => {
    const updatedPhones = form.data.phones.filter((_, i) => i !== index)
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
          tabClassName="data-[selected]:bg-background data-[selected]:border-b-transparent"
          panelClassName="my-0 border border-transparent py-0 bg-background"
        >
          <TabList aria-label="Ansicht" className="px-4">
            <Tab id="base">Stammdaten</Tab>
            <Tab id="addresses" isDisabled={!isOrganization && form.data.company_id !== 0}>
              Anschriften
            </Tab>
            <Tab isDisabled={!form.data.is_creditor && !form.data.is_debtor} id="finances">
              Account
            </Tab>
            <Tab isDisabled={!isOrganization && form.data.company_id !== 0} id="payments">
              Register-/Steuerdaten
            </Tab>
          </TabList>
          <TabPanel id="base">
            <FormGrid>
              {isOrganization ? (
                <div className="col-span-24">
                  <FormTextArea
                    autoFocus
                    label="Organisation"
                    rows={2}
                    {...form.register('name')}
                  />
                </div>
              ) : (
                <>
                  <div className="col-span-4">
                    <FormSelect<App.Data.SalutationData>
                      {...form.register('salutation_id')}
                      label="Anrede"
                      autoFocus
                      items={salutations}
                      itemName="gender"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormSelect<App.Data.TitleData>
                      label="Titel"
                      isOptional
                      {...form.register('title_id')}
                      items={titles}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormTextField label="Vorname" {...form.register('first_name')} />
                  </div>
                  <div className="col-span-10">
                    <FormTextField label="Nachname" {...form.register('name')} />
                  </div>
                  <div className="col-span-12">
                    <FormTextField label="Abteilung" {...form.register('department')} />
                  </div>
                  <div className="col-span-12">
                    <FormTextField label="Position" {...form.register('position')} />
                  </div>
                </>
              )}
              {(isOrganization || !form.data.company_id) && (
                <div className="col-span-24 flex gap-4">
                  <Checkbox {...form.registerCheckbox('is_debtor')}>Debitor</Checkbox>
                  <Checkbox {...form.registerCheckbox('is_creditor')}>Kreditor</Checkbox>
                </div>
              )}
            </FormGrid>

            <ContactEditEmailAddressesSection
              mailCategories={mail_categories}
              onAddEmail={addEmailAddress}
              onRemoveEmail={removeEmailAddress}
            />

            <ContactEditPhoneSection
              phoneCategories={phone_categories}
              onAddPhone={addPhone}
              onRemovePhone={removePhone}
            />
          </TabPanel>
          <TabPanel id="addresses">
            <ContactEditAddressesSection
              addressCategories={address_categories}
              countries={countries}
              onAddAddress={addAddress}
              onRemoveAddress={removeAddress}
            />
          </TabPanel>
          <TabPanel id="finances">
            {form.data.is_debtor && (
              <FormGrid title="Debitordaten">
                {!form.data.debtor_number && (
                  <div className="col-span-24">
                    <Alert>
                      Die Debitorennummer wird nach dem Speichern automatisch generiert.
                    </Alert>
                  </div>
                )}
                <div className="col-span-6">
                  <FormTextField
                    label="Debitor-Nr."
                    isReadOnly
                    {...form.register('formated_debtor_number')}
                  />
                </div>
                <div className="col-span-9">
                  <FormSelect<App.Data.TaxData>
                    {...form.register('tax_id')}
                    label="Umsatzsteuer"
                    items={taxes}
                  />
                </div>
                <div className="col-span-9">
                  <FormSelect<App.Data.PaymentDeadlineData>
                    {...form.register('payment_deadline_id')}
                    label="Zahlungsziel"
                    items={payment_deadlines}
                  />
                  <Checkbox {...form.registerCheckbox('has_dunning_block')} className="pt-1.5">
                    Mahnsperre
                  </Checkbox>
                </div>
              </FormGrid>
            )}
            {form.data.is_creditor && (
              <FormGrid title="Kreditordaten">
                {!form.data.creditor_number && (
                  <div className="col-span-24">
                    <Alert>
                      Die Kreditorennummer wird nach dem Speichern automatisch generiert.
                    </Alert>
                  </div>
                )}
                <div className="col-span-6">
                  <FormTextField
                    label="Kreditor-Nr."
                    isReadOnly
                    {...form.register('formated_creditor_number')}
                  />
                </div>
                <div className="col-span-18">
                  <FormComboBox<App.Data.CostCenterData>
                    label="Kostenstelle"
                    items={cost_centers}
                    {...form.register('cost_center_id')}
                  />
                </div>
              </FormGrid>
            )}
            {(form.data.is_creditor || form.data.is_debtor) && (
              <FormGrid title="Buchhaltung">
                <div className="col-span-12">
                  <FormComboBox<App.Data.BookkeepingAccountData>
                    label="Erfolgskonto"
                    items={bookkeeping_accounts}
                    isOptional
                    itemName="label"
                    itemValue="account_number"
                    {...form.register('outturn_account_id')}
                  />
                  <Checkbox {...form.registerCheckbox('is_primary')} className="pt-1.5">
                    Bei Buchung primär verwenden
                  </Checkbox>
                </div>
              </FormGrid>
            )}
          </TabPanel>
          <TabPanel id="payments">
            <FormGrid title="Steuerdaten">
              <div className="col-span-12">
                <FormTextField label="Umsatzsteuer-ID" {...form.register('vat_id')} />
              </div>
              <div className="col-span-12">
                <FormTextField label="Steuernummer" {...form.register('tax_number')} />
              </div>
            </FormGrid>
            <FormGrid title="Registerdaten">
              <div className="col-span-12">
                <FormTextField label="Registergericht" {...form.register('register_court')} />
              </div>
              <div className="col-span-12">
                <FormTextField label="Registernummer" {...form.register('register_number')} />
              </div>
            </FormGrid>
            <FormGrid title="Zahlungsverkehr">
              <div className="col-span-12">
                <FormTextField label="IBAN" {...form.register('iban')} />
              </div>
              <div className="col-span-12">
                <FormTextField label="Paypal" {...form.register('paypal_email')} />
              </div>
              <div className="col-span-12">
                <FormTextField
                  label="Name auf Kreditkartenabrechnung"
                  {...form.register('cc_name')}
                />
              </div>
            </FormGrid>
          </TabPanel>
        </Tabs>
      </Form>
    </Dialog>
  )
}

export default ContactEdit
