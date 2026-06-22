import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { FileTrigger } from '@/Components/twc-ui/file-trigger'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  template: App.Data.OfficeTemplateData
}

type OfficeTemplateFormData = App.Data.OfficeTemplateData & {
  file: File | null
}

const OfficeTemplateEdit: React.FC<Props> = ({ template }) => {
  const title = template.id ? 'Office-Vorlage bearbeiten' : 'Office-Vorlage hinzufügen'
  const [file, setFile] = useState<string | null>(null)

  const form = useForm<OfficeTemplateFormData>('form-office_template-edit', template.id ? 'post' : 'post', route(
    template.id ? 'app.setting.office-template.update' : 'app.setting.office-template.store',
    {
      template: template.id,
      _method: template.id ? 'put' : 'post'
    }
  ), {
    ...template,
    file: null
  })

  const breadcrumbs = useMemo(
    () => [
      { title: 'Einstellungen', url: route('app.setting') },
      { title: 'Drucksystem', url: route('app.setting.printing-system') },
      { title: 'Office-Vorlagen', url: route('app.setting.office-template.index') },
      { title: template.name || 'Neue Vorlage' }
    ],
    [template.name]
  )

  const handleClose = () => {
    router.get(route('app.setting.office-template.index'))
  }

  return (
    <PageContainer
      title={title}
      width="6xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        footer={
          <div className="flex flex-none items-center justify-end gap-2 px-4 py-2">
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        <Form form={form} onSubmitted={handleClose} className="max-w-4xl">
          <FormGrid>
            <div className="col-span-24">
              <FormTextField label="Bezeichnung" {...form.register('name')} />
            </div>

            <div className="col-span-24">
              <FileTrigger
                onSelect={e => {
                  const files = e ? Array.from(e) : []
                  if (files.length > 0) {
                    const selectedFile = files[0]
                    setFile(selectedFile.name)
                    form.setData('file', selectedFile)
                  } else {
                    setFile(null)
                    form.setData('file', null)
                  }
                }}
              >
                <Button variant="outline">Office-Dokument hochladen</Button>
              </FileTrigger>
              {file && <p>Ausgewählt: {file}</p>}
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default OfficeTemplateEdit
