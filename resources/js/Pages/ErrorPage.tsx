import { Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

interface ErrorPageProps {
  status: number
  message: string
}
const ErrorPage = ({ status, message }: ErrorPageProps) => {
  const title = {
    503: '503: Service nicht verfügbar',
    500: '500: Serverfehler',
    404: '404: Seite nicht gefunden',
    403: '403: Zugriff verweigert'
  }[status]

  const description = {
    503: 'Entschuldigung, wir führen gerade Wartungsarbeiten durch. Bitte versuchen Sie es in Kürze erneut.',
    500: 'Hoppla, auf unserem Server ist ein Fehler aufgetreten.',
    404: 'Entschuldigung, die gesuchte Seite konnte nicht gefunden werden.',
    403: 'Entschuldigung, Sie haben keine Berechtigung, auf diese Seite zuzugreifen.'
  }[status]

  return (
    <AppLayout>
      <div className="h-full w-full flex-1">
        <div className="mx-auto my-auto">
          <Head title={title} />
          <h1>{title}</h1>
          <div>{description}</div>
          {message && <p>{message}</p>}
        </div>
      </div>
    </AppLayout>
  )
}

export default ErrorPage
export { ErrorPage }
