import type * as React from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'
import '@mdxeditor/editor/style.css'
import { AvatarUpload } from '@/Components/twc-ui/avatar-upload'
import { FormCard } from '@/Components/twc-ui/form-card'

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
        innerClassName="bg-white"
        footer={
          <div className="flex flex-none items-center justify-end gap-2 px-4 py-2">
            {form.isDirty && (
              <Button variant="outline" onClick={() => form.reset()} title="Zurücksetzen" />
            )}
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        <Form form={form} errorClassName="w-auto m-3">
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
              <FormTextField
                label="E-Mail"
                isRequired
                {...form.register('email')}
                description="Die Änderung der E-Mail-Adresse wird erst nach Bestätigung wirksam."
              />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default ProfilEdit
