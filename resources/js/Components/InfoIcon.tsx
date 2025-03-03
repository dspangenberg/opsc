/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { InformationCircleIcon } from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon } from '@hugeicons/react'
import type { FC, ReactNode } from 'react'

interface InfoIconProps {
  title?: string
  children: ReactNode
}

export const InfoIcon: FC<InfoIconProps> = ({ children, title }: InfoIconProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <HugeiconsIcon icon={InformationCircleIcon} stroke="1" className="size-[16px] text-primary cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="py-3">
          <div className="space-y-0">
            {title && <p className="text-sm font-medium leading-none">{title}</p>}
            <p className="text-sm p-0  hyphens-auto leading-relaxed">{children}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
