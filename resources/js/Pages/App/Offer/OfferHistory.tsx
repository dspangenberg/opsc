import type * as React from 'react'

import { HistoryView } from '@/Components/Shared/History/HistoryView'
import { OfferDetailsLayout } from '@/Pages/App/Offer/OfferDetailsLayout'
import type { PageProps } from '@/Types'
import { OfferDetailsSide } from './OfferDetailsSide'

interface OfferTermsProps extends PageProps {
  offer: App.Data.OfferData
}

const OfferHistory: React.FC<OfferTermsProps> = ({ offer }) => {
  return (
    <OfferDetailsLayout offer={offer}>
      <div className="mr-8 flex-1">
        <HistoryView
          entries={offer.notables ?? []}
          route={route('app.offer.store-note', { offer: offer.id })}
        />
      </div>
      <div className="h-fit w-full max-w-sm flex-none border-l! border-stone-200 px-1">
        <div className="fixed w-full max-w-sm space-y-6">
          <OfferDetailsSide offer={offer} />
        </div>
      </div>
    </OfferDetailsLayout>
  )
}

export default OfferHistory
