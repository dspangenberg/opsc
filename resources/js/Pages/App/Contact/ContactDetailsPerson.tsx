/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type * as React from 'react'
import type { FC } from 'react'
import { DataCard, DataCardContent, DataCardField, DataCardSection } from '@/Components/DataCard'
import { Edit02Icon } from '@hugeicons/core-free-icons'
import { ContactDetailsMail } from '@/Pages/App/Contact/ContactDetailsMails'

interface ContactDetailsPersonInfoBoxProps {
  contact: App.Data.ContactData
}

export const ContactDetailsPerson: FC<ContactDetailsPersonInfoBoxProps> = ({
  contact
}: ContactDetailsPersonInfoBoxProps) => {
  const onDebtorDataClicked = () => {
    console.log('Debtor data clicked')
  }

  return (
    <DataCard title={contact.full_name}>
      <DataCardContent>
        <DataCardSection>
          <DataCardField variant="vertical" label="Abteilung" value={contact.department} />
          <DataCardField variant="vertical" label="Position" value={contact.position} />
        </DataCardSection>
        <ContactDetailsMail mails={contact.mails || []} />
      </DataCardContent>
    </DataCard>
  )
}
