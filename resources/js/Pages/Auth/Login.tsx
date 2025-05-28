/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { AuthContainer } from '@/Components/AuthContainer'
import GuestLayout from '@/Layouts/GuestLayout'
import { Link } from '@inertiajs/react'
import type React from 'react'
import { Logo } from '@dspangenberg/twcui'
import { Form, useForm } from '@/Components/twcui/form'
import { FormGroup } from '@/Components/twcui/form-group'
import { Input } from '@/Components/twcui/input'
import { Checkbox } from '@/Components/jolly-ui/checkbox'
import { Button} from '@/Components/twcui/button'


interface LoginForm {
  email: string
  password: string
  remember: boolean
}

interface LoginProps {
  status?: string
  canResetPassword: boolean
}

const Login: React.FC<LoginProps> = ({ canResetPassword }) => {
  const { form } = useForm<App.Data.LoginData>(
    'auth-login-form',
    'post',
    route('login'),
    {
      email: '',
      password: '',
      remember: false
    }
  )

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
            <Input
              autocomplete="username"
              label="E-Mail"
              autoFocus
              {...form.register('email')}
            />
          </div>

          <div className="col-span-24">
            <Input
              autoComplete="current-password"
              type="password"
              label="Kennwort"
              {...form.register('password')}
            />

            <div className="mt-1">
              <Checkbox
                {...form.registerCheckbox('remember')}
                className="pt-1.5"
              >
                Angemeldet bleiben
              </Checkbox>
            </div>
          </div>

          <div className="col-span-24 text-right">
            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="rounded-xs text-sm text-gray-600 underline hover:text-gray-900 "
              >
                Kennwort vergessen?
              </Link>
            )}
          </div>
          <div className="col-span-24">
            <Button
              loading={form.processing}
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
