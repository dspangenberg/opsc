import type { FormDataConvertible } from '@inertiajs/core'
import { router } from '@inertiajs/react'
import Editor from '@monaco-editor/react'
import type * as React from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  css: string
}

interface GlobalCssFormData extends Record<string, FormDataConvertible> {
  css: string
}

const GlobalCssEdit: React.FC<Props> = ({ css }) => {
  const form = useForm<GlobalCssFormData>(
    'form-global-css-edit',
    'put',
    route('app.setting.global-css-update'),
    {
      css: css
    }
  )

  const breadcrumbs = [
    { title: 'Einstellungen', url: route('app.setting') },
    { title: 'Drucksystem', url: route('app.setting.printing-system') },
    { title: 'Globales CSS für PDF-Dateien' }
  ]

  const handleClose = () => {
    router.get(route('app.setting.letterhead.index'))
  }

  return (
    <PageContainer
      title="Globales CSS für PDF-Dateien bearbeiten"
      width="6xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <Form form={form} onSubmitted={handleClose} className="max-w-4xl">
        <FormGrid>
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

export default GlobalCssEdit
