import type { FormDataConvertible } from '@inertiajs/core'
import type * as React from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormPasswordField } from '@/Components/twc-ui/form-password-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  user: App.Data.UserData
}

interface PasswordChangeProps extends Record<string, FormDataConvertible> {
  email: string
  current_password: string
  password: string
  password_confirmation: string
}

const ChangePassword: React.FC<Props> = ({ user }) => {
  const form = useForm<PasswordChangeProps>(
    'form-update-password',
    'put',
    route('app.profile.password-update'),
    {
      email: user.email,
      current_password: '',
      password: '',
      password_confirmation: ''
    },
    { validateOn: 'blur' }
  )

  const breadcrumbs = [{ title: 'Kennwort ändern', url: route('app.setting') }]
  return (
    <PageContainer
      title="Kennwort ändern"
      width="6xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        className="z-10 mx-auto flex max-w-3xl flex-1 overflow-y-hidden"
        innerClassName="bg-background z-10"
        footer={
          <div className="flex flex-none items-center justify-end gap-2 px-4 py-2">
            {form.isDirty && (
              <Button variant="outline" onClick={() => form.reset()} title="Zurücksetzen" />
            )}
            <Button variant="default" form={form.id} type="submit" title="Kennwort ändern" />
          </div>
        }
      >
        <Form form={form}>
          <FormGrid>
            <div className="col-span-8">
              <input
                type="text"
                name="username"
                value={form.data.email}
                readOnly
                tabIndex={-1}
                autoComplete="username"
                aria-hidden="true"
                className="sr-only"
              />

              <FormPasswordField
                autoFocus
                label="Aktuelles Kennwort"
                {...form.register('current_password')}
              />
            </div>
          </FormGrid>
          <FormGrid>
            <div className="col-span-8">
              <FormPasswordField
                label="Neues Kennwort"
                showStrength
                showHint
                autoComplete="new-password"
                {...form.register('password')}
              />
            </div>
            <div className="col-span-8">
              <FormPasswordField
                label="Kennwort-Wiederholung"
                autoComplete="new-password"
                {...form.register('password_confirmation')}
              />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default ChangePassword
