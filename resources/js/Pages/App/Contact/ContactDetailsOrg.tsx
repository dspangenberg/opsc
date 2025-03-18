/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type * as React from 'react'
import type { FC } from 'react'
import { DataCard, DataCardContent, DataCardField, DataCardSection } from '@/Components/DataCard'
import { Add01Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import { ContactDetailsMail } from '@/Pages/App/Contact/ContactDetailsMails'
import { ContactDetailsAddresses } from '@/Pages/App/Contact/ContactDetailsAddresses'

interface ContactDetailsOrgInfoBoxProps {
  contact: App.Data.ContactData
  showSecondary?: boolean
}

export const ContactDetailsOrg: FC<ContactDetailsOrgInfoBoxProps> = ({
  contact,
  showSecondary
}: ContactDetailsOrgInfoBoxProps) => {
  const onDebtorDataClicked = () => {
    console.log('Debtor data clicked')
  }

  return (
    <DataCard title={contact.full_name}>
      <DataCardContent showSecondary={showSecondary}>
        <DataCardSection title="Debitorinfos" icon={Edit02Icon} onClick={onDebtorDataClicked}>
          <DataCardField
            variant="vertical"
            label="Kunden- und Debitornr."
            value={contact.debtor_number}
          />
          <DataCardField
            variant="vertical"
            label="Zahlungsziel"
            value={contact.payment_deadline?.name}
          />
        </DataCardSection>
        <DataCardSection
          secondary
          className="grid grid-cols-2"
          title="Kreditorinfos"
          icon={Edit02Icon}
          onClick={onDebtorDataClicked}
        >
          <DataCardField variant="vertical" label="Kreditornr." value={contact.creditor_number} />
        </DataCardSection>
        <ContactDetailsMail mails={contact.mails || []} />
        <DataCardSection
          secondary
          title="Anschriften"
          icon={Add01Icon}
          forceChildren={false}
          emptyText="Keine Anschriften vorhanden"
        >
          <ContactDetailsAddresses addresses={contact.addresses || []} />
        </DataCardSection>
        <DataCardSection title="Register- und Steuerdaten" icon={Edit02Icon} secondary>
          <DataCardField variant="vertical" label="Register" value={contact.register_number}>
            {contact.register_court} ({contact.register_number})
          </DataCardField>
          <div className="grid grid-cols-2 gap-2">
            <DataCardField variant="vertical" label="Umsatzsteuer-ID" value={contact.vat_id} />
            <DataCardField variant="vertical" label="Steuernummer" value={contact.tax_number} />
          </div>
        </DataCardSection>
      </DataCardContent>
    </DataCard>
  )
}
