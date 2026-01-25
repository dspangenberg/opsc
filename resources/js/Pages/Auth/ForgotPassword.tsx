/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { FormDataConvertible } from '@inertiajs/core'
import type React from 'react'
import { AuthContainer } from '@/Components/AuthContainer'
import { Alert } from '@/Components/twc-ui/alert'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import { LinkButton } from '@/Components/twc-ui/link-button'
import Logo from '@/Components/twc-ui/logo'
import GuestLayout from '@/Layouts/GuestLayout'

type LoginProps = {
  status: string
}

interface PasswordChangeProps extends Record<string, FormDataConvertible> {
  email: string
}

const ForgotPassword: React.FC<LoginProps> = ({ status }) => {
  const form = useForm<PasswordChangeProps>(
    'auth-login-form',
    'post',
    route('password.email'),
    {
      email: ''
    },
    { validateOn: 'blur' }
  )

  const loginContent = (
    <AuthContainer
      title="Login"
      logo={<Logo className="size-12 rounded-md" />}
      cardTitle="Kennwort vergessen?"
      cardDescription="Kein Problem. Teile uns einfach Deine E-Mail-Adresse mit und wir senden Dir einen Link zum Zurücksetzen Deines Kennwort zu, über den Du ein neues Kennwort festlegen kannst."
    >
      <Form form={form}>
        {status && (
          <Alert className="bg-green-50 text-green-600" title="Kennwort zurückgesetzt">
            {status}
          </Alert>
        )}
        <FormGrid>
          <div className="col-span-24">
            <FormTextField
              autoComplete="username"
              label="E-Mail"
              autoFocus
              {...form.register('email')}
            />
          </div>

          <div className="col-span-24 space-y-2">
            <Button
              isLoading={form.processing}
              form={form.id}
              variant="default"
              className="w-full"
              type="submit"
            >
              Kennwort zurücksetzen
            </Button>
            <LinkButton href={route('login')} size="full" variant="link" title="Zurück zum Login" />
          </div>
        </FormGrid>
      </Form>
    </AuthContainer>
  )

  return <GuestLayout>{loginContent}</GuestLayout>
}

export default ForgotPassword
