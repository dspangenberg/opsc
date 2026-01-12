import axios from 'axios'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { DataTable } from '@/Components/DataTable'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog } from '@/Components/twc-ui/extended-dialog'
import { columns } from './DocumentSelectorColumns'

interface DocumentSelectorComponentProps {
  onCancel: () => void
  onConfirm: (documents: number[]) => void
}

const DocumentSelectorComponent: React.FC<DocumentSelectorComponentProps> = ({
  onCancel,
  onConfirm
}) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.DocumentData[]>([])
  const [documents, setDocuments] = useState<App.Data.DocumentData[]>([])

  useEffect(() => {
    axios
      .get(route('app.documents.documents.index'), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => {
        setDocuments(response.data.documents || [])
      })
      .catch(error => {
        console.error('Error loading documents:', error)
      })
  }, [])

  return (
    <ExtendedDialog
      isOpen={true}
      onClose={() => {
        setTimeout(() => {
          onCancel()
        }, 50)
      }}
      className="z-100"
      width="3xl"
      bodyClassName="w-3x bg-accent"
      confirmClose={false}
      role="dialog"
      background="accent"
      title="Dokumente auswählen"
      footer={dialogRenderProps => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onPress={dialogRenderProps.close}>
            Abbrechen
          </Button>
          <Button
            variant="default"
            onPress={() => {
              const documentIds = selectedRows
                .filter(row => row.id != null)
                .map(row => row.id as number)
              dialogRenderProps.close()
              setTimeout(() => {
                onConfirm(documentIds)
              }, 50)
            }}
            isDisabled={selectedRows.length === 0}
          >
            {selectedRows.length > 0
              ? `${selectedRows.length} Dokument${selectedRows.length > 1 ? 'e' : ''} auswählen`
              : 'Dokumente auswählen'}
          </Button>
        </div>
      )}
    >
      <DataTable
        columns={columns}
        onSelectedRowsChange={setSelectedRows}
        data={documents}
        itemName="Dokumente"
      />
    </ExtendedDialog>
  )
}

export const DocumentSelector = {
  call: (): Promise<boolean | number[]> => {
    return new Promise<boolean | number[]>(resolve => {
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
        <DocumentSelectorComponent
          onConfirm={ids => {
            cleanup()
            resolve(ids)
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
