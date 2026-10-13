import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormColorPicker } from '@/Components/twc-ui/form-color-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

export const TAG_PALETTE_COLORS = [
  '#c42d78',
  '#e23d3d',
  '#ff8a2a',
  '#f9B33c',
  '#f5c400',
  '#9cab3a',
  '#70c741',
  '#27983a',
  '#55cbb0',
  '#1492b2',
  '#139ef7',
  '#7fb9e8',
  '#3c6dff',
  '#7b44e6',
  '#a02adb',
  '#d89ae8',
  '#d6458d',
  '#f77c70',
  '#a0a0a0',
  '#b99780'
] as const
interface Props extends PageProps {
  documentTag: App.Data.DocumentTagData
}

const DocumentTagEdit: React.FC<Props> = ({ documentTag }) => {
  const title = documentTag.id ? 'Dokument-Tag bearbeiten' : 'Neues Dokument-Tag hinzufügen'

  const form = useForm<App.Data.DocumentTagData>(
    'form-bank-account.-edit',
    documentTag.id ? 'put' : 'post',
    route(documentTag.id ? 'app.setting.document_tag.update' : 'app.setting.document_tag.store', {
      documentTag: documentTag.id
    }),
    documentTag
  )

  const handleCancel = () => {
    router.visit(route('app.setting.document_tag.index'))
  }

  const cancelButtonTitle = form.isDirty ? 'Abbrechen' : 'Zurück'
  const breadcrumbs = useMemo(
    () => [{ title: 'Einstellungen' }, { title: 'Dokumente' }, { title: 'Dokument-Tags' }],
    []
  )

  return (
    <PageContainer
      title={title}
      width="4xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        className="flex flex-1 overflow-y-hidden"
        innerClassName="bg-background"
        footer={
          <div className="flex flex-none items-center justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} title={cancelButtonTitle} />
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        <Form form={form}>
          <FormGrid>
            <div className="col-span-12">
              <FormTextField label="Bezeichnung" autoFocus {...form.register('name')} />
            </div>

            <div className="col-span-24">
              <FormColorPicker
                label="Farbe"
                colors={TAG_PALETTE_COLORS}
                {...form.register('color')}
              />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default DocumentTagEdit
