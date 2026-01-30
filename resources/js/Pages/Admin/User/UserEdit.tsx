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

interface Props extends PageProps {
  user: App.Data.UserData
}

type UserFormData = App.Data.UserData & {
  avatar: File | null
  remove_avatar: boolean
}

const UserEdit: React.FC<Props> = ({ user }) => {
  const title = user.id ? 'Benutzer*in bearbeiten' : 'Benutzer*in hinzufügen'
  const authUser = usePage().props.auth.user as App.Data.UserData

  const form = useForm<UserFormData>(
    'form-user-edit',
    user.id ? 'put' : 'post',
    route(user.id ? 'admin.user.update' : 'admin.user.store', {
      user: user.id,
      _method: user.id ? 'put' : 'post'
    }),
    {
      ...user,
      remove_avatar: false,
      avatar: null
    }
  )

  const cancelButtonTitle = form.isDirty ? 'Abbrechen' : 'Zurück'

  const breadcrumbs = useMemo(() => {
    return [
      { title: 'Administration', url: route('admin') },
      { title: 'Benutzer:innen', url: route('admin.user.index') },
      { title }
    ]
  }, [])

  const handleAvatarChange = (avatar: File | undefined) => {
    if (avatar) {
      form.setData('avatar', avatar)
    } else {
      form.setData('remove_avatar', true)
    }
  }

  const handleCancel = async () => {
    if (form.isDirty) {
      const promise = await AlertDialog.call({
        title: 'Änderungen verwerfen',
        message: `Möchtest Du die Änderungen verwerfen?`,
        buttonTitle: 'Verwerfen'
      })
      if (promise) {
        router.visit(route('admin.user.index'))
      }
    } else {
      router.visit(route('admin.user.index'))
    }
  }

  const handleResendVerificationEmail = async () => {
    router.post(route('admin.user.verification.send', { user: user.id }))
  }

  const handleClearPendingMailAddress = async () => {
    router.post(route('admin.user.clear-pending-mail-address', { user: user.id }))
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
        {user.pending_email && (
          <Alert
            variant="info"
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="link"
                  size="auto"
                  title="Erneut senden"
                  className="text-yellow-700"
                  onClick={handleResendVerificationEmail}
                />
                <Button
                  variant="link"
                  size="auto"
                  title="Undo"
                  className="text-yellow-700"
                  onClick={handleClearPendingMailAddress}
                />
              </div>
            }
          >
            Die geänderte E-Mail-Adresse <strong>{user.pending_email}</strong> wurde noch nicht
            bestätigt.
          </Alert>
        )}
        <Form form={form}>
          <FormGrid>
            <div className="col-span-2 inline-flex items-center justify-center">
              <div>
                <AvatarUpload
                  src={user.avatar_url}
                  fullname={user.full_name}
                  initials={user.initials}
                  size="lg"
                  onSelect={item => handleAvatarChange(item)}
                />
              </div>
            </div>
            <div className="col-span-11">
              <FormTextField
                autoFocus
                label="Vorname"
                isRequired
                {...form.register('first_name')}
              />
            </div>
            <div className="col-span-11">
              <FormTextField label="Name" isRequired {...form.register('last_name')} />
            </div>
            <div className="col-span-2" />
            <div className="col-span-11">
              <FormTextField label="E-Mail" isRequired {...form.register('email')} />
              <div className="flex gap-2 pt-1.5">
                <FormCheckbox
                  isDisabled={authUser.id === user.id}
                  label="Administrator"
                  {...form.registerCheckbox('is_admin')}
                />
                <FormCheckbox
                  label="Account ist gesperrt"
                  isDisabled={authUser.id === user.id}
                  {...form.registerCheckbox('is_locked')}
                />
              </div>
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default UserEdit
