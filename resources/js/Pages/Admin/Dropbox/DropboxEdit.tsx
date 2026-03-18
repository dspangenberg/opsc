import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  dropbox: App.Data.DropboxData
}

const DropboxEdit: React.FC<Props> = ({ dropbox }) => {
  const title = dropbox.id ? 'Dropbox bearbeiten' : 'Dropbox hinzufügen'

  const form = useForm<App.Data.DropboxData>(
    'form-email-dropbox',
    dropbox.id ? 'put' : 'post',
    route(dropbox.id ? 'admin.dropbox.update' : 'admin.dropbox.store', {
      dropbox: dropbox.id
    }),
    dropbox
  )

  const cancelButtonTitle = form.isDirty ? 'Abbrechen' : 'Zurück'

  const breadcrumbs = useMemo(() => {
    return [
      { title: 'Administration', url: route('admin') },
      { title: 'Dropboxen', url: route('admin.dropbox.index') },
      { title }
    ]
  }, [])

  const handleCancel = async () => {
    if (form.isDirty) {
      const promise = await AlertDialog.call({
        title: 'Änderungen verwerfen',
        message: `Möchtest Du die Änderungen verwerfen?`,
        buttonTitle: 'Verwerfen'
      })
      if (promise) {
        router.visit(route('admin.dropbox.index'))
      }
    } else {
      router.visit(route('admin.dropbox.index'))
    }
  }

  return (
    <PageContainer
      title={title}
      width="6xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        className="mx-auto flex max-w-4xl flex-1 overflow-y-hidden"
        footer={
          <div className="flex flex-none items-center justify-end gap-2 px-4 py-2">
            <Button variant="outline" onClick={handleCancel} title={cancelButtonTitle} />
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        <Form form={form}>
          <FormGrid>
            <div className="col-span-12">
              <FormTextField label="Bezeichnung" isRequired {...form.register('name')} />
            </div>
            <div className="col-span-12">
              <FormTextField
                autoFocus
                label="E-Mail-Adresse"
                isRequired
                {...form.register('email_address')}
              />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default DropboxEdit
