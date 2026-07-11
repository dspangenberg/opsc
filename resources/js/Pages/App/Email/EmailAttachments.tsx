import type * as React from 'react'
import { EmailAttachment } from '@/Pages/App/Email/EmailAttachment'

interface EmailAttachmentsProps {
  mail: App.Data.DropboxMailData
}
export const EmailAttachments: React.FC<EmailAttachmentsProps> = ({ mail }) => {
  if (!mail?.attachments?.length) return null
  return (
    <div className="flex flex-1 flex-col justify-start gap-0 space-y-0">
      <div className="m-0 mb-1 ml-12 font-medium text-sm">Anhänge</div>
      <div className="mx-8 divide-y divide-border/50 rounded-lg border border-border border-dotted bg-background">
        {mail?.attachments?.map((attachment, index) => (
          <EmailAttachment key={index} mail={mail} attachment={attachment} />
        ))}
      </div>
    </div>
  )
}
