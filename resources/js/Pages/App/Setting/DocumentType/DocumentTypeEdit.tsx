import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog } from '@/Components/twc-ui/extended-dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  documentType: App.Data.DocumentTypeData
}

const DocumentTypeEdit: React.FC<Props> = ({ documentType }) => {
  const title = documentType.id ? 'Dokumenttyp bearbeiten' : 'Neuen Dokumenttyp hinzufügen'
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<App.Data.DocumentTypeData>(
    'form-document-type-edit',
    documentType.id ? 'put' : 'post',
    route(
      documentType.id ? 'app.setting.document_type.update' : 'app.setting.document_type.store',
      {
        documentType: documentType.id
      }
    ),
    documentType
  )

  const handleClose = () => {
    setIsOpen(false)
    router.visit(route('app.setting.document_type.index'))
  }

  return (
    <ExtendedDialog
      isOpen={isOpen}
      onClosed={handleClose}
      title={title}
      confirmClose={form.isDirty}
      footer={dialogRenderProps => (
        <div className="mx-0 flex w-full gap-2">
          <div className="flex flex-1 justify-start" />
          <div className="flex flex-none gap-2">
            <Button variant="outline" onClick={dialogRenderProps.close}>
              Abbrechen
            </Button>
            <Button variant="default" form={form.id} type="submit" isLoading={form.processing}>
              Speichern
            </Button>
          </div>
        </div>
      )}
    >
      <Form form={form} onSubmitted={() => setIsOpen(false)}>
        <FormGrid>
          <div className="col-span-24">
            <FormTextField label="Bezeichnung" {...form.register('name')} />
          </div>
        </FormGrid>
      </Form>
    </ExtendedDialog>
  )
}

export default DocumentTypeEdit
