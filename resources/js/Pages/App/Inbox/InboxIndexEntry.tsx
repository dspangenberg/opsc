import { FolderUploadIcon } from '@hugeicons/core-free-icons'
import { parseAndFormatRelative } from '@/Lib/DateHelper'
import type { PageProps } from '@/Types'

interface InboxIndexEntryProps {
  mail: App.Data.InboxEntryData
}

export const InboxIndexEntry: React.FC<InboxIndexEntryProps> = ({ mail }) => {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4">
      <div className="flex flex-1 flex-col gap-2">
        <div className="w-64 font-medium text-sm">
          <span className="inline-block w-64 truncate">{mail.subject}</span>
        </div>
        <div className="line-clamp-2 w-64 text-foreground/60 text-xs leading-import">
          {mail.body}
        </div>
      </div>
      <div className="flex-none">
        <div className="text-xs"> {parseAndFormatRelative(mail.sent_at as string)}</div>
      </div>
    </div>
  )
}
