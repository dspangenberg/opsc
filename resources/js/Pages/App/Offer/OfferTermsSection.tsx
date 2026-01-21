import type * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import '@mdxeditor/editor/style.css'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Delete03Icon, DragDropHorizontalIcon } from '@hugeicons/core-free-icons'
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
import { usePress } from 'react-aria'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Icon } from '@/Components/twc-ui/icon'

interface SelectItems {
  label: string
  value: string
}

interface OfferTermsSectionProps {
  section: App.Data.OfferOfferSectionData
  textModules: App.Data.TextModuleData[]
  canDrag: boolean
  onClick: (section: App.Data.OfferOfferSectionData) => void
  editMode: boolean
  onSave: (section: App.Data.OfferOfferSectionData) => void
  onCancel: (section: App.Data.OfferOfferSectionData) => void
  onDelete: (section: App.Data.OfferOfferSectionData) => void
}

export const OfferTermsSection: React.FC<OfferTermsSectionProps> = ({
  section,
  canDrag,
  editMode,
  onClick,
  onCancel,
  onDelete,
  onSave,
  textModules
}) => {
  const { pressProps } = usePress({
    onPress: _e => onClick(section)
  })
  const [currentContent, setCurrentContent] = useState<string>(section.content as string)
  const [updatedSection, setUpdatedSection] = useState<App.Data.OfferOfferSectionData>(section)
  const ref = useRef<MDXEditorMethods>(null)
  const [selectValue, setSelectValue] = useState<string>('')

  const handleUpdate = (content: string) => {
    setUpdatedSection({ ...section, content })
  }

  useEffect(() => {
    setCurrentContent(section.content as string)
    setUpdatedSection(section)
  }, [section])

  const cancelTitel = currentContent !== updatedSection.content ? 'Abbrechen' : 'Schließen'

  const handleCancel = async (section: App.Data.OfferOfferSectionData) => {
    if (currentContent !== updatedSection.content) {
      const promise = await AlertDialog.call({
        title: 'Änderungen verwerfen',
        message: 'Möchtest Du die Änderungen wirklich verwerfen?',
        buttonTitle: 'Änderungen verwerfen',
        variant: 'default'
      })

      if (promise) {
        setUpdatedSection({ ...section, content: currentContent })
        onCancel(section)
      }
    } else {
      onCancel(section)
    }
  }

  const handleDelete = async (section: App.Data.OfferOfferSectionData) => {
    const promise = await AlertDialog.call({
      title: 'Abschnitt löschen',
      message: 'Möchtest Du den Abschnitt wirklich löschen?',
      buttonTitle: 'Abschnitt löschen',
      variant: 'destructive'
    })

    if (promise) {
      onDelete(section)
    }
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id ?? 0,
    disabled: !canDrag
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const selectItems: SelectItems[] = textModules.map(module => ({
    label: module.title || 'Unbenannt',
    value: String(module.id)
  }))

  const onInsertTextModule = (id: number) => {
    const textModule = textModules.find(module => module.id === id)
    if (textModule?.content) {
      ref.current?.insertMarkdown(textModule.content)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="md-editor my-4 flex rounded-md border border-dashed bg-background p-4 hover:border-primary hover:border-solid"
    >
      {editMode ? (
        <div className="flex-1">
          <MDXEditor
            markdown={(section.content as string) || ''}
            ref={ref}
            autoFocus
            className="isolated w-full cursor-text rounded-md border border-border bg-background p-2"
            contentEditableClassName="font-sans text-base isolated md-editor z-50"
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
            onChange={data => handleUpdate(data)}
          />
          <div className="mt-4 flex items-center justify-between gap-2">
            <div>
              <Button
                icon={Delete03Icon}
                variant="ghost-destructive"
                size="icon"
                onClick={() => handleDelete(section)}
              />
            </div>
            <div className="flex flex-1 items-center justify-end gap-2">
              <Button variant="outline" title={cancelTitel} onClick={() => handleCancel(section)} />
              <Button onClick={() => onSave(updatedSection)} title="Speichern" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            role="button"
            className="md-editor w-full flex-1 cursor-pointer text-justify text-sm"
            {...pressProps}
          >
            <Markdown remarkPlugins={[remarkBreaks, remarkGfm]}>{section.content}</Markdown>
          </div>
          {canDrag && (
            <div className="cursor-grab pl-4 active:cursor-grabbing" {...attributes} {...listeners}>
              <Icon icon={DragDropHorizontalIcon} className="size-5 rotate-90 text-foreground/50" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
