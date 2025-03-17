/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { AuthContainer } from '@/Components/AuthContainer'
import { useForm } from '@/Hooks/use-form'
import GuestLayout from '@/Layouts/GuestLayout'
import { Link } from '@inertiajs/react'
import type React from 'react'
import { Logo, FormErrors, FormGroup, Button, FormCheckbox, FormInput } from '@dspangenberg/twcui'

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
  const { data, errors, processing, setData, submit, updateAndValidate } = useForm<LoginForm>(
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
      <form onSubmit={submit} id="form">
        <FormErrors errors={errors} />
        <FormGroup>
          <div className="col-span-24">
            <FormInput
              id="email"
              type="email"
              autoFocus
              label="E-Mail-Adresse"
              value={data.email}
              error={errors?.email || ''}
              autoComplete="username"
              onChange={updateAndValidate}
            />
          </div>

          <div className="col-span-24">
            <FormInput
              id="password"
              type="password"
              value={data.password}
              label="Kennwort"
              error={errors?.password || ''}
              autoComplete="current-password"
              onChange={updateAndValidate}
            />
            <div className="mt-1">
              <FormCheckbox
                checked={data.remember}
                label="Angemeldet bleiben"
                onCheckedChange={checked => setData('remember', checked)}
              />
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
              loading={processing}
              form="form"
              variant="default"
              className="w-full"
              type="submit"
            >
              Anmelden
            </Button>
          </div>
        </FormGroup>
      </form>
    </AuthContainer>
  )

  return <GuestLayout>{loginContent}</GuestLayout>
}

export default Login
