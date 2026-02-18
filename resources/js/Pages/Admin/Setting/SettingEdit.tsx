import type * as React from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { TextArea } from '@/Components/twc-ui/text-area'

interface SettingEditDialogComponentProps {
  setting: App.Data.SettingData
  onConfirm: (value: string) => void
  onCancel: () => void
}

const SettingEditDialogComponent: React.FC<SettingEditDialogComponentProps> = ({
  setting,
  onCancel,
  onConfirm
}) => {
  const [value, setValue] = useState<string>(setting.value ?? '')

  return (
    <Dialog
      isOpen={true}
      onClose={() => {
        setTimeout(() => {
          onCancel()
        }, 50)
      }}
      className="z-100 bg-background"
      confirmClose={false}
      width="lg"
      bodyPadding
      isDismissible={true}
      title="Einstellung bearbeiten"
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setTimeout(() => {
                onCancel()
              }, 50)
            }}
          >
            Abbrechen
          </Button>

          <Button
            variant="default"
            onClick={() => {
              setTimeout(() => {
                onConfirm(value)
              }, 50)
            }}
          >
            Speichern
          </Button>
        </div>
      }
    >
      <div className="flex w-full flex-1 rounded-t-lg">
        <TextArea
          autoFocus
          className="w-full"
          label={`${setting.group}.${setting.key}`}
          value={value}
          onChange={(value: React.SetStateAction<string>) => setValue(value)}
        />
      </div>
    </Dialog>
  )
}
interface SettingEditDialogCallParams {
  setting: App.Data.SettingData
}
export const SettingEditDialog = {
  call: (params: SettingEditDialogCallParams): Promise<string | false> => {
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
        <SettingEditDialogComponent
          {...params}
          onConfirm={(value: string) => {
            cleanup()
            resolve(value)
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
