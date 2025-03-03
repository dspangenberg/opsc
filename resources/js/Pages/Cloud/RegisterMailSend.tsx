import AuthContainer from '@/Components/AuthContainer'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head } from '@inertiajs/react'
import type React from 'react'

const RegisterMailSend: React.FC = () => {
  const registerMailSendContent = (
    <AuthContainer title="Registrierung" maxWidth="md">
      <Head title="Registrierung" />
      <div className="text-center">
        <p className="help-text">
          Bitte verifiziere Deine E-Mail-Adresse, indem Du auf den Link klickst, den wir Dir soeben
          per Mail geschickt haben.
        </p>
      </div>
    </AuthContainer>
  )

  return <GuestLayout>{registerMailSendContent}</GuestLayout>
}

export default RegisterMailSend
