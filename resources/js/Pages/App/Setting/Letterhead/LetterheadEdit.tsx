import { router } from '@inertiajs/react'
import Editor from '@monaco-editor/react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { FileTrigger } from '@/Components/twc-ui/file-trigger'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormCheckbox } from '@/Components/twc-ui/form-checkbox'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  letterhead: App.Data.LetterheadData
}

type LetterheadFormData = App.Data.LetterheadData & {
  file: File | null
}

const LetterheadEdit: React.FC<Props> = ({ letterhead }) => {
  const title = letterhead.id ? 'Briefbogen bearbeiten' : 'Briefbogen hinzufügen'
  const [file, setFile] = useState<string | null>(null)

  const form = useForm<LetterheadFormData>(
    'form-letterhead-edit',
    letterhead.id ? 'post' : 'post',
    route(letterhead.id ? 'app.setting.letterhead.update' : 'app.setting.letterhead.store', {
      letterhead: letterhead.id,
      _method: letterhead.id ? 'put' : 'post'
    }),
    {
      ...letterhead,
      file: null
    }
  )

  const breadcrumbs = useMemo(
    () => [
      { title: 'Einstellungen', url: route('app.setting') },
      { title: 'Drucksystem', url: route('app.setting.printing-system') },
      { title: 'Briefbögen', url: route('app.setting.letterhead.index') },
      { title: letterhead.title || 'Neuer Briefbogen' }
    ],
    [letterhead.title]
  )

  const handleClose = () => {
    router.get(route('app.setting.letterhead.index'))
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
              <FormTextField label="Titel" {...form.register('title')} />
            </div>
            <div className="col-span-24">
              <Editor
                height="50vh"
                className="rounded-md border border-border bg-background p-2"
                defaultLanguage="css"
                defaultValue={form.data.css as string}
                onChange={value => form.setData('css', value as string)}
              />
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
                <Button variant="outline">PDF-Dokument hochladen</Button>
              </FileTrigger>
              {file && <p>Ausgewählt: {file}</p>}
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default LetterheadEdit
