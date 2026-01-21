import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import '@mdxeditor/editor/style.css'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  InsertTable,
  ListsToggle,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  type MDXEditorMethods,
  markdownShortcutPlugin,
  Select,
  tablePlugin,
  toolbarPlugin
} from '@mdxeditor/editor'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'
import { FormSelect } from '@/Components/twc-ui/form-select'

interface Props extends PageProps {
  section: App.Data.OfferSectionData
}

const OfferSectionEdit: React.FC<Props> = ({ section }) => {
  const title = section.id
    ? 'Angebotsbedingungen - Abschnitt bearbeiten'
    : 'Neuen Angebotsbedingungen - Abschnitt hinzufügen'
  const [isMounted, setIsMounted] = useState(false)

  const breadcrumbs = [
    { title: 'Einstellungen', url: route('app.setting') },
    { title: 'Angebote', url: route('app.setting.offer') },
    { title: title }
  ]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const form = useForm<App.Data.OfferSectionData>(
    'form-offer-section-edit',
    section.id ? 'put' : 'post',
    route(section.id ? 'app.setting.offer-section.update' : 'app.setting.offer-section.store', {
      section: section.id
    }),
    section
  )

  const handleContentUpdate = (content: string) => {
    if (isMounted) {
      form.updateAndValidateWithoutEvent('default_content', content.replaceAll('\\', ''))
    }
  }

  const cancelButtonTitle = form.isDirty ? 'Abbrechen' : 'Zurück'
  const pagebreakOptions = useMemo(
    () => [
      { label: 'Nach dem Abschnitt', value: 'after' },
      { label: 'Vor dem Abschnitt', value: 'before' },
      { label: 'Vor und nach dem Abschnitt', value: 'both' },
      { label: 'Kein Seitenumbruch', value: 'none' }
    ],
    []
  )

  const handleCancel = async () => {
    if (form.isDirty) {
      const promise = await AlertDialog.call({
        title: 'Änderungen verwerfen',
        message: `Möchtest Du die Änderungen verwerfen?`,
        buttonTitle: 'Verwerfen'
      })
      if (promise) {
        router.visit(route('app.setting.offer-section.index'))
      }
    } else {
      router.visit(route('app.setting.offer-section.index'))
    }
  }

  return (
    <PageContainer
      title={title}
      width="6xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        className="flex flex-1 overflow-y-hidden"
        innerClassName="bg-background"
        footer={
          <div className="flex flex-none items-center justify-end gap-2 px-4 py-2">
            <Button variant="outline" onClick={handleCancel} title={cancelButtonTitle} />
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        <Form form={form}>
          <FormGrid>
            <div className="col-span-24">
              <FormTextField label="Bezeichnung" {...form.register('name')} />
            </div>
            <div className="col-span-24">
              <MDXEditor
                markdown={(form.data.default_content as string) || ''}
                className="isolated rounded-md border border-border bg-background p-2"
                contentEditableClassName="font-sans text-base isolated md-editor"
                plugins={[
                  headingsPlugin(),
                  markdownShortcutPlugin(),
                  tablePlugin(),
                  listsPlugin(),
                  linkPlugin(),
                  linkDialogPlugin(),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <BlockTypeSelect />
                        <BoldItalicUnderlineToggles />
                        <InsertTable />
                        <ListsToggle />
                        <CreateLink />
                      </>
                    )
                  })
                ]}
                onChange={data => handleContentUpdate(data)}
              />
              <div className="pt-1.5">
                <FormSelect
                  label="Seitenumbruch"
                  {...form.register('pagebreak')}
                  items={pagebreakOptions}
                  itemValue="value"
                  itemName="label"
                />
              </div>
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default OfferSectionEdit
