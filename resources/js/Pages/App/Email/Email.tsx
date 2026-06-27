import type * as React from 'react'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { parseAndFormatDate } from '@/Lib/DateHelper'
import { EmailAttachments } from '@/Pages/App/Email/EmailAttachments'

interface InboxMailProps {
  mail: App.Data.DropboxMailData
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
}
export const Email: React.FC<InboxMailProps> = ({ mail }) => {
  return (
    <div className="md-editor mx-auto mt-8 h-fit w-4xl space-y-6 rounded-lg border border-border/80 bg-background shadow">
      <div className="flex flex-col justify-center gap-2 border-b bg-muted/50 px-8 py-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="w-16 text-right text-muted-foreground">Von:</div>
          <div className="flex-1 font-medium text-base">{mail.from}</div>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <div className="w-16 text-right text-muted-foreground">An:</div>
          <div className="flex-1 font-medium text-base">{mail.to.join(', ')}</div>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <div className="w-16 text-right text-muted-foreground">Betreff:</div>
          <div className="flex-1 font-medium text-base">{mail.subject}</div>
          <div className="text-sm">
            {parseAndFormatDate(mail.date as string, 'dd. MMMM yyyy HH:mm')}
          </div>
        </div>
      </div>

      <EmailAttachments mail={mail} />

      <div className="px-8 py-4">
        <Markdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="md-a">
                {children}
              </a>
            )
          }}
        >
          {mail.body}
        </Markdown>
      </div>
    </div>
  )
}
