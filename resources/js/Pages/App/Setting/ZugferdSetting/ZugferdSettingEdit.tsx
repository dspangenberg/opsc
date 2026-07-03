import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { FieldDescription } from '@/Components/twc-ui/field'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  settings: App.Data.ZugferdSettingData
  contacts: App.Data.ContactData[]
}

const ZugferdSettingEdit: React.FC<Props> = ({ settings, contacts }) => {
  const form = useForm<App.Data.ZugferdSettingData>(
    'form-zugferd-settings-edit',
    'put',
    route('app.setting.invoice.zugferd.update'),
    settings
  )

  const contactPersons = useMemo(() => {
    const contact = contacts.find(item => item.id === form.data.seller_contact_id)
    if (!contact) return []
    return contact?.contacts
  }, [contacts, form.data.seller_contact_id])

  const addresses = useMemo(() => {
    const contact = contacts.find(item => item.id === form.data.seller_contact_id)
    if (!contact) return []
    return contact?.addresses
  }, [form.data.seller_contact_id, contacts])

  const breadcrumbs = useMemo(
    () => [
      { title: 'Einstellungen', url: route('app.setting') },
      { title: 'Rechnungen', url: route('app.setting.invoice') },
      { title: 'ZUGFeRD' }
    ],
    []
  )

  return (
    <PageContainer
      title="ZUGFeRD-Einstellungen"
      width="4xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        className="flex flex-1 overflow-y-hidden"
        innerClassName="bg-background"
        footer={
          <div className="flex flex-none items-center justify-end gap-2">
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        <Form form={form}>
          <FormGrid title="Verkäuferdaten">
            <div className="col-span-8">
              <FormComboBox
                autoFocus
                label="Eigene Organisation"
                items={contacts}
                {...form.register('seller_contact_id')}
              />
            </div>
            <div className="col-span-8">
              <FormComboBox
                label="Ansprechperson"
                items={contactPersons as App.Data.ContactData[]}
                {...form.register('seller_contact_person_id')}
                itemName="reverse_full_name"
              />
            </div>
            <div className="col-span-8">
              <FormComboBox
                label="Anschrift"
                items={addresses as App.Data.ContactAddressData[]}
                {...form.register('seller_contact_address_id')}
                itemName="full_address"
              />
            </div>
            <div className="col-span-24">
              <FormTextArea
                label="Regulatorische Zusatzinformationen"
                description="Zum Beispiel Registergericht, Handelsregisternummer etc."
                {...form.register('document_note')}
              />
            </div>
          </FormGrid>
          <FormGrid title="Identifier scheme code (ICD) gem. ISO/IEC 17 6523">
            <div className="col-span-4">
              <FormTextField label="Schema ID" {...form.register('global_id_type')} />
            </div>
            <div className="col-span-8">
              <FormTextField label="Globale ID" {...form.register('global_id')} />
            </div>
            <div className="col-span-12" />
            <div className="col-span-12 -mt-6">
              <FieldDescription>
                Zum Beispiel Schema ID 0060 für Data Universal Numbering System (D-U-N-S Number).
                <a
                  href="https://github.com/horstoeko/zugferd/wiki/Codelists#isoiec-17-6523---identifier-scheme-code-icd"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 text-primary hover:underline"
                >
                  Nähere Informationen
                </a>
              </FieldDescription>
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default ZugferdSettingEdit
