/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import AuthContainer from '@/Components/AuthContainer'
import { Button } from '@dspangenberg/twcui'

import { FormErrors, FormGroup, FormInput, FormLabel} from '@dspangenberg/twcui'


import { FormPasswordInput } from '@/Components/FormPasswordInput'
import { useForm } from '@/Hooks/use-form'
import GuestLayout from '@/Layouts/GuestLayout'
import { focusInput } from '@/Lib/utils'
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
  const { data, errors, processing, setErrors, submit, updateAndValidate } =
    useForm<RegisterCredentialsForm>('post', route('cloud.register.credentials'), {
      domain: registrationData.domain,
      email: registrationData.email,
      password: '',
      password_confirmation: '',
      hid: registrationData.hid
    })

  const domain = import.meta.env.VITE_APP_URL.replace('https://', '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Submitting form')
    try {
      await submit(e)
    } catch (error) {
      console.error('Form submission failed', error)
      setErrors(error as Record<keyof RegisterCredentialsForm, string>)
    }
  }

  const registerCredentialsContent = (
    <AuthContainer title="Registrierung" maxWidth="md">
      <form id="credentials" onSubmit={handleSubmit}>
        <FormErrors errors={errors} />
        <FormGroup>
          <div className="col-span-24">
            <FormLabel htmlFor="company-website" required>
              Deine Subdomain:
            </FormLabel>
            <div className={`mt-2 flex rounded-sm  ${focusInput}`}>
              <input
                id="company-website"
                name="company-website"
                type="text"
                placeholder="www.example.com"
                value={data.domain}
                onChange={updateAndValidate}
                className={
                  'block w-full min-w-0 flex-1 rounded-none text-base px-2.5 py-2 rounded-l border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400sm:text-sm/6 '
                }
              />
              <span className="inline-flex items-center rounded-r border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                {domain}
              </span>
            </div>
          </div>

          <div className="col-span-24">
            <FormInput
              id="email"
              type="email"
              required
              label="E-Mail-Adresse"
              value={data.email}
              error={errors?.email || ''}
              autoComplete="username"
              placeholder="info@haus-gabriele.de"
              onBlur={updateAndValidate}
              onChange={updateAndValidate}
            />
          </div>
          <div className="col-span-24">
            <FormPasswordInput
              id="password"
              type="password"
              required
              label="Kennwort"
              passwordRules="minlength: 8; maxLength: 24; required: lower; required: upper; required: digit; required: [!@#$%^&*+=.-];"
              autoComplete="new-password"
              value={data.password}
              error={errors?.password || ''}
              onChange={updateAndValidate}
              onBlur={updateAndValidate}
            />
          </div>
          <div className="col-span-24">
            <FormInput
              type="password"
              id="password_confirmation"
              required
              label="Kennwort-Bestätigung"
              value={data.password_confirmation}
              error={errors?.password_confirmation || ''}
              autoComplete="password"
              onChange={updateAndValidate}
            />
          </div>
          <div className="col-span-24 text-sm text-center">
            <p className="text-center text-base font-medium my-3 text-black">
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
              disabled={processing}
              loading={processing}
              form="credentials"
              variant="default"
              type="submit"
            >
              Jetzt registrieren
            </Button>
          </div>
          <div className="col-span-24 text-center text-base pt-4">
            <span className="font-bold">Du hast bereits ein Konto?</span> Melde Dich auf Deiner
            ooboo-Subdomain an oder
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              &nbsp;klicke hier, wenn Du Hilfe bei der Anmeldung benötigst.
            </a>
          </div>
        </FormGroup>
      </form>
    </AuthContainer>
  )

  return <GuestLayout>{registerCredentialsContent}</GuestLayout>
}

export default RegisterCredentials
