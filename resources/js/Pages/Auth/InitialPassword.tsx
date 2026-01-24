/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { FormDataConvertible } from '@inertiajs/core'
import { Link } from '@inertiajs/react'
import type React from 'react'
import { AuthContainer } from '@/Components/AuthContainer'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormPasswordField } from '@/Components/twc-ui/form-password-field'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import Logo from '@/Components/twc-ui/logo'
import GuestLayout from '@/Layouts/GuestLayout'

interface LoginProps {
  user: App.Data.UserData
}

interface PasswordChangeProps extends Record<string, FormDataConvertible> {
  email: string
  password: string
  password_confirmation: string
}

const InitialPassword: React.FC<LoginProps> = ({ user }) => {
  const form = useForm<PasswordChangeProps>(
    'auth-login-form',
    'post',
    route('initial-password.store'),
    {
      email: user.email,
      password: '',
      password_confirmation: ''
    },
    { validateOn: 'blur' }
  )

  const loginContent = (
    <AuthContainer
      title="Login"
      logo={<Logo className="size-12 rounded-md" />}
      cardTitle="Willkommen zurück"
      cardDescription="Melde Dich mit Deinen Zugangsdaten an."
    >
      <Form form={form}>
        <FormGrid>
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

          <div className="col-span-24">
            <FormPasswordField
              label="Neues Kennwort"
              showStrength
              showHint
              autoComplete="new-password"
              {...form.register('password')}
            />
          </div>
          <div className="col-span-24">
            <FormPasswordField
              label="Kennwort-Wiederholung"
              autoComplete="new-password"
              {...form.register('password_confirmation')}
            />
          </div>

          <div className="col-span-24">
            <Button
              isLoading={form.processing}
              form={form.id}
              variant="default"
              className="w-full"
              type="submit"
            >
              Kennwort speichern
            </Button>
          </div>
        </FormGrid>
      </Form>
    </AuthContainer>
  )

  return <GuestLayout>{loginContent}</GuestLayout>
}

export default InitialPassword
