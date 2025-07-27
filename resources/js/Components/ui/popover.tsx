import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/Lib/utils"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * PopoverContent component with portal prop to control whether the content is rendered inside a Portal.
 * When using a popover inside a dialog, set portal=false to render the popover content directly in the DOM hierarchy of the dialog.
 * This solves the issue where popovers don't work in dialogs due to portal stacking issues.
 */
function PopoverContent({
  className,
  align = "center",
  portal = true,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & { portal?: boolean }) {
  const Content = (
    <PopoverPrimitive.Content
      data-slot="popover-content"
      align={align}
      aria-modal={true}
      sideOffset={sideOffset}
      className={cn(
        "bg-popover pointer-events-auto text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        portal ? "z-50" : "z-[60]",
        className
      )}
      {...props}
    />
  )

  if (portal) {
    return <PopoverPrimitive.Portal>{Content}</PopoverPrimitive.Portal>
  }

  return Content
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
