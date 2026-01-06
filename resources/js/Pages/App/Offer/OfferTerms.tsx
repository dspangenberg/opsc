import type * as React from 'react'
import { useRef, useState } from 'react'
import { OfferDetailsLayout } from '@/Pages/App/Offer/OfferDetailsLayout'
import type { PageProps } from '@/Types'
import { OfferDetailsSide } from './OfferDetailsSide'
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
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { Select as TwcUiSelect } from '@/Components/twc-ui/select'

interface OfferTermsProps extends PageProps {
  offer: App.Data.OfferData
  textModules: App.Data.TextModuleData[]
  children?: React.ReactNode
}

interface SelectItems {
  label: string
  value: string
}

const OfferTerms: React.FC<OfferTermsProps> = ({ children, offer, textModules }) => {
  const ref = useRef<MDXEditorMethods>(null)
  const [selectValue, setSelectValue] = useState<string>('')
  const [editMode, setEditMode] = useState(false)

  const onInsertTextModule = (id: number) => {
    const textModule = textModules.find(module => module.id === id)
    ref.current?.insertMarkdown(textModule?.content as string)
  }

  const form = useForm<Pick<App.Data.OfferData, 'additional_text'>>(
    'form-offer-terms-edit',
    'put',
    route('app.offer.update-terms', {
      offer: offer.id
    }),
    { additional_text: offer.additional_text }
  )

  const handleContentUpdate = (content: string) => {
    form.updateAndValidateWithoutEvent('additional_text', content.replaceAll('\\', ''))
  }

  const selectItems: SelectItems[] = textModules.map(module => ({
    label: module.title || 'Unbenannt',
    value: String(module.id)
  }))

  return (
    <OfferDetailsLayout
      offer={offer}
      termsEditMode={editMode}
      onTermsEditModeChange={value => setEditMode(value as boolean)}
    >
      <div className="flex-1 flex-col">
        <TwcUiSelect
          aria-label="Textbaustein"
          items={textModules}
          isDisabled={!editMode}
          value={selectValue}
          itemName="title"
          onChange={value => onInsertTextModule(value as number)}
        />
        <Form form={form}>
          <MDXEditor
            markdown={offer.additional_text as string}
            readOnly={!editMode}
            ref={ref}
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
                    <Select
                      items={selectItems}
                      value={selectValue}
                      onChange={value => onInsertTextModule(Number(value))}
                      placeholder="Textbausteine"
                      triggerTitle="Textbaustein einfügen"
                    />
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
        </Form>
        {editMode && (
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setEditMode(false)}>
              Abbrechen
            </Button>
            <Button form={form.id} variant="default" type="submit">
              Speichern
            </Button>
          </div>
        )}
      </div>
      <div className="h-fit w-sm flex-none space-y-6 px-1">
        <OfferDetailsSide offer={offer} />
      </div>
    </OfferDetailsLayout>
  )
}

export default OfferTerms
