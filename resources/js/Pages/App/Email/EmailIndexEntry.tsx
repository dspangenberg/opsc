import { AttachmentIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type React from 'react'
import { useContext } from 'react'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { Icon } from '@/Components/twc-ui/icon'
import { parseAndFormatRelative } from '@/Lib/DateHelper'
import { cn } from '@/Lib/utils'
import { EmailsContext } from '@/Pages/App/Email/EmailsContext'

interface InboxIndexEntryProps {
  isActive?: boolean
  mail: App.Data.DropboxMailData
  dropbox: App.Data.DropboxData
  view: string
}

export const EmailIndexEntry: React.FC<InboxIndexEntryProps> = ({
  dropbox,
  mail,
  isActive,
  view
}) => {
  const { selectedMails, setSelectedMails } = useContext(EmailsContext)
  const isSelected = selectedMails.includes(mail.id as number)

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedMails([...selectedMails, mail.id as number])
    } else {
      setSelectedMails(selectedMails.filter(id => id !== mail.id))
    }
  }

  const handleClicked = () => {
    router.visit(
      route('app.email.index', { dropbox: dropbox.id, mail: mail.id, _query: { view } }),
      {
        preserveScroll: true,
        preserveState: true
      }
    )
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
          <Checkbox
            name={`mail-id-${mail.id}`}
            isSelected={isSelected}
            onChange={handleCheckboxChange}
          />
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
        <div className="flex w-10 flex-none flex-col items-center gap-2 text-center text-foreground/80">
          <div className="text-xs"> {parseAndFormatRelative(mail.date as string)}</div>
          {!!mail?.attachments_count && <Icon icon={AttachmentIcon} className="size-3.5" />}
        </div>
      </div>
    </button>
  )
}
