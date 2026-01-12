import { FileRemoveIcon } from '@hugeicons/core-free-icons'
import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect } from 'react'
import { useDragAndDrop, useListData } from 'react-aria-components'
import { Button } from '@/Components/twc-ui/button'
import { GridList, GridListItem } from '@/Components/twc-ui/grid-list'
import { ListBox, ListBoxItem } from '@/Components/twc-ui/list-box'
import { PdfViewer } from '@/Components/twc-ui/pdf-viewer'
import { OfferDetailsLayout } from '@/Pages/App/Offer/OfferDetailsLayout'
import type { PageProps } from '@/Types'
import { OfferDetailsSide } from './OfferDetailsSide'
import { OfferLinesEditor } from './OfferLinesEditor'
import { OfferTable } from './OfferTable'
import { useOfferTable } from './OfferTableProvider'

interface OfferDetailsProps extends PageProps {
  offer: App.Data.OfferData
  children?: React.ReactNode
}

const OfferDetailsContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { offer } = usePage<OfferDetailsProps>().props

  const { setLines, setOffer, editMode } = useOfferTable()

  useEffect(() => setLines(offer.lines || []), [offer.lines, setLines])
  useEffect(() => setOffer(offer || []), [offer, setOffer])

  return (
    <div className="flex-1 flex-col">
      {children}
      {editMode ? (
        <OfferLinesEditor offer={offer} />
      ) : (
        <div className="space-y-4">
          <h5>Angebotspositonen</h5>
          <OfferTable offer={offer} />
        </div>
      )}
    </div>
  )
}

const OfferDetails: React.FC<OfferDetailsProps> = ({ children }) => {
  const { offer } = usePage<OfferDetailsProps>().props

  const handleClick = async (id: number | null) => {
    const attachment = offer.attachments?.find(attachment => attachment.id === id)
    if (attachment) {
      await PdfViewer.call({
        file: route('app.documents.documents.pdf', { id: attachment.document.id }),
        filename: attachment.document.filename
      })
    }
  }

  return (
    <OfferDetailsLayout offer={offer}>
      <OfferDetailsContent>{children}</OfferDetailsContent>
      <div className="h-fit w-sm flex-none space-y-6 px-1">
        <OfferDetailsSide offer={offer} />
        <GridList aria-label="Attachments" items={offer.attachments ?? []} selectionMode="none">
          {(item: App.Data.AttachmentData) => (
            <GridListItem
              textValue={item.document.title}
              onDoubleClick={() => handleClick(item.id)}
            >
              <div>{item.document.title}</div>
              <Button variant="ghost" size="icon-sm" icon={FileRemoveIcon} className="ml-auto" />
            </GridListItem>
          )}
        </GridList>
      </div>
    </OfferDetailsLayout>
  )
}

export default OfferDetails
