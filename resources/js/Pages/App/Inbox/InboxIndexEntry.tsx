import { FolderUploadIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import { JSONTree } from 'react-json-tree'
import { parseAndFormatRelative } from '@/Lib/DateHelper'
import type { PageProps } from '@/Types'

interface InboxIndexEntryProps {
  mail: App.Data.DropboxInboxData
}

export const InboxIndexEntry: React.FC<InboxIndexEntryProps> = ({ mail }) => {
  const handleClicked = () => {
    console.log('clicked')
    router.visit(route('app.inbox.index', { mail: mail.id }), {
      preserveScroll: true,
      preserveState: true
    })
  }

  return (
    <div
      className="flex cursor-default items-center justify-between rounded-lg bg-white p-4 hover:bg-muted/50"
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
    </div>
  )
}
