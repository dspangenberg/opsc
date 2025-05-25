import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip"
import { cn } from '@/Lib/utils'
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
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors",
    /* Disabled */
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ",
    /* Focus Visible */
    'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
    /* Resets */
    "focus-visible:outline-none",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow data-[hovered]:bg-primary/90 active:border-ring active:ring-ring/50 active:ring-[3px]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm data-[hovered]:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm  data-[hovered]:bg-accent data-[hovered]:text-accent-foreground active:border-ring active:ring-ring/50 active:ring-[3px]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm data-[hovered]:bg-secondary/80",
        ghost: "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
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

export interface ButtonProps extends React.ComponentProps<'button'> {
  children?: React.ReactNode
  id?: string
  loading?: boolean
  asChild?: boolean
  className?: string
  title?: string
  tooltip?: string
  forceTitle?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: IconSvgElement | null
  iconClassName?: string
}

export const Button = ({
  tooltip = '',
  forceTitle = false,
  title = '',
  type = 'button',
  size = 'default',
  ...props
}: ButtonProps & VariantProps<typeof buttonVariants>) => {
  if (!forceTitle && title && !tooltip && ['icon', 'icon-sm', 'icon-xs'].includes(size as string)) {
    tooltip = title
    title = ''
  }

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <BaseButton size={size} {...props} />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return <BaseButton size={size} title={title} {...props} />
}

export const BaseButton = ({
  variant = 'default',
  size = 'default',
  type = 'button',
  loading = false,
  className = '',
  iconClassName = '',
  title = '',
  icon = null,
  asChild = false,
  children,
  ...props
}: ButtonProps & VariantProps<typeof buttonVariants>) => {
  const disabled = loading || props.disabled
  const Comp = asChild ? Slot : 'button'

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
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      data-slot="button"
      disabled={disabled}
      {...props}
    >
      {!loading && icon && (
        <HugeiconsIcon icon={icon} className={cn(iconSizeClass, iconClassName)} />
      )}
      {loading && <LoaderCircleIcon className="animate-spin" size={16} aria-hidden="true" />}
      {title || children}
    </Comp>
  )
}
