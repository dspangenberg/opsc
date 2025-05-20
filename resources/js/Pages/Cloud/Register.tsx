/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import AuthContainer from '@/Components/AuthContainer'
import { Button, FormGroup, FormInput, FormErrors} from '@dspangenberg/twcui'
import { useForm } from '@/Hooks/use-form'
import GuestLayout from '@/Layouts/GuestLayout'
import type React from 'react'

interface RegisterForm {
  email: string
  organisation: string
  first_name: string
  last_name: string
  website: string
}

const Register: React.FC = () => {
  const { data, errors, processing, submit, updateAndValidate, setErrors } = useForm<RegisterForm>(
    'post',
    route('cloud.register.store'),
    {
      email: '',
      organisation: '',
      first_name: '',
      last_name: '',
      website: ''
    }
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Submitting form')
    try {
      await submit(e)
    } catch (error) {
      console.error('Form submission failed', error)
      setErrors(error as Record<keyof RegisterForm, string>)
    }
  }

  const registerContent = (
    <AuthContainer title="Registrierung" maxWidth="md">
      <form id="register" onSubmit={handleSubmit}>
        <FormErrors errors={errors} />
        <FormGroup>
          <div className="col-span-12">
            <FormInput
              id="first_name"
              label="Vorname"
              required
              autoFocus
              value={data.first_name}
              error={errors?.first_name || ''}
              placeholder="Gabriele"
              onChange={updateAndValidate}
              onBlur={updateAndValidate}
            />
          </div>
          <div className="col-span-12">
            <FormInput
              id="last_name"
              label="Nachname"
              required
              value={data.last_name}
              error={errors?.last_name || ''}
              onChange={updateAndValidate}
              onBlur={updateAndValidate}
              placeholder="Mustermann"
            />
          </div>
          <div className="col-span-24">
            <FormInput
              id="organisation"
              label="Organisation"
              value={data.organisation}
              error={errors?.organisation || ''}
              placeholder="Verein Musterhausen e.V."
              onChange={updateAndValidate}
              onBlur={updateAndValidate}
            />
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
              placeholder="info@verein-musterhausen.de"
              onChange={updateAndValidate}
              onBlur={updateAndValidate}
            />
          </div>
          <div className="col-span-24">
            <FormInput
              id="website"
              required
              label="Website"
              value={data.website}
              error={errors?.website || ''}
              autoComplete="website"
              placeholder="https://verein-musterhausen.de"
              onChange={updateAndValidate}
              onBlur={updateAndValidate}
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
              form="register"
              disabled={processing}
              loading={processing}
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

  return <GuestLayout>{registerContent}</GuestLayout>
}

export default Register
