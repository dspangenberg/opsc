/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type * as React from 'react'
import { type FC, Fragment } from 'react'
import { DataCardField, DataCardFieldGroup } from '@/Components/DataCard'

interface Props {
  addresses: App.Data.ContactAddressData[]
}

export const ContactDetailsAddresses: FC<Props> = ({ addresses }: Props) => {
  const firstAddress = addresses.length ? addresses[0] : null

  return (
    <DataCardFieldGroup>
      {firstAddress && (
        <DataCardField variant="vertical" label={firstAddress.category?.name || 'Adresse'}>
          {firstAddress.full_address.map((line, index) => (
            <Fragment key={index}>
              {line}
              {index < firstAddress.full_address.length - 1 && <br />}
            </Fragment>
          ))}
        </DataCardField>
      )}
    </DataCardFieldGroup>
  )
}
