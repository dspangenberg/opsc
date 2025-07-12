"use client"

import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components"

import { cn } from "@/Lib/utils"

const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}: AriaSeparatorProps) => (
  <AriaSeparator
    orientation={orientation}
    className={cn(
      "bg-border/80",
      /* Orientation */
      orientation === "horizontal" ? "h-px w-full" : "w-px",
      className
    )}
    {...props}
  />
)

export { Separator }
