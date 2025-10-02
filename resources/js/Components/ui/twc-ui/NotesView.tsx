import type React from 'react'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { Avatar } from '@/Components/ui/twc-ui/avatar'

interface NotesViewProps {
  notes: App.Data.NoteableData[]
}

export const NotesView: React.FC<NotesViewProps> = ({ notes }) => {
  return (
    <div className="flex flex-col gap-4">
      {notes.map(note => (
        <div key={note.notable_id} className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Avatar
              initials={note.creator.initials}
              fullname={note.creator.full_name}
              size="md"
              src={note.creator.avatar_url}
            />
            <div className="flex-1 rounded-lg bg-muted p-4 text-base">
              <Markdown remarkPlugins={[remarkBreaks]}>{note.note}</Markdown>
            </div>
          </div>
          <div className="ml-16 text-muted-foreground text-sm">{note.created_at}</div>
        </div>
      ))}
    </div>
  )
}
