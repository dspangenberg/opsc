import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'
import '@mdxeditor/editor/style.css'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { AvatarUpload } from '@/Components/twc-ui/avatar-upload'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormCheckbox } from '@/Components/twc-ui/form-checkbox'

interface Props extends PageProps {
  user: App.Data.UserData
}

type UserFormData = App.Data.UserData & {
  avatar: File | null
}

const UserEdit: React.FC<Props> = ({ user }) => {
  const title = user.id ? 'Benutzerkonto bearbeiten' : 'Benutzerkonto hinzufügen'

  const form = useForm<UserFormData>(
    'form-user-edit',
    user.id ? 'put' : 'post',
    route(user.id ? 'app.setting.system.user.update' : 'app.setting.system.user.store', {
      user: user.id,
      _method: user.id ? 'put' : 'post'
    }),
    {
      ...user,
      avatar: null
    }
  )

  const cancelButtonTitle = form.isDirty ? 'Abbrechen' : 'Zurück'

  const breadcrumbs = useMemo(() => {
    return [
      { title: 'Einstellungen', url: route('app.setting') },
      { title: 'System', url: route('app.setting.system') },
      { title: 'Benutzerkonten', url: route('app.setting.system.user.index') },
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
        router.visit(route('app.setting.system.user.index'))
      }
    } else {
      router.visit(route('app.setting.system.user.index'))
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
        className="flex max-w-4xl flex-1 overflow-y-hidden"
        innerClassName="bg-white"
        footer={
          <div className="flex flex-none items-center justify-end gap-2 px-4 py-2">
            <Button variant="outline" onClick={handleCancel} title={cancelButtonTitle} />
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        <Form form={form} errorClassName="w-auto m-3">
          <FormGrid>
            <div className="col-span-2 inline-flex items-center justify-center">
              <div>
                <AvatarUpload
                  avatarUrl={user.avatar_url}
                  fullName={user.full_name}
                  onChanged={item => form.setData('avatar', item)}
                />
              </div>
            </div>
            <div className="col-span-11">
              <FormTextField label="Vorname" isRequired {...form.register('first_name')} />
            </div>
            <div className="col-span-11">
              <FormTextField label="Name" isRequired {...form.register('last_name')} />
            </div>
            <div className="col-span-2" />
            <div className="col-span-11">
              <FormTextField label="E-Mail" isRequired {...form.register('email')} />
              <div className="flex gap-2 pt-1.5">
                <FormCheckbox label="Administrator" {...form.registerCheckbox('is_admin')} />
                <FormCheckbox
                  label="Account ist gesperrt"
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
