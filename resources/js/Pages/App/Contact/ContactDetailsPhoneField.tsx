/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type * as React from 'react'
import { type FC, useState } from 'react'
import { DataCardField } from '@/Components/DataCard'

interface Props {
  phone: App.Data.ContactPhoneData
}

export const ContactDetailsPhoneField: FC<Props> = ({ phone }: Props) => {
  const [copied, setCopied] = useState<boolean>(false)

  return (
    <DataCardField variant="vertical" label={phone.category?.name || 'E-Mail'} value={phone.phone}>
      <div className="group/mail flex items-center gap-0.5">
        <a href={`tel:${phone.phone}`} rel="noopener noreferrer" className="hover:underline">
          {phone.phone}
        </a>
      </div>
    </DataCardField>
  )
}
