"use client"

import { cva, type VariantProps } from "class-variance-authority"
import {
  FieldError as AriaFieldError,
  type FieldErrorProps as AriaFieldErrorProps,
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  Text as AriaText,
  type TextProps as AriaTextProps,
  composeRenderProps,
} from "react-aria-components"

import { cn } from "@/Lib/utils"

const labelVariants = cva([
  "text-base font-normal leading-none",
  /* Disabled */
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
  /* Invalid */
  "group-data-[invalid]:text-destructive",
])

const Label = ({ className, ...props }: AriaLabelProps) => (
  <AriaLabel className={cn(labelVariants(), className)} {...props} />
)

function FormDescription({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
      slot="description"
    />
  )
}

function FieldError({ className, ...props }: AriaFieldErrorProps) {
  return (
    <AriaFieldError
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    />
  )
}
//  className="group-focus:border-ring group-focus:ring-ring/20 group-focus::ring-[3px]
const fieldGroupVariants = cva("", {
  variants: {
    variant: {
      default: [
        "relative flex h-9 w-full items-center overflow-hidden rounded-sm border border-input bg-transparent px-3 py-1 text-base font-medium shadow-none transition-colors",
        /* Focus Within */
        "data-[focus-within]:border-ring data-[focus-within]:ring-ring/20 data-[focus-within]:ring-[3px] ",
        "data-[invalid]:focus-within:ring-destructive/20  data-[invalid]:focus-within:border-destructive  data-[invalid]:border-destructive",
        /* Disabled */
        "data-[disabled]:opacity-50",
      ],
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface GroupProps
  extends AriaGroupProps,
    VariantProps<typeof fieldGroupVariants> {}

function FieldGroup({ className, variant, ...props }: GroupProps) {
  return (
    <AriaGroup
      className={composeRenderProps(className, (className) =>
        cn(fieldGroupVariants({ variant }), className)
      )}
      {...props}
    />
  )
}

export {
  Label,
  labelVariants,
  FieldGroup,
  fieldGroupVariants,
  FieldError,
  FormDescription,
}
