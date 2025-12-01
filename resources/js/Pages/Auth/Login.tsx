/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Link } from '@inertiajs/react'
import type React from 'react'
import { AuthContainer } from '@/Components/AuthContainer'
import { Logo } from '@/Components/ui/logo'
import { Button } from '@/Components/ui/twc-ui/button'
import { Checkbox } from '@/Components/ui/twc-ui/checkbox'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import GuestLayout from '@/Layouts/GuestLayout'

interface LoginProps {
  status?: string
  canResetPassword: boolean
}

const Login: React.FC<LoginProps> = ({ canResetPassword }) => {
  const form = useForm<App.Data.LoginData>('auth-login-form', 'post', route('login'), {
    email: '',
    password: '',
    remember: false
  })

  const loginContent = (
    <AuthContainer
      title="Login"
      logo={<Logo />}
      cardTitle="Willkommen zurück"
      cardDescription="Melde Dich mit Deinen Zugangsdaten an."
    >
      <Form form={form}>
        <FormGroup>
          <div className="col-span-24">
            <TextField
              autoComplete="username"
              label="E-Mail"
              autoFocus
              {...form.register('email')}
            />
          </div>

          <div className="col-span-24">
            <TextField
              autoComplete="current-password"
              type="password"
              label="Kennwort"
              {...form.register('password')}
            />

            <div className="mt-1">
              <Checkbox {...form.registerCheckbox('remember')} className="pt-1.5">
                Angemeldet bleiben
              </Checkbox>
            </div>
          </div>

          <div className="col-span-24 text-right">
            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="rounded-xs text-gray-600 text-sm underline hover:text-gray-900"
              >
                Kennwort vergessen?
              </Link>
            )}
          </div>
          <div className="col-span-24">
            <Button
              isLoading={form.processing}
              form={form.id}
              variant="default"
              className="w-full"
              type="submit"
            >
              Anmelden
            </Button>
          </div>
        </FormGroup>
      </Form>
    </AuthContainer>
  )

  return <GuestLayout>{loginContent}</GuestLayout>
}

export default Login
