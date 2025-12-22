/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { InformationCircleIcon } from '@hugeicons/core-free-icons'
import type { FC, ReactNode } from 'react'
import { Focusable } from 'react-aria-components'
import { Icon } from '@/Components/twc-ui/icon'
import { Tooltip, TooltipTrigger } from '@/Components/twc-ui/tooltip'

interface InfoIconProps {
  title?: string
  children: ReactNode
}

export const InfoIcon: FC<InfoIconProps> = ({ children, title }: InfoIconProps) => {
  return (
    <TooltipTrigger>
      <Focusable>
        <Icon icon={InformationCircleIcon} stroke="1" className="size-4 cursor-help text-primary" />
      </Focusable>
      <Tooltip className="py-3">
        <div className="space-y-0">
          {title && <p className="font-medium text-sm leading-none">{title}</p>}
          <p className="hyphens-auto p-0 text-sm leading-relaxed">{children}</p>
        </div>
      </Tooltip>
    </TooltipTrigger>
  )
}
