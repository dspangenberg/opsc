import { Link } from '@inertiajs/react'
import { type FC, useMemo } from 'react'
import {
  DataCard,
  DataCardContent,
  DataCardField,
  DataCardHeader,
  DataCardSection
} from '@/Components/DataCard'
import { StatsField } from '@/Components/StatsField'
import { cn } from '@/Lib/utils'

interface ContactDetailsOrgInfoBoxProps {
  offer: App.Data.OfferData
  showSecondary?: boolean
}

export const OfferDetailsSide: FC<ContactDetailsOrgInfoBoxProps> = ({
  offer
}: ContactDetailsOrgInfoBoxProps) => {
  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  const contactRoute = useMemo(
    () => route('app.contact.details', { id: offer.contact_id }),
    [offer.contact_id]
  )

  const title = `AG-${offer.formated_offer_number}`

  return (
    <DataCard title={title}>
      <DataCardHeader
        className={cn(
          'grid grid-cols-3 divide-x divide-border/50 rounded-md border border-border/50 border-b bg-background p-1.5'
        )}
      >
        <StatsField label="netto" value={currencyFormatter.format(offer.amount_net)} />
        <StatsField label="USt." value={currencyFormatter.format(offer.amount_tax)} />
        <StatsField label="brutto" value={currencyFormatter.format(offer.amount_gross)} />
      </DataCardHeader>
      <DataCardContent>
        <DataCardSection
          className={cn('grid space-y-0', offer.is_draft ? 'grid-cols-2' : 'grid-cols-3')}
          title="Angbotsdetails"
        >
          <DataCardField variant="vertical" label="Datum" value={offer.issued_on} />
          <DataCardField variant="vertical" label="gültig bis" value={offer.valid_until} />
          {!offer.is_draft && (
            <DataCardField
              variant="vertical"
              label="versendet"
              value={offer.sent_at?.substring(0, 10)}
            />
          )}
        </DataCardSection>
        <DataCardSection className="grid grid-cols-2">
          <DataCardField variant="vertical" label="Umsatzsteuer" value={offer.tax?.name} />
        </DataCardSection>
        <DataCardSection>
          <DataCardField
            className="col-span-2"
            variant="vertical"
            label="Kunde"
            value={offer.contact_id}
          >
            <Link href={contactRoute} className="hover:underline">
              {offer.contact?.formated_debtor_number} &ndash; {offer.contact?.full_name}
            </Link>
          </DataCardField>
          <DataCardField
            className="col-span-2"
            variant="vertical"
            label="Projekt"
            value={offer.project?.name}
          />
          <DataCardField
            className="col-span-2"
            variant="vertical"
            label="Vorlage"
            value={offer.template_name}
          />
        </DataCardSection>
      </DataCardContent>
    </DataCard>
  )
}
