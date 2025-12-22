'use client'

import React from 'react'
import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  composeRenderProps,
  type TooltipProps
} from 'react-aria-components'
import { tv, type VariantProps } from 'tailwind-variants'
import type { buttonVariants } from './button'
import { ToggleButton, type ToggleButtonProps } from './toggle-button'

const ToggleButtonGroupContext = React.createContext<{
  variant?: 'ghost' | 'outline' | 'toolbar'
  size?: VariantProps<typeof buttonVariants>['size']
  tooltipPlacement?: TooltipProps['placement']
}>({
  size: 'icon',
  variant: 'ghost',
  tooltipPlacement: 'bottom'
})

export interface ToggleButtonGroupProps extends AriaToggleButtonGroupProps {
  variant?: 'ghost' | 'outline' | 'toolbar'
  size?: VariantProps<typeof buttonVariants>['size']
  tooltipPlacement?: TooltipProps['placement']
  id?: string
}

const toggleButtonGroupVariants = tv({
  base: 'group/toggle-button-group flex w-fit items-center gap-1.5 rounded-md',
  variants: {
    variant: {
      ghost: '',
      outline: 'shadow-xs',
      toolbar: ''
    }
  },
  defaultVariants: {
    variant: 'ghost'
  }
})

export const ToggleButtonGroup = ({
  className,
  variant = 'ghost',
  size = 'icon',
  tooltipPlacement = 'bottom',
  selectionMode = 'single',
  children,
  ...props
}: ToggleButtonGroupProps) => {
  const contextValue = React.useMemo(
    () => ({
      variant,
      size,
      tooltipPlacement
    }),
    [variant, size, tooltipPlacement]
  )

  return (
    <AriaToggleButtonGroup
      {...props}
      data-slot="toggle-button-group"
      data-variant={variant}
      data-size={size}
      selectionMode={selectionMode}
      className={composeRenderProps(className, cls =>
        toggleButtonGroupVariants({
          variant,
          className: cls
        })
      )}
    >
      <ToggleButtonGroupContext.Provider value={contextValue}>
        {children as React.ReactNode}
      </ToggleButtonGroupContext.Provider>
    </AriaToggleButtonGroup>
  )
}

export const ToggleButtonGroupItem = ({
  variant,
  tooltip = '',
  tooltipPlacement,
  size,
  ...props
}: ToggleButtonProps) => {
  const context = React.useContext(ToggleButtonGroupContext)

  return (
    <ToggleButton
      variant={variant ?? context.variant}
      size={size ?? context.size}
      tooltip={tooltip}
      tooltipPlacement={tooltipPlacement ?? context.tooltipPlacement}
      {...props}
    />
  )
}
