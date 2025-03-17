/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type * as React from 'react'
import { type FC, useState } from 'react'
import { DataCardField } from '@/Components/DataCard'
import { Copy01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@dspangenberg/twcui'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { cn } from '@/Lib/utils'
import { Check, Copy } from 'lucide-react'
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
      <div className="flex items-center gap-0.5 group/mail">
        <a
          href={`mailto:${mail.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {mail.email}
        </a>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                  className="opacity-0 group-hover/mail:opacity-100"
                  size="icon-xs"
                  icon={Copy01Icon}
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
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              In Zwischenablage kopieren
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </DataCardField>
  )
}
