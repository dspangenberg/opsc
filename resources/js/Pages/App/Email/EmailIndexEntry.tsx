import { AttachmentIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type React from 'react'
import { Icon } from '@/Components/twc-ui/icon'
import { parseAndFormatRelative } from '@/Lib/DateHelper'
import { cn } from '@/Lib/utils'

interface InboxIndexEntryProps {
  isActive?: boolean
  mail: App.Data.DropboxMailData
  dropbox: App.Data.DropboxData
}

export const EmailIndexEntry: React.FC<InboxIndexEntryProps> = ({ dropbox, mail, isActive }) => {
  const handleClicked = () => {
    router.visit(route('app.email.index', { dropbox: dropbox.id, mail: mail.id }), {
      preserveScroll: true,
      preserveState: true
    })
  }

  return (
    <button
      className={cn(
        'flex cursor-default items-start justify-between rounded-lg bg-white p-4 text-left hover:bg-muted/50',
        isActive && 'border bg-muted'
      )}
      type="button"
      onClick={handleClicked}
    >
      <div className="flex flex-none items-center gap-2">
        <div className="flex w-4 flex-none items-center justify-center">
          {mail.seen_at === null && <span className="size-2 rounded-full bg-primary" />}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="w-64 text-sm">{mail.from}</div>
          <div className="w-64 font-medium text-sm">
            <span className="inline-block w-64 truncate text-sm">{mail.subject}</span>
          </div>
          <div className="line-clamp-2 w-64 text-foreground/60 text-xs leading-import">
            {mail.body}
          </div>
        </div>
        <div className="flex flex-none flex-col items-center gap-2">
          <div className="text-xs"> {parseAndFormatRelative(mail.date as string)}</div>
          {mail.attachments_count > 0 && (
            <Icon icon={AttachmentIcon} className="size-3.5 text-foreground/80" />
          )}
        </div>
      </div>
    </button>
  )
}
