import * as React from 'react'
import {
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
  composeRenderProps
} from 'react-aria-components'

import { cn } from '@/Lib/utils'

const PopoverTrigger = AriaDialogTrigger

const Popover = ({ className, offset = 4, ...props }: AriaPopoverProps) => (
  <AriaPopover
    offset={offset}
    className={composeRenderProps(className, className =>
      cn(
        'z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none',
        /* Entering */
        'entering:fade-in-0 entering:zoom-in-95 entering:animate-in',
        /* Exiting */
        'exiting:fade-out-0 exiting:zoom-out-95 exiting:animate-out',
        /* Placement */
        'placement-bottom:slide-in-from-top-2 placement-left:slide-in-from-right-2 placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2',
        className
      )
    )}
    {...props}
  />
)

function PopoverDialog({ className, ...props }: AriaDialogProps) {
  return <AriaDialog className={cn('p-4 outline-0', className)} {...props} />
}

export { Popover, PopoverTrigger, PopoverDialog }
