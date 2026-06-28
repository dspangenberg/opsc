import { router } from '@inertiajs/core'
import { filesize } from 'filesize'
import * as React from 'react'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { PdfViewer } from '@/Components/twc-ui/pdf-viewer'

interface EmailAttachmentsProps {
  attachment: App.Data.DropboxMailAttachmentData
  mail: App.Data.DropboxMailData
}
export const EmailAttachment: React.FC<EmailAttachmentsProps> = ({ attachment, mail }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const handlePreview = async () => {
    await PdfViewer.call({
      file: route('app.email.attachment-preview', {
        dropbox: mail.dropbox_id,
        mail: mail.id,
        attachment: attachment.id
      })
    })
  }

  const handleImportAsReciept = async () => {
    setIsLoading(true)
    router.put(
      route('app.email.attachment-receipt', {
        dropbox: mail.dropbox_id,
        mail: mail.id,
        attachment: attachment.id
      }),
      {},
      {
        onSuccess: () => setIsLoading(false)
      }
    )
  }

  const handleImportAsDocument = async () => {
    setIsLoading(true)
    router.put(
      route('app.email.attachment-document', {
        dropbox: mail.dropbox_id,
        mail: mail.id,
        attachment: attachment.id
      }),
      {},
      {
        onSuccess: () => setIsLoading(false)
      }
    )
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-1.5">
      <div className="flex-1 text-sm">{attachment.filename}</div>
      <div className="flex-none text-foreground/50 text-xs">{filesize(attachment.size)}</div>
      <div className="flex-none">
        <DropdownButton variant="ghost" size="icon-sm" title="Aktionen" isDisabled={isLoading}>
          <MenuItem title="Vorschau" separator onAction={handlePreview} />
          <MenuItem title="In Belegverwaltung übernehmen" onAction={handleImportAsReciept} />
          <MenuItem title="In Dokumentverwaltung übernehmen" onAction={handleImportAsDocument} />
        </DropdownButton>
      </div>
    </div>
  )
}
