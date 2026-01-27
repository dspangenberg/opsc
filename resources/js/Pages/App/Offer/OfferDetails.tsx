import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect } from 'react'
import { OfferDetailsAttachments } from '@/Pages/App/Offer/OfferDetailsAttachments'
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
          <h5>Angebotspositionen</h5>
          <OfferTable offer={offer} />
        </div>
      )}
    </div>
  )
}

const OfferDetails: React.FC<OfferDetailsProps> = ({ children }) => {
  const { offer } = usePage<OfferDetailsProps>().props

  return (
    <OfferDetailsLayout offer={offer}>
      <OfferDetailsContent>{children}</OfferDetailsContent>
      <div className="h-fit w-sm flex-none px-1">
        <div className="fixed space-y-6">
          <OfferDetailsSide offer={offer} />
          <OfferDetailsAttachments offer={offer} />
        </div>
      </div>
    </OfferDetailsLayout>
  )
}

export default OfferDetails
