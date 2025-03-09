/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import AuthContainer from '@/Components/AuthContainer'
import { FormCheckbox } from '@/Components/FormCheckbox'
import { FormErrors } from '@/Components/FormErrors'
import { FormGroup } from '@/Components/FormGroup'
import { FormInput } from '@/Components/FormInput'
import { Button } from '@/Components/ui/button'
import { useForm } from '@/Hooks/use-form'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head, Link } from '@inertiajs/react'
import type React from 'react'
interface LoginForm {
  email: string
  password: string
  remember: boolean
}

interface LoginProps {
  status?: string
  canResetPassword: boolean
}

const Login: React.FC<LoginProps> = ({ status, canResetPassword }) => {
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
    <AuthContainer title="Login">
      {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

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
                id="remember"
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
                className="rounded-xs text-sm text-gray-600 underline hover:text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Kennwort vergessen?
              </Link>
            )}
          </div>
          <div className="col-span-24">
            <Button
              disabled={processing}
              form="form"
              variant="default"
              className="w-full"
              size="lg"
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
