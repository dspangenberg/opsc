import { router } from '@inertiajs/react'
import { parseAndFormatRelative } from '@/Lib/DateHelper'
import { cn } from '@/Lib/utils'

interface InboxIndexEntryProps {
  isActive?: boolean
  mail: App.Data.DropboxInboxData
}

export const InboxIndexEntry: React.FC<InboxIndexEntryProps> = ({ mail, isActive }) => {
  const handleClicked = () => {
    console.log('clicked')
    router.visit(route('app.inbox.index', { mail: mail.id }), {
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
      <div className="flex flex-1 flex-col gap-2">
        <div className="w-64 font-medium text-sm">
          <span className="inline-block w-64 truncate">{mail.subject}</span>
        </div>
        <div className="line-clamp-2 w-64 text-foreground/60 text-xs leading-import">
          {mail.plain_body}
        </div>
      </div>
      <div className="flex-none">
        <div className="text-xs"> {parseAndFormatRelative(mail.date as string)}</div>
      </div>
    </button>
  )
}
