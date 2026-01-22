import type * as React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
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
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { Icon } from '@/Components/twc-ui/icon'
import { cn } from '@/Lib/utils'

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
  isReadOnly: boolean
  onSaved: () => void
  onCancel: (section: App.Data.OfferOfferSectionData) => void
  onDelete: (section: App.Data.OfferOfferSectionData) => void
}

export const OfferTermsSection: React.FC<OfferTermsSectionProps> = ({
  section,
  canDrag,
  editMode,
  isReadOnly = false,
  onClick,
  onCancel,
  onDelete,
  onSaved,
  textModules
}) => {
  const { pressProps } = usePress({
    onPress: _e => {
      if (isReadOnly) return
      onClick(section)
    }
  })
  const [currentContent, setCurrentContent] = useState<string>(section.content as string)
  const ref = useRef<MDXEditorMethods>(null)
  const [selectValue, setSelectValue] = useState<string>('')

  const form = useForm<App.Data.OfferOfferSectionData>(
    'form-offer-offer-section-edit',
    'put',
    route('app.offer.update-section', { offer: section.offer_id, offerSection: section.id }),
    section
  )

  const handleUpdate = (content: string) => {
    form.setData('content', content)
  }

  const handleSaved = () => {
    onSaved()
  }

  useEffect(() => {
    setCurrentContent(section.content as string)
    form.setData(section)
  }, [section])

  const cancelTitel = currentContent !== form.data.content ? 'Abbrechen' : 'Schließen'

  const handleCancel = async (section: App.Data.OfferOfferSectionData) => {
    if (currentContent !== form.data.content) {
      const promise = await AlertDialog.call({
        title: 'Änderungen verwerfen',
        message: 'Möchtest Du die Änderungen wirklich verwerfen?',
        buttonTitle: 'Änderungen verwerfen',
        variant: 'default'
      })

      if (promise) {
        form.setData({ ...section, content: currentContent })
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

  const pagebreakOptions = useMemo(
    () => [
      { label: 'Nach dem Abschnitt', value: 'after' },
      { label: 'Vor dem Abschnitt', value: 'before' },
      { label: 'Vor und nach dem Abschnitt', value: 'both' },
      { label: 'Kein Seitenumbruch', value: 'none' }
    ],
    []
  )

  return (
    <>
      {(section.pagebreak === 'before' || section.pagebreak === 'both') && (
        <div className="my-2 flex items-center gap-2 text-muted-foreground text-xs">
          <div className="h-px flex-1 bg-border" />
          <span>Seitenumbruch</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          !isReadOnly && canDrag ? 'hover:border-primary hover:border-solid' : '',
          'md-editor my-4 flex rounded-md border border-dashed bg-background p-4'
        )}
      >
        {editMode ? (
          <div className="flex-1">
            <Form form={form} onSubmitted={handleSaved}>
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
              <div className="pt-1.5">
                <FormSelect
                  label="Seitenumbruch"
                  items={pagebreakOptions}
                  itemValue="value"
                  itemName="label"
                  {...form.register('pagebreak')}
                />
              </div>

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
                  <Button
                    variant="outline"
                    title={cancelTitel}
                    onClick={() => handleCancel(section)}
                  />
                  <Button type="submit" title="Speichern" />
                </div>
              </div>
            </Form>
          </div>
        ) : (
          <>
            <div
              role="button"
              className={cn(
                !isReadOnly ? 'cursor-pointer' : '',
                'md-editor w-full flex-1 text-justify text-sm'
              )}
              {...pressProps}
            >
              <Markdown remarkPlugins={[remarkBreaks, remarkGfm]}>{section.content}</Markdown>
            </div>
            {canDrag && !isReadOnly && (
              <div
                className="cursor-grab pl-4 active:cursor-grabbing"
                {...attributes}
                {...listeners}
              >
                <Icon
                  icon={DragDropHorizontalIcon}
                  className="size-5 rotate-90 text-foreground/50"
                />
              </div>
            )}
          </>
        )}
      </div>
      {(section.pagebreak === 'after' || section.pagebreak === 'both') && (
        <div className="my-2 flex items-center gap-2 text-muted-foreground text-xs">
          <div className="h-px flex-1 bg-border" />
          <span>Seitenumbruch</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}
    </>
  )
}
