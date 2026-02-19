import { AiContentGenerator01Icon, ArrowDataTransferVerticalIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormCheckbox } from '@/Components/twc-ui/form-checkbox'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import { PdfContainer } from '@/Components/twc-ui/pdf-container'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  document: App.Data.DocumentData
  contacts: App.Data.ContactData[]
  documentTypes: App.Data.DocumentTypeData[]
  projects: App.Data.ProjectData[]
}
const DocumentEdit: React.FC<Props> = ({ document, contacts, documentTypes, projects }) => {
  const form = useForm<App.Data.DocumentData>(
    'update-document',
    'put',
    route('app.document.update', { document: document.id }),
    document
  )

  const [isEditMode, setIsEditMode] = useState(!document.is_confirmed)

  const breadcrumbs = useMemo(
    () => [{ title: 'Dokumente', url: route('app.document.index') }, { title: document.filename }],
    [document.filename]
  )

  const handleContanctSwap = () => {
    const reminderContact = form.data.sender_contact_id
    form.setData('sender_contact_id', form.data.receiver_contact_id)
    form.setData('receiver_contact_id', reminderContact)
    form.setData('is_inbound', !form.data.is_inbound)
  }

  const handleGetAiContent = () => {
    router.put(route('app.document.extract', { document: document.id }), {}, { replace: false })
  }

  return (
    <PageContainer
      title="Dokument bearbeiten"
      width="7xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <PdfContainer
        file={route('app.document.pdf', { document: document.id })}
        filename={document.filename}
      />
      <FormCard
        footerClassName="gap-2"
        footer={
          <>
            <Button
              variant="ghost"
              icon={AiContentGenerator01Icon}
              size="icon"
              title="AI-Analyse"
              onClick={() => handleGetAiContent()}
            />
            <Button
              variant="default"
              form={form.id}
              type="submit"
              title="Speichern"
              isLoading={form.processing}
            />
          </>
        }
      >
        <Form form={form} className="flex-1">
          <FormGrid>
            <div className="col-span-8">
              <FormDatePicker label="Dokumentdatum" {...form.register('issued_on')} autoFocus />
            </div>
            <div className="col-span-8">
              {form.data.is_inbound ? (
                <FormDatePicker label="Eingangsdatum" {...form.register('received_on')} />
              ) : (
                <FormDatePicker label="Sendedatum" {...form.register('sent_on')} />
              )}
            </div>

            <div className="col-span-24">
              <FormTextField label="Titel" {...form.register('title')} />
            </div>
            <div className="col-span-24">
              <FormSelect
                {...form.register('document_type_id')}
                label="Dokumenttyp"
                items={documentTypes}
              />
              <div className="space-y-1 pt-1">
                <FormCheckbox
                  {...form.registerCheckbox('is_inbound')}
                  label="Eingegangenes Dokument"
                />
                <FormCheckbox {...form.registerCheckbox('is_hidden')} label="Dokument ausblenden" />
              </div>
            </div>
            <div className="col-span-24">
              <FormComboBox
                {...form.register('sender_contact_id')}
                label="Absender"
                itemName="full_name"
                items={contacts}
              />
            </div>
            <div className="col-span-24 flex justify-center">
              <Button
                icon={ArrowDataTransferVerticalIcon}
                variant="outline"
                size="icon"
                onClick={() => handleContanctSwap()}
              />
            </div>
            <div className="col-span-24">
              <FormComboBox
                {...form.register('receiver_contact_id')}
                label="Empfänger"
                itemName="full_name"
                items={contacts}
              />
            </div>
            <div className="col-span-24">
              <FormComboBox {...form.register('project_id')} label="Project" items={projects} />
            </div>
            <div className="col-span-24">
              <FormTextArea label="Zusammenfassung" {...form.register('summary')} />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default DocumentEdit
