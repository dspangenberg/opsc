import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import { toast } from '@/Components/twc-ui/sonner'
import { Switch } from '@/Components/twc-ui/switch'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  settings: App.Data.ZugferdSettingData
  contacts: App.Data.ContactData[]
  is_enabled: boolean
}

const ZugferdSettingEdit: React.FC<Props> = ({ settings, contacts, is_enabled }) => {
  const [isEnabled, setIsEnabled] = useState(is_enabled)
  const [isPendingStatusChange, setPendingStatusChange] = useState(false)

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

  const handleEnabledChange = async (value: boolean) => {
    setPendingStatusChange(true)

    const statusText = value ? 'aktiviert' : 'deaktiviert'
    const routeName = value
      ? 'app.setting.invoice.zugferd.enable'
      : 'app.setting.invoice.zugferd.disable'

    const myPromise = new Promise<{ title: string }>(resolve => {
      setTimeout(() => {
        resolve({ title: 'My toast' })
      }, 3000)
    })

    const toastId = toast({
      isLoading: true,
      type: 'default',
      message: `ZUGFeRD wird ${statusText}.`
    })

    router.put(
      route(routeName),
      {},
      {
        onSuccess: () => {
          toast({
            id: toastId,
            type: 'success',
            message: `ZUGFeRD wurde ${statusText}.`
          })
          setIsEnabled(value)
        },
        onFinish: () => setPendingStatusChange(false)
      }
    )
  }

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
        footerClassName="flex items-center justify-start gap-2"
        footer={
          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="flex flex-1 justify-start">
              <div className="flex-none">
                <Switch
                  id="enabled"
                  isSelected={isEnabled}
                  onChange={handleEnabledChange}
                  isDisabled={
                    isPendingStatusChange ||
                    (!(
                      form.data.seller_contact_id ||
                      form.data.seller_contact_person_id ||
                      form.data.seller_contact_address_id
                    ) as boolean)
                  }
                >
                  ZUGFeRD aktivieren
                </Switch>
              </div>
            </div>
            <div className="flex-none">
              <Button variant="default" form={form.id} type="submit" title="Speichern" />
            </div>
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
          <FormGrid
            title="Identifier scheme code (ICD) gem. ISO/IEC 17 6523"
            description={
              <div>
                Optionale, globale ID zum Beispiel Schema 0060 für Data Universal Numbering System
                (D-U-N-S Number).{' '}
                <a
                  href="https://github.com/horstoeko/zugferd/wiki/Codelists#isoiec-17-6523---identifier-scheme-code-icd"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 hover:underline"
                >
                  Nähere Informationen
                </a>
              </div>
            }
          >
            <div className="col-span-4">
              <FormTextField label="Schema" {...form.register('global_id_type')} />
            </div>
            <div className="col-span-8">
              <FormTextField label="Globale ID" {...form.register('global_id')} />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default ZugferdSettingEdit
