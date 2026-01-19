import { Add01Icon, Cancel01Icon, DragDropHorizontalIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { debounce } from 'lodash'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { useDragAndDrop, useListData } from 'react-aria-components'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { BorderedBox } from '@/Components/twc-ui/bordered-box'
import { Button } from '@/Components/twc-ui/button'
import { GridList, GridListItem } from '@/Components/twc-ui/grid-list'
import { Icon } from '@/Components/twc-ui/icon'
import { PdfViewer } from '@/Components/twc-ui/pdf-viewer'
import { DocumentSelector } from '@/Pages/App/Document/Document/DocumentSelector'

interface OfferDetailsAttachmentsProps {
  offer: App.Data.OfferData
}

export const OfferDetailsAttachments: FC<OfferDetailsAttachmentsProps> = ({
  offer
}: OfferDetailsAttachmentsProps) => {
  const handleFileShow = async (id: number | null) => {
    const attachment = offer.attachments?.find(attachment => attachment.id === id)
    if (attachment) {
      await PdfViewer.call({
        file: route('app.documents.documents.pdf', { id: attachment.document.id }),
        filename: attachment.document.filename
      })
    }
  }

  const list = useListData({
    initialItems: offer.attachments ?? []
  })

  const listItemsRef = useRef(list.items)
  listItemsRef.current = list.items

  const debouncedSaveRef = useRef<ReturnType<typeof debounce> | null>(null)

  useEffect(() => {
    debouncedSaveRef.current = debounce(() => {
      const attachmentIds = listItemsRef.current.map(item => item.id)
      router.put(route('app.offer.sort-attachments', { offer: offer.id }), {
        attachment_ids: attachmentIds
      })
    }, 500)

    return () => {
      debouncedSaveRef.current?.cancel()
    }
  }, [offer.id])

  useEffect(() => {
    list.setSelectedKeys(new Set())
    list.items.forEach(item => {
      list.remove(item.id as number)
    })
    offer.attachments?.forEach(attachment => {
      list.append(attachment)
    })
  }, [offer.attachments])

  const handleRemove = async (item: App.Data.AttachmentData) => {
    if (!item) return
    const promise = await AlertDialog.call({
      title: 'Anlage entfernen',
      message: `Möchtest Du ${item.document.filename} wirklich als Anlage entfernen?`,
      buttonTitle: 'Anlage entfernen'
    })
    if (promise) {
      router.delete(
        route('app.offer.remove-attachment', { offer: offer.id, attachment: item.id }),
        { onSuccess: () => router.reload({ only: ['offer'] }) }
      )
    }
  }

  const handleAddDocuments = async () => {
    const result = await DocumentSelector.call()
    if (result !== false && Array.isArray(result)) {
      router.put(
        route('app.offer.add-attachments', { offer: offer.id }),
        { document_ids: result },
        {
          onSuccess: () => {
            router.reload({ only: ['offer'] })
          }
        }
      )
    }
  }

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (_keys, items: typeof list.items) =>
      items.map(item => ({ 'text/plain': item.document.title })),
    onReorder(e) {
      if (e.target.dropPosition === 'before') {
        list.moveBefore(e.target.key, e.keys)
      } else if (e.target.dropPosition === 'after') {
        list.moveAfter(e.target.key, e.keys)
      }
      debouncedSaveRef.current?.()
    }
  })

  return (
    <BorderedBox>
      <div className="p-2 text-sm">
        <div className="flex items-center px-2 pb-1">
          <div className="flex-1 font-medium">Anhänge</div>
          <div>
            <Button
              variant="ghost"
              size="icon-sm"
              icon={Add01Icon}
              isDisabled={!offer.is_draft}
              onClick={handleAddDocuments}
            />
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col space-y-2 overflow-hidden rounded-md border border-border/50 bg-background px-2.5 pt-1.5">
          <GridList
            aria-label="Attachments"
            items={list.items}
            selectionMode="none"
            className="min-w-0 divide-y overflow-visible border-0 p-0"
            dragAndDropHooks={dragAndDropHooks}
            renderEmptyState={() => (
              <p className="pt-2 text-muted-foreground text-sm">Keine Anlagen vorhanden</p>
            )}
          >
            {(item: App.Data.AttachmentData) => (
              <GridListItem
                textValue={item.document.title}
                className="gap-1 rounded-none border-0 px-0! py-1 opacity-100"
                onDoubleClick={() => handleFileShow(item.id)}
                isDisabled={!offer.is_draft}
              >
                <span className="max-w-67.5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.document.title}
                </span>
                <Button
                  variant="ghost-destructive"
                  size="icon-sm"
                  icon={Cancel01Icon}
                  isDisabled={!offer.is_draft}
                  onPress={() => handleRemove(item)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  slot="drag"
                  isDisabled={!offer.is_draft}
                >
                  <Icon icon={DragDropHorizontalIcon} className="rotate-90" />
                </Button>
              </GridListItem>
            )}
          </GridList>
        </div>
      </div>
    </BorderedBox>
  )
}
