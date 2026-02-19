import {
  AlertCircleIcon,
  Delete02Icon,
  Delete04Icon,
  DeletePutBackIcon,
  Edit03Icon,
  FileDownloadIcon,
  InformationCircleIcon,
  MoreVerticalCircle01Icon,
  PinIcon
} from '@hugeicons/core-free-icons'
import { Link, router } from '@inertiajs/react'
import { filesize } from 'filesize'
import type * as React from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import { Pressable } from 'react-aria'
import { HoverCard, HoverCardContent } from '@/Components/hover-card'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Icon } from '@/Components/twc-ui/icon'
import { LogoSpinner } from '@/Components/twc-ui/logo-spinner'
import { MenuItem } from '@/Components/twc-ui/menu'
import { useFileDownload } from '@/Hooks/use-file-download'
import { DocumentIndexContext } from '@/Pages/App/Document/Document/DocumentIndexContext'
import { DocumentIndexFileCard } from '@/Pages/App/Document/Document/DocumentIndexFileCard'

interface DocumentIndexPageProps {
  document: App.Data.DocumentData
}

export const DocumentIndexFile: React.FC<DocumentIndexPageProps> = ({ document }) => {
  const { selectedDocuments, setSelectedDocuments } = useContext(DocumentIndexContext)
  const isSelected = selectedDocuments.includes(document.id as number)
  const [imageError, setImageError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imageRef = useRef<HTMLDivElement>(null)

  const { handleDownload: downloadFile } = useFileDownload({
    route: route('app.document.pdf', { id: document.id }),
    filename: document.filename || 'document.pdf'
  })

  useEffect(() => {
    if (!imageRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    )

    observer.observe(imageRef.current)

    return () => observer.disconnect()
  }, [])

  const handleDelete = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokument in den Papierkorb verschieben',
      message: `Möchtest Du ${document.filename} wirklich in den Papierkorb verschieben?`,
      buttonTitle: 'In den Papierkorb verschieben'
    })
    if (promise) {
      router.delete(route('app.document.trash', { id: document.id }))
    }
  }

  const handleTogglePinned = async () => {
    router.patch(
      route('app.document.toggle-pinned', { id: document.id }),
      {},
      {
        preserveState: false,
        preserveScroll: true
      }
    )
  }

  const handleRestore = async () => {
    router.put(
      route('app.document.restore', { document: document.id }),
      {},
      {
        preserveState: false,
        preserveScroll: true
      }
    )
  }

  const handleForceDelete = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokument endgültig löschen',
      message: `Möchtest Du das ${document.filename} endgültig löschen?`,
      buttonTitle: 'Löschen'
    })
    if (promise) {
      router.delete(route('app.document.force-delete', { id: document.id }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, document.id as number])
    } else {
      setSelectedDocuments(selectedDocuments.filter(id => id !== document.id))
    }
  }

  const handleDownload = () => {
    downloadFile()
  }

  return (
    <div className="relative flex h-64 w-full flex-col overflow-hidden rounded-md border bg-muted/40 shadow-sm hover:border-primary">
      <Link href={route('app.document.edit', { id: document.id })}>
        <button type="button" className="w-full border-0 bg-transparent p-0">
          <div ref={imageRef} className="relative h-28 w-full">
            {!isVisible || isLoading ? (
              <div className="flex h-28 w-full items-center justify-center bg-muted">
                <LogoSpinner />
              </div>
            ) : null}

            {isVisible && !imageError ? (
              <img
                key={document.id}
                src={route('app.document.preview', { id: document.id })}
                className="h-28 w-full cursor-pointer bg-background object-cover object-top p-1"
                style={{
                  objectPosition: '50% 0%',
                  display: isLoading ? 'none' : 'block'
                }}
                alt={document.filename}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setImageError(true)
                  setIsLoading(false)
                }}
              />
            ) : null}

            {isVisible && imageError ? (
              <div className="flex h-28 w-full items-center justify-center bg-muted">
                <div className="text-center">
                  <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center">
                    <Icon icon={AlertCircleIcon} className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-xs">Vorschau nicht verfügbar</p>
                </div>
              </div>
            ) : null}
          </div>
        </button>

        <div className="flex flex-none flex-col space-y-0 rounded-b-md p-4">
          <div className="truncate text-muted-foreground text-xs">{document.type?.name}</div>
          <div className="flex items-center gap-2 font-medium text-sm">
            <span className="flex-1 truncate">{document.title}</span>
            <HoverCard>
              <Pressable>
                <span className="rounded-full">
                  <Icon
                    icon={InformationCircleIcon}
                    className="rounded-full bg-primary text-white"
                  />
                </span>
              </Pressable>
              <HoverCardContent className="w-md">
                <DocumentIndexFileCard document={document} />
              </HoverCardContent>
            </HoverCard>
          </div>
          {document.is_inbound && document.sender_contact_id && (
            <div className="mt-1 truncate text-xs">{document.sender_contact?.full_name}</div>
          )}

          {!document.is_inbound && document.receiver_contact_id && (
            <div className="mt-1 truncate text-xs">{document.receiver_contact?.full_name}</div>
          )}

          <div className="mt-0.5 flex items-center gap-2 text-muted-foreground text-xs">
            <div className="flex-1">{document.issued_on}</div>
            <div className="text-right">{document.pages} S.</div>
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
              onClick={handleTogglePinned}
            />
          </div>
          <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
            {!document.deleted_at && (
              <>
                <MenuItem
                  icon={FileDownloadIcon}
                  title="Dokument herunterladen"
                  separator
                  onClick={handleDownload}
                />
                <MenuItem
                  icon={Edit03Icon}
                  title="Dokument bearbeiten"
                  href={route('app.document.edit', { document: document.id })}
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
                  separator
                  onClick={handleRestore}
                />
                <MenuItem
                  icon={Delete04Icon}
                  title="Dokument endgültig löschen"
                  variant="destructive"
                  onClick={handleForceDelete}
                />
              </>
            )}
          </DropdownButton>
        </div>
      </Link>
    </div>
  )
}
