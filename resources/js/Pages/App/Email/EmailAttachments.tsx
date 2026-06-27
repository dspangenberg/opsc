import type * as React from 'react'
import { EmailAttachment } from '@/Pages/App/Email/EmailAttachment'

interface EmailAttachmentsProps {
  mail: App.Data.DropboxMailData
}
export const EmailAttachments: React.FC<EmailAttachmentsProps> = ({ mail }) => {
  if (!mail?.attachments?.length) return null
  return (
    <div className="m-8 w-fulll divide-y divide-border/50 rounded-lg border border-border border-dotted bg-background">
      {mail?.attachments?.map((attachment, index) => (
        <EmailAttachment key={index} mail={mail} attachment={attachment} />
      ))}
    </div>
  )
}
