/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Button } from '@dspangenberg/twcui'
import { Copy02Icon } from '@hugeicons/core-free-icons'
import { Check } from 'lucide-react'
import type * as React from 'react'
import { type FC, useState } from 'react'
import { DataCardField } from '@/Components/DataCard'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { cn } from '@/Lib/utils'

interface Props {
  phone: App.Data.ContactPhoneData
}

export const ContactDetailsPhoneField: FC<Props> = ({ phone }: Props) => {
  const [copied, setCopied] = useState<boolean>(false)

  return (
    <DataCardField variant="vertical" label={phone.category?.name || 'E-Mail'} value={phone.phone}>
      <div className="group/mail flex items-center gap-0.5">
        <a
          href={`phone:${phone.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {phone.phone}
        </a>
      </div>
    </DataCardField>
  )
}
