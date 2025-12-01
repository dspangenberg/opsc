/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import AuthContainer from '@/Components/AuthContainer'
import { Button } from '@/Components/ui/twc-ui/button'
import { Form, type FormSchema, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import GuestLayout from '@/Layouts/GuestLayout'

interface RegisterForm {
  email: string
  organisation: string
  first_name: string
  last_name: string
  website: string
}

const Register: React.FC = () => {
  const form = useForm<RegisterForm & FormSchema>(
    'register-form',
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

  const registerContent = (
    <AuthContainer title="Registrierung" maxWidth="md">
      <Form form={form}>
        <FormGroup>
          <div className="col-span-12">
            <TextField label="Vorname" autoFocus {...form.register('first_name')} />
          </div>
          <div className="col-span-12">
            <TextField label="Name" autoFocus {...form.register('last_name')} />
          </div>
          <div className="col-span-24">
            <TextField label="Organisation" autoFocus {...form.register('organisation')} />
          </div>
          <div className="col-span-24">
            <TextField label="E-Mail-Adresse" autoFocus {...form.register('email')} />
          </div>
          <div className="col-span-24">
            <TextField label="Website" autoFocus {...form.register('website')} />
          </div>
          <div className="col-span-24 text-center text-sm">
            <p className="my-3 text-center font-medium text-base text-black">
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
              form={form.id}
              isLoading={form.processing}
              size="auto"
              variant="default"
              type="submit"
            >
              Jetzt registrieren
            </Button>
          </div>
          <div className="col-span-24 pt-4 text-center text-base">
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

  return <GuestLayout>{registerContent}</GuestLayout>
}

export default Register
