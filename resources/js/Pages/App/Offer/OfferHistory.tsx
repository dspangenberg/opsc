import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect } from 'react'
import { OfferDetailsLayout } from '@/Pages/App/Offer/OfferDetailsLayout'
import type { PageProps } from '@/Types'
import { OfferDetailsSide } from './OfferDetailsSide'
import { OfferLinesEditor } from './OfferLinesEditor'
import { OfferTable } from './OfferTable'
import { useOfferTable } from './OfferTableProvider'

interface OfferTermsProps extends PageProps {
  offer: App.Data.OfferData
  children?: React.ReactNode
}

const OfferTermsContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { offer } = usePage<OfferTermsProps>().props

  return (
    <div className="flex-1 flex-col">
      {children}
      Hey
    </div>
  )
}

const OfferTerms: React.FC<OfferTermsProps> = ({ children }) => {
  const { offer } = usePage<OfferTermsProps>().props

  return (
    <OfferDetailsLayout offer={offer}>
      <OfferTermsContent>{children}</OfferTermsContent>
      <div className="h-fit w-sm flex-none space-y-6 px-1">
        <OfferDetailsSide offer={offer} />
      </div>
    </OfferDetailsLayout>
  )
}

export default OfferTerms
