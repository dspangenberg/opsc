import {
  Delete02Icon,
  Edit03Icon,
  MoreVerticalCircle01Icon,
  PinIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import { filesize } from 'filesize'
import type * as React from 'react'
import { Pressable } from 'react-aria'
import { HoverCard, HoverCardContent } from '@/Components/hover-card'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Icon } from '@/Components/twc-ui/icon'
import { MenuItem } from '@/Components/twc-ui/menu'
import { DocumentIndexFileCard } from '@/Pages/App/Document/Document/DocumentIndexFileCard'

interface DocumentIndexPageProps {
  document: App.Data.DocumentData
  onClick: (document: App.Data.DocumentData) => void
}

export const DocumentIndexFile: React.FC<DocumentIndexPageProps> = ({ document, onClick }) => {
  const handleDelete = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokument löschen',
      message: `Möchtest Du das ${document.filename} wirklich löschen?`,
      buttonTitle: 'Dokument löschen'
    })
    if (promise) {
      router.delete(route('app.documents.documents.trash', { id: document.id }))
    }
  }

  return (
    <Pressable onClick={() => onClick(document)}>
      <div className="relative flex h-58 w-full cursor-pointer flex-col overflow-hidden rounded-md border bg-muted/40 shadow-sm hover:border-primary">
        <img
          key={document.id}
          src={route('app.documents.documents.preview', { id: document.id })}
          className="h-28 w-full object-cover object-top"
          style={{ objectPosition: '50% 0%' }}
          alt={document.filename}
        />
        <HoverCard>
          <Pressable onClick={() => onClick(document)}>
            <div className="flex flex-none flex-col space-y-0 rounded-b-md p-4">
              <div className="truncate font-medium text-sm hover:text-primary-500">
                {document.title}
              </div>
              <div className="mt-1 truncate text-xs">{document.filename}</div>
              <div className="mt-0.5 grid grid-cols-2 text-muted-foreground text-xs">
                <div>{document.issued_on}</div>
                <div className="text-right">{filesize(document.file_size)}</div>
              </div>
            </div>
          </Pressable>
          <HoverCardContent placement="top">
            <DocumentIndexFileCard document={document} />
          </HoverCardContent>
        </HoverCard>
        <div className="absolute right-1 bottom-1 left-1 flex items-center justify-between px-2">
          <Button
            variant="ghost"
            size="icon-sm"
            icon={PinIcon}
            iconClassName={`${document.is_pinned ? 'fill-blue-500 text-blue-500 hover:text-foreground' : 'border-border fill-background hover:text-foreground/50'}`}
          />

          <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
            <MenuItem
              icon={Edit03Icon}
              title="Dokument bearbeiten"
              href={route('app.documents.documents.edit', { document: document.id })}
              separator
            />
            <MenuItem
              icon={Delete02Icon}
              title="Dokument löschen"
              variant="destructive"
              onClick={handleDelete}
            />
          </DropdownButton>
        </div>
      </div>
    </Pressable>
  )
}
