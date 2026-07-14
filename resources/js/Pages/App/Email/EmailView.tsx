import { Link } from '@inertiajs/react'
import type * as React from 'react'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { parseAndFormatDate } from '@/Lib/DateHelper'
import { EmailAttachments } from '@/Pages/App/Email/EmailAttachments'

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
