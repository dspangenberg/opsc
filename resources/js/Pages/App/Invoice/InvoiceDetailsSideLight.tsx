import { Link } from '@inertiajs/react'
import { type FC, useMemo } from 'react'
import { ArrayTextField } from '@/Components/ArrayTextField'

import {
  DataCard,
  DataCardContent,
  DataCardField,
  DataCardFieldGroup,
  DataCardHeader,
  DataCardSection,
  DataCardSectionHeader
} from '@/Components/DataCard'
import { StatsField } from '@/Components/StatsField'
import { cn } from '@/Lib/utils'

interface InvoiceDetailsSideProps {
  invoice: App.Data.InvoiceData
  showSecondary?: boolean
}

export const InvoiceDetailsSideLight: FC<InvoiceDetailsSideProps> = ({
  invoice
}: InvoiceDetailsSideProps) => {
  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  const contactRoute = useMemo(
    () => route('app.contact.details', { id: invoice.contact_id }),
    [invoice.contact_id]
  )

  const offerRoute = useMemo(() => {
    if (!invoice.offer_id) return '#'
    return route('app.offer.details', { offer: invoice.offer_id })
  }, [invoice.offer_id])

  const parentInvoiceRoute = useMemo(() => {
    if (!invoice.parent_id) return '#'
    return route('app.invoice.details', { invoice: invoice.parent_id })
  }, [invoice.parent_id])

  const title = `RG-${invoice.formated_invoice_number}`

  return (
    <DataCard title={title}>
      <DataCardContent>
        <DataCardSection
          className={cn(
            'grid border py-2 pb-0 tabular-nums',
            invoice.is_draft ? 'grid-cols-3' : 'grid-cols-4'
          )}
        >
          <StatsField label="netto" value={currencyFormatter.format(invoice.amount_net)} />
          <StatsField label="USt." value={currencyFormatter.format(invoice.amount_tax)} />
          <StatsField label="brutto" value={currencyFormatter.format(invoice.amount_gross)} />
          {!invoice.is_draft && (
            <StatsField label="offen" value={currencyFormatter.format(invoice.amount_open || 0)} />
          )}
        </DataCardSection>
        <DataCardSection title="Details">
          <DataCardFieldGroup className="grid grid-cols-6">
            <DataCardField
              className="col-span-2"
              variant="vertical"
              label="Datum"
              value={invoice.issued_on}
            />
            <DataCardField
              className="col-span-3"
              variant="vertical"
              label="Fälligkeit"
              value={invoice.due_on}
            >
              {invoice.due_on}{' '}
              {invoice.dunning_days > 0 && (
                <span className="text-destructive">+{invoice.dunning_days}</span>
              )}
            </DataCardField>
            <DataCardField variant="vertical" label="MS" value={invoice.dunning_level} />
          </DataCardFieldGroup>
          <DataCardFieldGroup className="grid grid-cols-3">
            <DataCardField
              variant="vertical"
              label="Rechnungstyp"
              value={invoice.type?.abbreviation}
            />
            <DataCardField
              className="col-span-2"
              variant="vertical"
              label="Leistungsdatum"
              empty="ohne"
              value={invoice.service_provision || invoice.service_period_begin}
            >
              {invoice.service_period_begin ? (
                <>
                  {invoice.service_period_begin} &ndash; {invoice.service_period_end}
                </>
              ) : (
                invoice.service_provision
              )}
            </DataCardField>
          </DataCardFieldGroup>
        </DataCardSection>
        <DataCardSection title="Rechnungsempfänger">
          <DataCardField
            variant="vertical"
            label="Debitor"
            value={invoice.contact?.full_name}
            className="col-span-2 truncate"
          >
            <Link href={contactRoute} className="hover:underline">
              {invoice.contact?.formated_debtor_number} &ndash; {invoice.contact?.full_name}
            </Link>
          </DataCardField>

          <DataCardFieldGroup className="grid grid-cols-2">
            <DataCardField variant="vertical" label="Umsatzsteuer" value={invoice.tax?.name} />
            <DataCardField variant="vertical" label="Umsatzsteuer-ID" value={invoice.vat_id} />
          </DataCardFieldGroup>
          <DataCardField
            variant="vertical"
            label="Rechnungsanschrift"
            value={invoice.invoice_address as unknown as string[]}
          >
            <ArrayTextField lines={invoice.invoice_address} />
          </DataCardField>
          <DataCardField variant="vertical" label="Zusatztext" value={invoice.additional_text} />
        </DataCardSection>

        <DataCardSection title="Verknüpfungen">
          <DataCardField
            variant="vertical"
            label="Übergeordnete Rechnung"
            value={invoice.parent_id}
          >
            <Link href={parentInvoiceRoute} className="hover:underline">
              {invoice.parent_invoice?.formated_invoice_number}
            </Link>
          </DataCardField>
          <DataCardField
            className="col-span-2"
            variant="vertical"
            label="Projekt"
            value={invoice.project?.name}
          />
          <DataCardField
            className="col-span-2"
            variant="vertical"
            label="Angebot"
            value={invoice.offer?.formated_offer_number}
          >
            <Link href={offerRoute} className="hover:underline">
              AG-{invoice.offer?.formated_offer_number} vom {invoice.offer?.issued_on}
            </Link>
          </DataCardField>
        </DataCardSection>
      </DataCardContent>
    </DataCard>
  )
}
