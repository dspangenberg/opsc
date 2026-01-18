import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'
import '@mdxeditor/editor/style.css'
import { Pressable } from 'react-aria-components'
import { Alert } from '@/Components/twc-ui/alert'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Avatar } from '@/Components/twc-ui/avatar'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { FileTrigger } from '@/Components/twc-ui/FileTrigger'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { Tab, TabList, TabPanel, Tabs } from '@/Components/twc-ui/tabs'
import ContactEditAddressesSection from './ContactEditAddressesSection'
import ContactEditEmailAddressesSection from './ContactEditEmailAddressesSection'
import ContactEditPhoneSection from './ContactEditPhoneSection'

interface Props extends PageProps {
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
  | 'avatar_url'
> & {
  mails: App.Data.ContactMailData[]
  phones: App.Data.ContactPhoneData[]
  addresses: App.Data.ContactAddressData[]
  avatar: File | null
}

const ContactEdit: React.FC<Props> = ({
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
    is_debtor: contact.is_debtor,
    avatar: null,
    dob: contact.dob,
    note: contact.note,
    has_dunning_block: contact.has_dunning_block
  }

  const [droppedImage, setDroppedImage] = useState<string | undefined>(
    contact.avatar_url as string | undefined
  )

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
      country_id: defaultCountry,
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
      pos: form.data.phones.length || 0,
      category: phone_categories.find(cat => cat.id === defaultCategoryId) || null
    }

    const updatedPhones = [...form.data.phones, newPhone]
    form.setData('phones', updatedPhones)
  }

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

  const form = useForm<FormData>(
    'contact-form',
    'put',
    route('app.contact.update', {
      contact: contact.id
    }),
    initialData
  )

  // Transform empty strings to null for optional ID fields before submit
  form.transform(data => ({
    ...data,
    outturn_account_id: !data.outturn_account_id ? null : data.outturn_account_id,
    cost_center_id: !data.cost_center_id ? null : data.cost_center_id
  }))

  const cancelButtonTitle = form.isDirty ? 'Abbrechen' : 'Zurück'

  useEffect(() => {
    return () => {
      if (droppedImage) {
        URL.revokeObjectURL(droppedImage)
      }
    }
  }, [droppedImage])

  const isOrganization = !!form.data.is_org

  const breadcrumbs = useMemo(() => {
    return [
      { title: 'Kontakte', url: route('app.contact.index') },
      { title: contact.full_name, url: route('app.contact.details', { contact: contact.id }) },
      { title: 'Bearbeiten' }
    ]
  }, [contact.full_name, contact.id])

  async function onSelectHandler(e: FileList | null) {
    if (!e || e.length === 0) return

    try {
      const item = e[0]

      if (item) {
        if (droppedImage?.startsWith('blob:')) {
          URL.revokeObjectURL(droppedImage)
        }

        setDroppedImage(URL.createObjectURL(item))
        form.setData('avatar', item)
      }
    } catch (error) {
      console.error('Fehler beim Verarbeiten des Bildes:', error)
      // Optional: Benutzer-Feedback anzeigen
    }
  }

  const handleCancel = async () => {
    if (form.isDirty) {
      const promise = await AlertDialog.call({
        title: 'Änderungen verwerfen',
        message: `Möchtest Du die Änderungen verwerfen?`,
        buttonTitle: 'Verwerfen'
      })
      if (promise) {
        router.visit(
          route('app.contact.details', {
            contact: contact.id
          })
        )
      }
    } else {
      router.visit(
        route('app.contact.details', {
          contact: contact.id
        })
      )
    }
  }

  return (
    <PageContainer
      title="Kontakt bearbeiten"
      width="6xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        className="max-w-4xl"
        innerClassName="bg-background"
        footer={
          <div className="flex flex-none items-center justify-end gap-2 px-4 py-2">
            <Button variant="outline" onClick={handleCancel} title={cancelButtonTitle} />
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        <Form form={form} className="max-w-4xl" errorClassName="w-auto m-3">
          <FormGrid>
            <div className="col-span-2 inline-flex items-center justify-center">
              <div>
                <FileTrigger
                  acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
                  onSelect={onSelectHandler}
                >
                  <Pressable>
                    <Avatar
                      role="button"
                      aria-label="Avatar ändern"
                      fullname={contact.full_name}
                      src={droppedImage}
                      size="lg"
                      className="cursor-pointer"
                    />
                  </Pressable>
                </FileTrigger>
              </div>
            </div>
            {!contact.is_org ? (
              <>
                <div className="col-span-2">
                  <FormSelect
                    label="Anrede"
                    items={salutations}
                    itemName="gender"
                    autoFocus
                    {...form.register('salutation_id')}
                  />
                </div>
                <div className="col-span-4">
                  <FormSelect
                    label="Titel"
                    isOptional
                    items={titles}
                    {...form.register('title_id')}
                  />
                </div>
                <div className="col-span-8">
                  <FormTextField label="Vorname" {...form.register('first_name')} />
                </div>
                <div className="col-span-8">
                  <FormTextField label="Nachname" {...form.register('name')} />
                </div>
              </>
            ) : (
              <div className="col-span-22">
                <FormTextArea label="Organisation" autoFocus {...form.register('name')} />
              </div>
            )}
            {(isOrganization || !form.data.company_id) && (
              <>
                <div className="col-span-2" />
                <div className="col-span-22 -mt-3 flex gap-4">
                  <Checkbox {...form.registerCheckbox('is_debtor')}>Debitor</Checkbox>
                  <Checkbox {...form.registerCheckbox('is_creditor')}>Kreditor</Checkbox>
                </div>
              </>
            )}
          </FormGrid>
          {contact.is_org === false && (
            <FormGrid>
              <div className="col-span-2" />
              <div className="col-span-9">
                <FormTextField label="Position" {...form.register('position')} />
              </div>
              <div className="col-span-9">
                <FormTextField label="Abteilung" {...form.register('department')} />
              </div>
              <div className="col-span-4">
                <FormDatePicker label="Geburtsdatum" {...form.register('dob')} />
              </div>
            </FormGrid>
          )}
          <Tabs
            variant="classic"
            defaultSelectedKey="base"
            className="bg-accent"
            tabClassName="data-[selected]:bg-background data-[selected]:border-b-transparent"
            panelClassName="my-0 border border-transparent py-0 bg-background"
          >
            <TabList aria-label="Ansicht" className="w-full bg-background px-4">
              <Tab id="base">E-Mail + Telefon</Tab>
              <Tab id="addresses" isDisabled={!isOrganization && form.data.company_id !== 0}>
                Postanschriften
              </Tab>
              <Tab isDisabled={!form.data.is_creditor && !form.data.is_debtor} id="finances">
                Account
              </Tab>
              <Tab isDisabled={!isOrganization && form.data.company_id !== 0} id="payments">
                Register-/Steuerdaten
              </Tab>
            </TabList>
            <TabPanel id="base">
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
              <FormGrid>
                <div className="col-span-24">
                  <FormTextArea label="Notizen" {...form.register('note')} />
                </div>
              </FormGrid>
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
      </FormCard>
    </PageContainer>
  )
}

export default ContactEdit
