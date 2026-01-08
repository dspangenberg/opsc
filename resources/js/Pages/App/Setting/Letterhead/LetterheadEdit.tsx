import { router } from '@inertiajs/react'
import Editor from '@monaco-editor/react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { FileTrigger } from '@/Components/twc-ui/FileTrigger'
import { Form, useForm } from '@/Components/twc-ui/form'
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
      { title: 'Einstellungen', url: route('app.setting.text-module.index') },
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
      <Form form={form} onSubmitted={handleClose} className="max-w-4xl">
        <FormGrid>
          <div className="col-span-24">
            <FormTextField label="Titel" {...form.register('title')} />
            <div className="pt-0.5">
              <FormCheckbox label="Multipage" {...form.registerCheckbox('is_multi')} />
            </div>
          </div>
          <div className="col-span-24">
            <Editor
              height="50vh"
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
              <Button variant="outline">Datei auswählen</Button>
            </FileTrigger>
            {file && <p>Ausgewählt: {file}</p>}
          </div>

          <div className="col-span-24 flex justify-end">
            <Button variant="default" form={form.id} type="submit">
              Speichern
            </Button>
          </div>
        </FormGrid>
      </Form>
    </PageContainer>
  )
}

export default LetterheadEdit
