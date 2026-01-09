import { router } from '@inertiajs/react'
import Editor from '@monaco-editor/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  layout: App.Data.PrintLayoutData
  letterheads: App.Data.LetterheadData[]
}

const PrintLayoutEdit: React.FC<Props> = ({ layout, letterheads }) => {
  const title = layout.id ? 'Layout bearbeiten' : 'Layout hinzufügen'

  const form = useForm<App.Data.PrintLayoutData>(
    'form-letterhead-edit',
    layout.id ? 'put' : 'post',
    route(layout.id ? 'app.setting.layout.update' : 'app.setting.layout.store', {
      layout: layout.id
    }),
    layout
  )

  const breadcrumbs = useMemo(
    () => [
      { title: 'Einstellungen', url: route('app.setting') },
      { title: 'Drucksystem', url: route('app.setting.printing-system') },
      { title: 'Layouts', url: route('app.setting.layout.index') },
      { title: layout.title || 'Neuer Briefbogen' }
    ],
    [layout.title]
  )

  const handleClose = () => {
    router.get(route('app.setting.layout.index'))
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
          <div className="col-span-12">
            <FormTextField label="Titel" {...form.register('title')} />
          </div>
          <div className="col-span-12">
            <FormSelect
              label="Briefbogen"
              items={letterheads}
              itemName="title"
              {...form.register('letterhead_id')}
            />
          </div>
          <div className="col-span-24">
            <Editor
              height="50vh"
              defaultLanguage="css"
              defaultValue={form.data.css as string}
              onChange={value => form.setData('css', value as string)}
            />
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

export default PrintLayoutEdit
