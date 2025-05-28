import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components"
import { cn } from "@/Lib/utils"
import { HugeiconsIcon } from '@hugeicons/react'
import { LoaderCircleIcon } from 'lucide-react'

export type IconSvgElement = readonly (readonly [
  string,
  {
    readonly [key: string]: string | number
  }
])[]

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors active:border-ring",
    /* Disabled */
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ",
    /* Focus Visible */
    'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
    'active:ring-[3px]',
    /* Resets */
    "focus-visible:outline-none",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow data-[hovered]:bg-primary/90 active:ring-ring/20 ",
        destructive:
          "bg-destructive text-destructive-foreground text-white shadow-sm data-[hovered]:bg-destructive/90 active:ring-destructive/50",
        outline:
          "border border-input bg-background shadow-sm  data-[hovered]:bg-accent data-[hovered]:text-accent-foreground focus-visible:ring-ring/20 active:ring-ring/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm data-[hovered]:bg-secondary/80",
        ghost: "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground active:ring-ring/20",
        link: "text-primary underline-offset-4 data-[hovered]:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: 'size-9',
        'icon-xs': 'size-6',
        'icon-sm': 'size-7'
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BaseButtonProps
  extends AriaButtonProps,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: IconSvgElement
  iconClassName?: string
  title?: string
}

export const BaseButton = ({ className, variant, size, form, type = 'button', loading, icon, iconClassName, children, title = '', ...props }: BaseButtonProps) => {
  const iconSizeClass =
    {
      default: 'size-5',
      sm: 'size-5',
      lg: 'size-5',
      icon: 'size-5',
      'icon-sm': 'size-4',
      'icon-xs': 'size-3'
    }[size || 'default']

  return (
    <AriaButton
      form={form}
      type={type}
      className={composeRenderProps(className, (className) =>
        cn(
          buttonVariants({
            variant,
            size,
            className,
          })
        )
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {!loading && icon && (
            <HugeiconsIcon icon={icon} className={cn(iconSizeClass, iconClassName)} />
          )}
          {loading && <LoaderCircleIcon className="animate-spin mr-2" size={16} aria-hidden="true" />}
          {title || children}
        </>
      ))}
    </AriaButton>
  )
}

export { buttonVariants }
