import { Link } from '@inertiajs/react'
import type * as React from 'react'

interface EmailViewProps {
  view: string
  label: string
  dropbox: App.Data.DropboxData
}
export const EmailView: React.FC<EmailViewProps> = ({ dropbox, label, view }) => {
  const activeView = route().params.view ?? 'inbox'
  return (
    <li className={activeView === view ? 'font-medium' : ''}>
      <Link href={route('app.email.index', { dropbox: dropbox.id, _query: { view } })}>
        {label}
      </Link>
    </li>
  )
}
