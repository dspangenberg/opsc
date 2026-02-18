import { Head } from '@inertiajs/react'

const ErrorPage = ({ status }: { status: 403 | 404 | 500 | 503 }) => {
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
    <div>
      <Head title={title} />
      <h1>{title}</h1>
      <div>{description}</div>
    </div>
  )
}

export default ErrorPage
export { ErrorPage }
