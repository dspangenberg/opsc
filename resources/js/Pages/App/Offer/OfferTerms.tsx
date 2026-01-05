import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { OfferDetailsLayout } from '@/Pages/App/Offer/OfferDetailsLayout'
import type { PageProps } from '@/Types'
import { OfferDetailsSide } from './OfferDetailsSide'
import { OfferLinesEditor } from './OfferLinesEditor'
import { OfferTable } from './OfferTable'
import { useOfferTable } from './OfferTableProvider'
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
  tablePlugin,
  toolbarPlugin
} from '@mdxeditor/editor'
import { Button } from '@/Components/twc-ui/button'
import { Select } from '@/Components/twc-ui/select'

interface OfferTermsProps extends PageProps {
  offer: App.Data.OfferData
  textModules: App.Data.TextModuleData[]
  children?: React.ReactNode
}

const OfferTerms: React.FC<OfferTermsProps> = ({ children, offer, textModules }) => {
  const handleContentUpdate = (content: string) => console.log(content.replaceAll('\\', ''))
  const ref = useRef<MDXEditorMethods>(null)
  const [selectValue, setSelectValue] = useState<string>('')
  const [editMode, setEditMode] = useState(false)

  const onInsertTextModule = (id: number) => {
    const textModule = textModules.find(module => module.id === id)
    console.log(textModule)
    ref.current?.insertMarkdown(textModule?.content as string)
  }

  return (
    <OfferDetailsLayout
      offer={offer}
      termsEditMode={editMode}
      onTermsEditModeChange={value => setEditMode(value as boolean)}
    >
      <div className="flex-1 flex-col">
        <Select
          aria-label="Textbaustein"
          items={textModules}
          value={selectValue}
          itemName="title"
          onChange={value => onInsertTextModule(value as number)}
        />
        <MDXEditor
          markdown={offer.additional_text as string}
          readOnly={!editMode}
          ref={ref}
          className="isolated rounded-md border border-border bg-background p-2"
          contentEditableClassName="font-sans text-base isolated"
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
        {editMode && (
          <div className="mt-4 flex gap-2">
            <Button variant="default" onClick={() => setEditMode(false)}>
              Speichern
            </Button>
            <Button variant="outline" onClick={() => setEditMode(false)}>
              Abbrechen
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
