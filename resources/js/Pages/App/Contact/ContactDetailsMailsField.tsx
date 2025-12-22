/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Copy02Icon } from '@hugeicons/core-free-icons'
import { Check } from 'lucide-react'
import type * as React from 'react'
import { type FC, useState } from 'react'
import { Focusable } from 'react-aria-components'
import { DataCardField } from '@/Components/DataCard'
import { Button } from '@/Components/twc-ui/button'
import { Tooltip, TooltipTrigger } from '@/Components/twc-ui/tooltip'
import { cn } from '@/Lib/utils'

interface Props {
  mail: App.Data.ContactMailData
}

export const ContactDetailsMailField: FC<Props> = ({ mail }: Props) => {
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(mail.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <DataCardField variant="vertical" label={mail.category?.name || 'E-Mail'} value={mail.email}>
      <div className="group/mail flex items-center gap-0.5">
        <a
          href={`mailto:${mail.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {mail.email}
        </a>

        <TooltipTrigger>
          <Focusable>
            <div className="flex items-center">
              <Button
                onClick={handleCopy}
                variant="ghost"
                aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                className="opacity-0 group-hover/mail:opacity-100"
                size="icon-xs"
                icon={Copy02Icon}
                disabled={copied}
              />
              <div
                className={cn(
                  'transition-all',
                  copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                )}
              >
                <Check
                  className="stroke-emerald-500"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>
            </div>
          </Focusable>
          <Tooltip>In Zwischenablage kopieren</Tooltip>
        </TooltipTrigger>
      </div>
    </DataCardField>
  )
}
