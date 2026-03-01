import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'
import '@mdxeditor/editor/style.css'
import { Alert } from '@/Components/twc-ui/alert'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { AvatarUpload } from '@/Components/twc-ui/avatar-upload'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormCheckbox } from '@/Components/twc-ui/form-checkbox'
import { FormPasswordField } from '@/Components/twc-ui/form-password-field'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'

interface Props extends PageProps {
  email_account: App.Data.EmailAccountData
}

const EmailAccountEdit: React.FC<Props> = ({ email_account }) => {
  const title = email_account.id ? 'E-Mail-Account bearbeiten' : 'E-Mail-Account hinzufügen'

  const form = useForm<App.Data.EmailAccountData>(
    'form-email-account-edit',
    email_account.id ? 'put' : 'post',
    route(email_account.id ? 'admin.email-account.update' : 'admin.email-account.store', {
      emailAccount: email_account.id
    }),
    email_account
  )

  const cancelButtonTitle = form.isDirty ? 'Abbrechen' : 'Zurück'

  const breadcrumbs = useMemo(() => {
    return [
      { title: 'Administration', url: route('admin') },
      { title: 'Benutzer:innen', url: route('admin.user.index') },
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
        router.visit(route('admin.email-account.index'))
      }
    } else {
      router.visit(route('admin.email-account.index'))
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
              <FormTextField
                autoFocus
                label="E-Mail-Adresse"
                isRequired
                {...form.register('email')}
              />
            </div>
            <div className="col-span-12">
              <FormTextField label="Absender" isRequired {...form.register('name')} />
            </div>
            <div className="col-span-12">
              <FormTextField label="SMTP-Username" isRequired {...form.register('smtp_username')} />
            </div>
            <div className="col-span-12">
              <FormPasswordField
                label="SMTP-Kennwort"
                isRequired
                {...form.register('smtp_password')}
              />
            </div>
            <div className="col-span-24">
              <FormTextArea label="Signatur" isRequired {...form.register('signature')} />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default EmailAccountEdit
