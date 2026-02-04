import { router } from '@inertiajs/core'
import type * as React from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Alert } from '@/Components/twc-ui/alert'
import { AvatarUpload } from '@/Components/twc-ui/avatar-upload'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  user: App.Data.UserData
  status: string
}

type UserFormData = App.Data.UserData & {
  avatar: File | null
  remove_avatar: boolean
}

const ProfilEdit: React.FC<Props> = ({ user }) => {
  const form = useForm<UserFormData>('form-user-edit', 'put', route('app.profile.update'), {
    ...user,
    avatar: null,
    remove_avatar: false
  })

  const handleAvatarChange = (avatar: File | undefined) => {
    if (avatar) {
      form.setData('avatar', avatar)
    } else {
      form.setData('remove_avatar', true)
    }
  }

  const handleResendVerificationEmail = () => {
    router.post(route('verification.send'))
  }
  const handleClearPendingMailAddress = async () => {
    router.post(route('profile.clear-pending-mail-address'))
  }

  const breadcrumbs = [{ title: 'Profil ändern' }]

  return (
    <PageContainer
      title="Profil ändern"
      width="6xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        className="mx-auto flex max-w-3xl flex-1 overflow-y-hidden"
        footer={
          <div className="flex flex-none items-center justify-end gap-2 px-4 py-2">
            {form.isDirty && (
              <Button variant="outline" onClick={() => form.reset()} title="Zurücksetzen" />
            )}
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        {user.pending_email && (
          <Alert
            variant="warning"
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="link"
                  title="Erneut senden"
                  tooltip="Bestätigungs-E-Mail erneut senden"
                  className="text-yellow-700"
                  onClick={handleResendVerificationEmail}
                />
                <Button
                  variant="link"
                  size="auto"
                  title="Undo"
                  tooltip="Änderung der E-Mail-Adresse rückgängig machen"
                  className="text-yellow-700"
                  onClick={handleClearPendingMailAddress}
                />
              </div>
            }
          >
            Bitte bestätige {user.pending_email} als Deine neue E-Mail-Adresse.
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
              <FormTextField label="Nachname" isRequired {...form.register('last_name')} />
            </div>
            <div className="col-span-2" />
            <div className="col-span-11">
              <FormTextField label="E-Mail" isRequired {...form.register('email')} />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default ProfilEdit
