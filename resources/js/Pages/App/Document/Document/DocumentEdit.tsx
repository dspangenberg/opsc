import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
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
    route('app.documents.documents.update', { document: document.id }),
    document
  )

  const breadcrumbs = useMemo(
    () => [
      { title: 'Dokumente', url: route('app.documents.documents.index') },
      { title: document.filename }
    ],
    [document.filename]
  )

  return (
    <PageContainer
      title="Dokument bearbeiten"
      width="7xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <PdfContainer
        file={route('app.documents.documents.pdf', { document: document.id })}
        filename={document.filename}
      />
      <Form form={form} className="flex-1">
        <FormGrid>
          <div className="col-span-8">
            <FormDatePicker label="Dokumentdatum" {...form.register('issued_on')} autoFocus />
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
          </div>
          <div className="col-span-24">
            <FormComboBox
              {...form.register('contact_id')}
              label="Kontakt"
              itemName="full_name"
              items={contacts}
            />
          </div>
          <div className="col-span-24">
            <FormComboBox {...form.register('project_id')} label="Project" items={projects} />
          </div>
          <div className="col-span-24">
            <Button variant="default" type="submit" title="Speichern" isLoading={form.processing} />
          </div>
        </FormGrid>
      </Form>
    </PageContainer>
  )
}

export default DocumentEdit
