import * as React from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { DataTable } from '@/Components/DataTable'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { columns } from '@/Pages/App/Offer/OfferTermsSectionSelectorColumns'

interface OfferTermsSectionSelectorProps {
  sections: App.Data.OfferSectionData[]
  onConfirm: (ids: number[]) => void
  onCancel: () => void
}

const OfferTermsSectionSelectorComponent: React.FC<OfferTermsSectionSelectorProps> = ({
  sections,
  onCancel,
  onConfirm
}) => {
  const [selectedRows, setSelectedRows] = React.useState<App.Data.OfferSectionData[]>([])
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
      title="Abschnitte auswählen"
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
                onConfirm(selectedRows.map(section => section.id as number))
              }, 50)
            }}
          >
            Abschnitte auswählen
          </Button>
        </div>
      }
    >
      <div className="flex w-full flex-1 rounded-t-lg">
        <DataTable
          columns={columns}
          onSelectedRowsChange={setSelectedRows}
          data={sections}
          itemName="Abschnitte"
        />
      </div>
    </Dialog>
  )
}

interface OfferTermsSectionSelectorCallParams {
  sections: App.Data.OfferSectionData[]
}

export const OfferTermsSectionSelector = {
  call: (params: OfferTermsSectionSelectorCallParams): Promise<number[] | false> => {
    return new Promise<number[] | false>(resolve => {
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
        <OfferTermsSectionSelectorComponent
          {...params}
          onConfirm={(ids: number[]) => {
            cleanup()
            resolve(ids)
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
