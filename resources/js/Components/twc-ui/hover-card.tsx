'use client'

import * as React from 'react'
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipTriggerComponentProps
} from 'react-aria-components'

import { cn } from '@/Lib/utils'

const HoverCard = ({ delay = 0, closeDelay = 0, ...props }: TooltipTriggerComponentProps) => (
  <AriaTooltipTrigger data-slot="hover-card" delay={delay} closeDelay={closeDelay} {...props} />
)

interface HoverCardContentProps extends AriaTooltipProps {
  className?: string
}

const HoverCardContent = ({ className, offset = 4, ...props }: HoverCardContentProps) => (
  <AriaTooltip
    data-slot="hover-card-content"
    offset={offset}
    className={cn(
      'exiting:fade-out-0 entering:fade-in-0 exiting:zoom-out-95 entering:zoom-in-95 placement-bottom:slide-in-from-top-2 placement-left:slide-in-from-right-2 placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 z-50 w-64 entering:animate-in exiting:animate-out rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden',
      className
    )}
    {...props}
  />
)

export { HoverCard, HoverCardContent }
