import { usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import type * as React from 'react'
import { useEffect, useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Letter {
  recipient_id: number
  recipient_contact_id?: number
  user_id: number
  signature_left_user_id: number
  signature_right_user_id?: number | null
  salutation: string
  date: string
  subject: string
  shipment: string
  template_id: number
}

interface Props extends PageProps {
  contacts: App.Data.ContactData[]
  templates: App.Data.OfficeTemplateData[]
  users: App.Data.UserData[]
}

type LetterFormData = Partial<Letter>

const DocumentCreateLetter: React.FC<Props> = ({ contacts, templates, users }) => {
  const { auth, csrf_token } = usePage<PageProps>().props

  const form = useForm<LetterFormData>(
    'update-document',
    'post',
    route('app.document.store-letter'),
    {
      recipient_id: 0,
      recipient_contact_id: 0,
      user_id: auth.user.id ?? 0,
      signature_left_user_id: auth.user.id ?? 0,
      signature_right_user_id: null,
      template_id: 0,
      subject: '',
      shipment: '',
      salutation: '',
      date: format(new Date(), 'dd.MM.yyyy')
    }
  )

  const breadcrumbs = useMemo(
    () => [
      { title: 'Dokumente', url: route('app.document.index') },
      { title: 'Schreiben erstellen' }
    ],
    []
  )
  const reciepentsContacts =
    contacts.find(contact => contact.id === form.data.recipient_id)?.contacts ?? []

  useEffect(() => {
    form.setData('recipient_contact_id', 0)
  }, [form.data.recipient_id])

  useEffect(() => {
    if (!form.data.recipient_id && !form.data.recipient_contact_id) return

    if (form.data.recipient_contact_id) {
      const selectedContact = reciepentsContacts.find(
        contact => contact.id === form.data.recipient_contact_id
      )
      form.setData('salutation', `Guten Tag, ${selectedContact?.full_name}`)
    } else {
      form.setData('salutation', 'Guten Tag')
    }
  }, [form.data.recipient_id, form.data.recipient_contact_id, reciepentsContacts])

  const downloadDocument = async () => {
    try {
      const response = await fetch(route('app.document.store-letter'), {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrf_token,
          Accept: 'application/json'
        },
        body: new URLSearchParams(
          Object.entries(form.data).map(([key, value]) => [key, String(value ?? '')])
        )
      })

      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        const data = await response.json()

        if (data.errors) {
          form.setError(data.errors)
        }

        return
      }

      if (!response.ok) {
        form.setError({ subject: ['Das Schreiben konnte nicht erstellt werden.'] })
        return
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')

      anchor.href = url
      anchor.download = 'word.docx'
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed', error)
    }
  }

  return (
    <PageContainer
      title="Schreiben erstellen"
      width="4xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        footerClassName="gap-2 justify-between"
        footer={
          <>
            <div className="flex gap-2" />
            <div className="flex gap-2">
              <Button form={form.id} variant="default" type="submit" title="Schreiben erstellen" />
            </div>
          </>
        }
      >
        <Form
          form={form}
          errorVariant="form"
          className="flex-1"
          onSubmit={async e => {
            e.preventDefault()
            await downloadDocument()
          }}
        >
          <FormGrid>
            <div className="col-span-4">
              <FormDatePicker label="Datum" {...form.register('date')} autoFocus isRequired />
            </div>
            <div className="col-span-8">
              <FormSelect
                {...form.register('user_id')}
                label="Ansprechpartner"
                items={users}
                itemName="reverse_full_name"
              />
            </div>
            <div className="col-span-8">
              <FormSelect {...form.register('template_id')} label="Vorlage" items={templates} />
            </div>
          </FormGrid>
          <FormGrid title="Empfänger">
            <div className="col-span-12">
              <FormComboBox
                {...form.register('recipient_id')}
                label="Empfänger"
                items={contacts}
                itemName="reverse_full_name"
              />
            </div>
            <div className="col-span-12">
              <FormComboBox
                {...form.register('recipient_contact_id')}
                isOptional
                label="Ansprechpartner"
                items={reciepentsContacts}
                itemName="reverse_full_name"
              />
            </div>
            <div className="col-span-24">
              <FormTextField {...form.register('salutation')} label="Briefanrede" isRequired />
            </div>
          </FormGrid>
          <FormGrid title="Anschreiben">
            <div className="col-span-24">
              <FormTextArea {...form.register('subject')} label="Betreff" rows={2} isRequired />
            </div>
          </FormGrid>
          <FormGrid title="Unterschriften">
            <div className="col-span-12">
              <FormSelect
                {...form.register('signature_left_user_id')}
                label="Unterschrift (links)"
                items={users}
                itemName="reverse_full_name"
              />
            </div>
            <div className="col-span-12">
              <FormSelect
                {...form.register('signature_right_user_id')}
                isOptional
                label="Unterschrift (rechts)"
                items={users}
                itemName="reverse_full_name"
              />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default DocumentCreateLetter
