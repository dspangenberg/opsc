import { router } from '@inertiajs/react'
import { MDXEditor } from '@mdxeditor/editor'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog } from '@/Components/twc-ui/extended-dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCheckbox } from '@/Components/twc-ui/form-checkbox'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'
import '@mdxeditor/editor/style.css'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  InsertTable,
  ListsToggle,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin
} from '@mdxeditor/editor'

interface Props extends PageProps {
  module: App.Data.TextModuleData
}

const TextModuleEdit: React.FC<Props> = ({ module }) => {
  const title = module.id ? 'Textbaustein bearbeiten' : 'Textbausteine hinzufügen'

  const form = useForm<App.Data.TextModuleData>(
    'form-offer-section-edit',
    module.id ? 'put' : 'post',
    route(module.id ? 'app.setting.text-module.update' : 'app.setting.text-module.store', {
      module: module.id
    }),
    module
  )

  const breadcrumbs = useMemo(
    () => [
      { title: 'Einstellungen', url: route('app.setting') },
      { title: 'Angebote', url: route('app.setting.offer') },
      { title: 'Textbaustein', url: route('app.setting.text-module.index') },
      { title: module.title || 'Neuer Textbaustein' }
    ],
    [module.title]
  )

  const handleClose = () => {
    router.get(route('app.setting.text-module.index'))
  }

  const handleContentUpdate = (content: string) => {
    console.log(content)
    form.updateAndValidateWithoutEvent('content', content)
  }

  return (
    <PageContainer
      title="Textbausteine"
      width="7xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <Form form={form} onSubmitted={handleClose}>
        <FormGrid>
          <div className="col-span-24">
            <FormTextField label="Titel" {...form.register('title')} />
          </div>
          <div className="col-span-24">
            <MDXEditor
              markdown={(form.data.content as string) || ''}
              className="rounded-md border border-border bg-background p-2"
              contentEditableClassName="font-sans text-base"
              plugins={[
                headingsPlugin(),
                markdownShortcutPlugin(),
                tablePlugin(),
                listsPlugin(),
                linkPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <BlockTypeSelect />
                      <BoldItalicUnderlineToggles />
                      <InsertTable />
                      <ListsToggle />{' '}
                    </>
                  )
                })
              ]}
              onChange={data => handleContentUpdate(data)}
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

export default TextModuleEdit
