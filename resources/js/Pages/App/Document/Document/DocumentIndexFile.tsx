import {
  Delete02Icon,
  Delete04Icon,
  DeletePutBackIcon,
  Edit03Icon,
  MoreVerticalCircle01Icon,
  PinIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import { filesize } from 'filesize'
import type * as React from 'react'
import { useContext } from 'react'
import { Pressable } from 'react-aria'
import { HoverCard, HoverCardContent } from '@/Components/hover-card'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { DocumentIndexContext } from '@/Pages/App/Document/Document/DocumentIndex'
import { DocumentIndexFileCard } from '@/Pages/App/Document/Document/DocumentIndexFileCard'

interface DocumentIndexPageProps {
  document: App.Data.DocumentData
  onClick: (document: App.Data.DocumentData) => void
}

export const DocumentIndexFile: React.FC<DocumentIndexPageProps> = ({ document, onClick }) => {
  const { selectedDocuments, setSelectedDocuments } = useContext(DocumentIndexContext)
  const isSelected = selectedDocuments.includes(document.id as number)
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

  const handleRestore = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokument wiederherstellen',
      message: `Möchtest Du das ${document.filename} wiederherstellen?`,
      buttonTitle: 'Wiederherstellen'
    })
    if (promise) {
      router.get(route('app.documents.documents.restore', { id: document.id }))
    }
  }

  const handleForceDelete = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokument endgültig löschen',
      message: `Möchtest Du das ${document.filename} endgültig löschen?`,
      buttonTitle: 'Löschen'
    })
    if (promise) {
      router.delete(route('app.documents.documents.force-delete', { id: document.id }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, document.id as number])
    } else {
      setSelectedDocuments(selectedDocuments.filter(id => id !== document.id))
    }
  }

  return (
    <div className="relative flex h-64 w-full flex-col overflow-hidden rounded-md border bg-muted/40 shadow-sm hover:border-primary">
      <Pressable onClick={() => onClick(document)}>
        <button type="button" className="w-full border-0 bg-transparent p-0">
          <img
            key={document.id}
            src={route('app.documents.documents.preview', { id: document.id })}
            className="h-28 w-full object-cover object-top"
            style={{ objectPosition: '50% 0%' }}
            alt={document.filename}
          />
        </button>
      </Pressable>

      <div className="flex flex-none flex-col space-y-0 rounded-b-md p-4">
        <HoverCard>
          <Pressable>
            <span
              role="button"
              tabIndex={0}
              className="truncate font-medium text-sm hover:text-primary-500"
            >
              {document.title}
            </span>
          </Pressable>
          <HoverCardContent placement="bottom">
            <DocumentIndexFileCard document={document} />
          </HoverCardContent>
        </HoverCard>
        {document.contact_id && (
          <div className="mt-1 truncate text-xs">{document.contact?.full_name}</div>
        )}

        <div className="mt-1 truncate text-muted-foreground text-xs">{document.filename}</div>
        <div className="mt-0.5 grid grid-cols-2 text-muted-foreground text-xs">
          <div>{document.issued_on}</div>
          <div className="text-right">{filesize(document.file_size)}</div>
        </div>
      </div>

      <div className="absolute right-1 bottom-1 left-1 flex items-center justify-between px-0.5">
        <div className="flex items-center gap-0.5 pl-2">
          <Checkbox
            name={`document-id-${document.id}`}
            isSelected={isSelected}
            onChange={handleCheckboxChange}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            icon={PinIcon}
            iconClassName={`${document.is_pinned ? 'fill-blue-500 text-blue-500 hover:text-foreground' : 'border-border fill-background hover:text-foreground/50'}`}
          />
        </div>
        <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
          {!document.deleted_at && (
            <>
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
            </>
          )}
          {document.deleted_at && (
            <>
              <MenuItem
                icon={DeletePutBackIcon}
                title="Dokument wiederherstellen"
                onClick={handleRestore}
              />
              <MenuItem
                icon={Delete04Icon}
                title="Dokument endgültig löschen"
                onClick={handleForceDelete}
              />
            </>
          )}
        </DropdownButton>
      </div>
    </div>
  )
}
