import type { FormDataConvertible } from '@inertiajs/core'
import type * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormGrid } from '@/Components/twc-ui/form-grid'

interface FormData extends Record<string, FormDataConvertible> {
  contact_id: number
  project_id: number
  document_type_id: number
}

interface DocumentBulkEditComponentProps {
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
  documentTypes: App.Data.DocumentTypeData[]
  onConfirm: (data: FormData) => void
  onCancel: () => void
}

const DocumentBulkEditComponent: React.FC<DocumentBulkEditComponentProps> = ({
  contacts,
  projects,
  documentTypes,
  onConfirm,
  onCancel
}) => {
  const form = useForm<FormData>(
    'document-bulk-edit-form',
    'put',
    '',
    {
      contact_id: 0,
      project_id: 0,
      document_type_id: 0
    },
    {
      validateOn: 'none'
    }
  )

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
      title="Dokumente – Batchbearbeitung"
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

          <Button variant="default" type="submit" form={form.id}>
            Speichern
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        onSubmit={e => {
          e.preventDefault()
          setTimeout(() => {
            onConfirm(form.data)
          }, 50)
        }}
      >
        <FormGrid>
          <div className="col-span-24">
            <FormComboBox<App.Data.DocumentTypeData>
              autoFocus
              label="Dokumenttyp"
              isOptional
              items={documentTypes}
              {...form.register('document_type_id')}
            />
          </div>
          <div className="col-span-24">
            <FormComboBox<App.Data.ContactData>
              label="Kontakt"
              isOptional
              items={contacts}
              itemName="full_name"
              {...form.register('contact_id')}
            />
          </div>
          <div className="col-span-24">
            <FormComboBox<App.Data.ProjectData>
              label="Projekt"
              isOptional
              items={projects}
              {...form.register('project_id')}
            />
          </div>
        </FormGrid>
      </Form>
    </Dialog>
  )
}

interface DocumentEditAccountsComponentCallParams {
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
  documentTypes: App.Data.DocumentTypeData[]
}

export const DocumentBulkEdit = {
  call: (params: DocumentEditAccountsComponentCallParams): Promise<FormData | false> => {
    return new Promise<FormData | false>(resolve => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)
      let timeoutId: ReturnType<typeof setTimeout>

      const cleanup = () => {
        clearTimeout(timeoutId)
        root.unmount()
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
      }

      root.render(
        <DocumentBulkEditComponent
          {...params}
          onConfirm={(data: FormData) => {
            cleanup()
            resolve(data)
          }}
          onCancel={() => {
            cleanup()
            resolve(false)
          }}
        />
      )
      timeoutId = setTimeout(() => {
        cleanup()
        resolve(false)
      }, 500000)
    })
  },

  Root: () => null
}
