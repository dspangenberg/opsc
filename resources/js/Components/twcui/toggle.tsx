'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  composeRenderProps,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps, type TooltipProps
} from 'react-aria-components'

import { cn } from '@/Lib/utils'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Tooltip, TooltipTrigger } from '@/Components/ui/twc-ui/tooltip'

const toggleVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors pointer-events-auto',
    /* Disabled */
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    /* Hover */
    'data-[hovered]:bg-muted data-[hovered]:text-muted-foreground',
    /* Selected */
    'data-[selected]:bg-accent data-[selected]:text-accent-foreground',
    /* Focus Visible */
    'data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring',
    /* Resets */
    'focus-visible:outline-none'
  ],
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent shadow-sm data-[hovered]:bg-accent data-[hovered]:text-accent-foreground'
      },
      size: {
        default: 'size-9',
        sm: 'h-8 px-2',
        lg: 'h-10 px-3'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

interface ToggleProps
  extends AriaToggleButtonProps,
    VariantProps<typeof toggleVariants> {
  icon: IconSvgElement;
  tooltip?: string
  tooltipPlacement?: TooltipProps['placement']
  onChange?: (isSelected: boolean) => void;
}

const Toggle = ({
  className,
  variant,
  tooltipPlacement = 'bottom',
  tooltip = '',
  size,
  icon,
  onChange,
  ...props
}: ToggleProps) => (
  <TooltipTrigger>
  <AriaToggleButton
    className={composeRenderProps(className, (className) =>
      cn(
        'group-data-[orientation=vertical]/togglegroup:w-full',
        toggleVariants({
          variant,
          size,
          className
        })
      )
    )}
    onChange={onChange}
    {...props}
  >

    <Tooltip  placement={tooltipPlacement}>{tooltip}</Tooltip>
    <HugeiconsIcon icon={icon} className="size-5" />
  </AriaToggleButton>
</TooltipTrigger>
)

const ToggleButtonGroup = ({
  children,
  className,
  ...props
}: AriaToggleButtonGroupProps) => (
  <AriaToggleButtonGroup
    className={composeRenderProps(className, (className) =>
      cn(
        'group/togglegroup flex items-center justify-center gap-1 data-[orientation=vertical]:flex-col',
        className
      )
    )}
    {...props}
  >
    {children}
  </AriaToggleButtonGroup>
)

export { Toggle, toggleVariants, ToggleButtonGroup }
export type { ToggleProps }
