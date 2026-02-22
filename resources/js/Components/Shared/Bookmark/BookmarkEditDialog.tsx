import type * as React from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { TextField } from '@/Components/twc-ui/text-field'

interface BookmarkEditDialogComponentProps {
  name?: string
  title: string
  buttonTitle?: string
  onConfirm: (name: string) => void
  onCancel: () => void
}

const BookmarkEditDialogComponent: React.FC<BookmarkEditDialogComponentProps> = ({
  buttonTitle = 'Lesezeichen erstellen',
  name = '',
  title,
  onCancel,
  onConfirm
}) => {
  const [bookmarkName, setBookmarkName] = useState<string>(name)
  return (
    <Dialog
      isOpen={true}
      onClose={() => {
        setTimeout(() => {
          onCancel()
        }, 50)
      }}
      className="z-100 bg-white"
      confirmClose={false}
      width="lg"
      bodyPadding
      isDismissible={true}
      title={title}
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button
            title="Abbrechen"
            variant="outline"
            onClick={() => {
              setTimeout(() => {
                onCancel()
              }, 50)
            }}
          />
          <Button
            variant="default"
            title={buttonTitle}
            onClick={() => {
              setTimeout(() => {
                onConfirm(bookmarkName)
              }, 50)
            }}
          />
        </div>
      }
    >
      <div className="flex w-full flex-1 rounded-t-lg">
        <FormGrid>
          <div className="col-span-24">
            <TextField
              label="Bezeichnung"
              value={bookmarkName}
              onChange={setBookmarkName}
              autoFocus
            />
          </div>
        </FormGrid>
      </div>
    </Dialog>
  )
}

interface BookmarkEditDialogCallParams {
  buttonTitle?: string
  name?: string
  title: string
}

export const BookmarkEditDialog = {
  call: (params: BookmarkEditDialogCallParams): Promise<string | false> => {
    return new Promise<string | false>(resolve => {
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
        <BookmarkEditDialogComponent
          {...params}
          onConfirm={(name: string) => {
            cleanup()
            resolve(name)
          }}
          onCancel={() => {
            cleanup()
            resolve(false)
          }}
        />
      )

      setTimeout(() => {
        cleanup()
        resolve(false)
      }, 500000)
    })
  },

  Root: () => null
}
