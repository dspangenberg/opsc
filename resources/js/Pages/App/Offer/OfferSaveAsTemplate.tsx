import type * as React from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog } from '@/Components/twc-ui/extended-dialog'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { TextField } from '@/Components/twc-ui/text-field'

interface DocumentSelectorComponentProps {
  onCancel: () => void
  onConfirm: (templateNam: string) => void
  templateName: string
}

const OfferSaveAsTemplateComponent: React.FC<DocumentSelectorComponentProps> = ({
  onCancel,
  onConfirm,
  templateName: ParamsTemplateName
}) => {
  const [templateName, setTemplateName] = useState<string>(ParamsTemplateName)

  return (
    <ExtendedDialog
      isOpen={true}
      onClose={() => {
        setTimeout(() => {
          onCancel()
        }, 50)
      }}
      className="z-100"
      width="2xl"
      bodyClassName="w-3x bg-accent"
      confirmClose={false}
      role="dialog"
      background="background"
      title="Angebot als Vorlage speichern"
      footer={dialogRenderProps => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onPress={dialogRenderProps.close}>
            Abbrechen
          </Button>
          <Button
            title="Als Vorlage speichern"
            variant="default"
            onPress={() => {
              setTimeout(() => {
                onConfirm(templateName)
              }, 50)
            }}
            isDisabled={!templateName}
          />
        </div>
      )}
    >
      <FormGrid>
        <div className="col-span-24">
          <TextField
            label="Vorlagenname"
            autoFocus
            value={templateName}
            onChange={setTemplateName}
          />
        </div>
      </FormGrid>
    </ExtendedDialog>
  )
}

interface OfferSaveAsTemplateCallParams {
  templateName: string
}

export const OfferSaveAsTemplate = {
  call: (params: OfferSaveAsTemplateCallParams): Promise<boolean | string> => {
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
        <OfferSaveAsTemplateComponent
          onConfirm={templateNam => {
            cleanup()
            resolve(templateNam)
          }}
          onCancel={() => {
            cleanup()
            resolve(false)
          }}
          {...params}
        />
      )
    })
  },

  Root: () => null
}
