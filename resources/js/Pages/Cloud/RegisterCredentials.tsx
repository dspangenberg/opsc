/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import AuthContainer from '@/Components/AuthContainer'
import { Form, type FormSchema, useForm } from '@/Components/ui/twc-ui/form'
import { Button } from '@/Components/ui/twc-ui/button'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { TextField} from '@/Components/ui/twc-ui/text-field'
import GuestLayout from '@/Layouts/GuestLayout'

import type React from 'react'

interface RegisterCredentialsProps {
  registrationData: {
    company_house_name: number
    first_name: string
    last_name: string
    email: string
    website: string
    domain: string
    hid: string
  }
}
interface RegisterCredentialsForm {
  domain: string
  email: string
  password: string
  password_confirmation: string
  hid: string
}
const RegisterCredentials: React.FC<RegisterCredentialsProps> = ({ registrationData }) => {
  const form =
    useForm<RegisterCredentialsForm & FormSchema>('credentials','post', route('cloud.register.credentials'), {
      domain: registrationData.domain,
      email: registrationData.email,
      password: '',
      password_confirmation: '',
      hid: registrationData.hid
    })

  const domain = import.meta.env.VITE_APP_URL.replace('https://', '')

  const registerCredentialsContent = (
    <AuthContainer title="Registrierung" maxWidth="md">
        <Form form={form}>
        <FormGroup>
          <div className="col-span-24">

            <TextField
              label="Deine Subdomain"
              placeholder="www.example.com"
              autoFocus
              {...form.register('domain')}
            />

            <span className='inline-flex items-center rounded-r border border-gray-300 border-l-0 px-3 text-gray-500 sm:text-sm'>
              {domain}
            </span>
          </div>
          <div className="col-span-24">
            <TextField
              label="E-Mail-Adresse"
              autoComplete="username"
              isDisabled={true}
              {...form.register('email')}
            />
          </div>
          <div className="col-span-24">
            <TextField
              password-rules="minlength: 8; maxLength: 24; required: lower; required: upper; required: digit; required: [!@#$%^&*+=.-];"
              label="Kennwort"
              autoComplete="new-password"
              type="password"
              {...form.register('password')}
              isRequired
            />
          </div>

          <div className="col-span-24">
            <TextField
              label="Kennwort-Bestätigung"
              autoComplete="new-password"
              type="password"
              {...form.register('password_confirmation')}
              isRequired
            />
          </div>

          <div className='col-span-24 text-center text-sm'>
            <p className='my-3 text-center font-medium text-base text-black'>
              Indem Du mit der Registrierung fortfährst, stimmst Du unseren&nbsp;
              <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                Nutzungsbedingungen
              </a>
              &nbsp;und der&nbsp;
              <br />
              <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Datenschutzerklärung
              </a>
              &nbsp;zu.
            </p>
          </div>
          <div className="col-span-24">
            <Button
              isLoading={form.processing}
              form="credentials"
              variant="default"
              type="submit"
            >
              Jetzt registrieren
            </Button>
          </div>
          <div className='col-span-24 pt-4 text-center text-base'>
            <span className="font-bold">Du hast bereits ein Konto?</span> Melde Dich auf Deiner
            ooboo-Subdomain an oder
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              &nbsp;klicke hier, wenn Du Hilfe bei der Anmeldung benötigst.
            </a>
          </div>
        </FormGroup>
        </Form>
    </AuthContainer>
  )

  return <GuestLayout>{registerCredentialsContent}</GuestLayout>
}

export default RegisterCredentials
