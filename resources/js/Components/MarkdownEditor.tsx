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
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin
} from '@mdxeditor/editor'
import type * as React from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@mdxeditor/editor/style.css'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog } from '@/Components/twc-ui/extended-dialog'

interface MarkdownEditorComponentProps {
  onCancel: () => void
  onConfirm: (content: string) => void
  content: string
}

const MarkdownEditorComponent: React.FC<MarkdownEditorComponentProps> = ({
  onCancel,
  onConfirm,
  content
}) => {
  const [contentText, setContentText] = useState(content)
  const [isDirty, setIsDirty] = useState(false)
  const handleUpdate = (content: string) => {
    setContentText(content)
    setIsDirty(true)
  }
  return (
    <ExtendedDialog
      isOpen={true}
      confirmClose={isDirty}
      onClose={() => {
        setTimeout(() => {
          onCancel()
        }, 50)
      }}
      className="z-100"
      width="3xl"
      bodyClassName="bg-accent h-[80vh]"
      role="dialog"
      background="accent"
      title="Markdown bearbeiten"
      footer={dialogRenderProps => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" title="Abbrechen" onPress={dialogRenderProps.close} />
          <Button
            title="Markdown übernehmen"
            variant="default"
            onPress={() => {
              onConfirm(contentText)
            }}
          />
        </div>
      )}
    >
      <MDXEditor
        markdown={(content as string) || ''}
        autoFocus
        className="isolated w-full rounded-md border border-border bg-background p-2"
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
    </ExtendedDialog>
  )
}

interface MarkdownEditorCallParams {
  content: string
}

export const MarkdownEditor = {
  call: (params: MarkdownEditorCallParams): Promise<boolean | string> => {
    return new Promise<boolean | string>(resolve => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const cleanup = () => {
        root.unmount()
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
      }

      root.render(
        <MarkdownEditorComponent
          content={params.content}
          onConfirm={content => {
            cleanup()
            resolve(content)
          }}
          onCancel={() => {
            cleanup()
            resolve(false)
          }}
        />
      )
    })
  },

  Root: () => null
}
