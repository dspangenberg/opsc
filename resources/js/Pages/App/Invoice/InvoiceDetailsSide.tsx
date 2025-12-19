import { Link } from '@inertiajs/react'
import { type FC, useMemo } from 'react'
import { ArrayTextField } from '@/Components/ArrayTextField'
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
  invoice: App.Data.InvoiceData
  showSecondary?: boolean
}

export const InvoiceDetailsSide: FC<ContactDetailsOrgInfoBoxProps> = ({
  invoice
}: ContactDetailsOrgInfoBoxProps) => {
  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  const contactRoute = useMemo(
    () => route('app.contact.details', { id: invoice.contact_id }),
    [invoice.contact_id]
  )

  const title = `RG-${invoice.formated_invoice_number}`

  return (
    <DataCard title={title}>
      <DataCardHeader
        className={cn(
          'grid divide-x divide-border/50 rounded-md border border-border/50 border-b bg-background p-1.5',
          invoice.is_draft ? 'grid-cols-3' : 'grid-cols-4'
        )}
      >
        <StatsField label="netto" value={currencyFormatter.format(invoice.amount_net)} />
        <StatsField label="USt." value={currencyFormatter.format(invoice.amount_tax)} />
        <StatsField label="brutto" value={currencyFormatter.format(invoice.amount_gross)} />
        {!invoice.is_draft && (
          <StatsField label="offen" value={currencyFormatter.format(invoice.amount_open || 0)} />
        )}
      </DataCardHeader>
      <DataCardContent>
        <DataCardSection
          className={cn('grid space-y-0', invoice.is_draft ? 'grid-cols-2' : 'grid-cols-3')}
          title="Rechnungsdetails"
        >
          <DataCardField variant="vertical" label="Datum" value={invoice.issued_on} />
          <DataCardField variant="vertical" label="Fälligkeit" value={invoice.due_on} />
          {!invoice.is_draft && (
            <DataCardField
              variant="vertical"
              label="versendet"
              value={invoice.sent_at?.substring(0, 10)}
            />
          )}
        </DataCardSection>
        <DataCardSection className="grid grid-cols-2">
          <DataCardField
            variant="vertical"
            label="Rechnungstyp"
            value={invoice.type?.display_name}
          />
          <DataCardField variant="vertical" label="Umsatzsteuer" value={invoice.tax?.name} />
        </DataCardSection>
        <DataCardSection>
          <DataCardField
            className="col-span-2"
            variant="vertical"
            label="Leistungsdatum"
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

          <DataCardField
            className="col-span-2"
            variant="vertical"
            label="Projekt"
            value={invoice.project?.name}
          />
        </DataCardSection>

        <DataCardSection title="Rechnungsempfänger">
          <DataCardField
            variant="vertical"
            label="Debitor"
            value={invoice.contact?.full_name}
            className="col-span-3"
          >
            <Link href={contactRoute} className="hover:underline">
              {invoice.contact?.formated_debtor_number} &ndash; {invoice.contact?.full_name}
            </Link>
          </DataCardField>
          <DataCardField variant="vertical" label="Umsatzsteuer-ID" value={invoice.vat_id} />
        </DataCardSection>
        <DataCardSection>
          <DataCardField
            variant="vertical"
            label="Rechnungsanschrift"
            value={invoice.invoice_address as unknown as string[]}
          >
            <ArrayTextField lines={invoice.invoice_address} />
          </DataCardField>
        </DataCardSection>
      </DataCardContent>
    </DataCard>
  )
}
