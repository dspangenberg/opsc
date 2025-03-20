/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type * as React from 'react'
import { type FC, useMemo } from 'react'
import {
  DataCard,
  DataCardContent,
  DataCardField,
  DataCardHeader,
  DataCardSection
} from '@/Components/DataCard'
import { ArrayTextField } from '@/Components/ArrayTextField'
import { StatsField } from '@/Components/StatsField'
import { Link } from '@inertiajs/react'

interface ContactDetailsOrgInfoBoxProps {
  invoice: App.Data.InvoiceData
  showSecondary?: boolean
}

export const InvoiceDetailsSide: FC<ContactDetailsOrgInfoBoxProps> = ({
  invoice,
  showSecondary
}: ContactDetailsOrgInfoBoxProps) => {
  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 2
  })

  const contactRoute = useMemo(
    () => route('app.contact.details', { id: invoice.contact_id }),
    [invoice.contact_id]
  )

  return (
    <DataCard>
      <DataCardHeader className="grid grid-cols-4 divide-x">
        <StatsField label="netto" value={currencyFormatter.format(invoice.amount_net)} />
        <StatsField label="USt." value={currencyFormatter.format(invoice.amount_tax)} />
        <StatsField label="brutto" value={currencyFormatter.format(invoice.amount_gross)} />
        <StatsField label="offen" value={currencyFormatter.format(0)} />
      </DataCardHeader>
      <DataCardContent showSecondary={showSecondary}>
        <DataCardSection>
          <DataCardField
            variant="horizontal-right"
            label="Rechnungsnummer"
            value={invoice.formated_invoice_number}
          />
          <DataCardField
            variant="horizontal-right"
            label="Rechnungstyp"
            value={invoice.type?.display_name}
          />
          <DataCardField
            variant="horizontal-right"
            label="Rechnungsdatum"
            value={invoice.issued_on}
          />
          <DataCardField
            variant="horizontal-right"
            label="Fälligkeitsdatum"
            value={invoice.due_on}
          />
        </DataCardSection>

        <DataCardSection suppressEmptyText={true}>
          <DataCardField
            variant="vertical"
            label="Leistungsdatum"
            value={invoice.service_provision || invoice.service_period_begin}
          >
            {invoice.service_provision ? (
              invoice.service_provision
            ) : (
              <>
                {invoice.service_period_begin} &mdash; {invoice.service_period_end}
              </>
            )}
          </DataCardField>
        </DataCardSection>
        <DataCardSection>
          <DataCardField variant="vertical" label="Projekt:" value={invoice.project?.name} />
        </DataCardSection>
        <DataCardSection className="grid grid-cols-2">
          <DataCardField
            variant="vertical"
            label="Debitor"
            value={invoice.contact?.full_name}
            className="col-span-2"
          >
            <Link href={contactRoute} className="hover:underline">
              {invoice.contact?.full_name}
            </Link>
          </DataCardField>
          <DataCardField
            variant="vertical"
            label="Debitornr."
            value={invoice.contact?.debtor_number}
          />
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
