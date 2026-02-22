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

// TODO: twc-ui

const ToggleButtonGroupContext = React.createContext<{
  variant?: 'ghost' | 'outline' | 'toolbar' | 'toggle'
  size?: VariantProps<typeof buttonVariants>['size']
  tooltipPlacement?: TooltipProps['placement']
}>({
  size: 'icon',
  variant: 'ghost',
  tooltipPlacement: 'bottom'
})

export interface ToggleButtonGroupProps extends AriaToggleButtonGroupProps {
  variant?: 'ghost' | 'outline' | 'toolbar' | 'toggle'
  size?: VariantProps<typeof buttonVariants>['size']
  tooltipPlacement?: TooltipProps['placement']
  id?: string
}

const toggleButtonGroupVariants = tv({
  base: 'group/toggle-button-group flex w-fit items-center gap-0.5 rounded-md',
  variants: {
    variant: {
      ghost: '',
      outline: 'border p-0.5',
      toolbar: 'rounded-md bg-muted/50 p-0.5',
      toggle: 'rounded-lg bg-muted p-1'
    }
  },
  defaultVariants: {
    variant: 'ghost'
  }
})

export const ToggleButtonGroup = ({
  className,
  variant = 'ghost',
  size = 'icon-sm',
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
      variant={context.variant ?? variant}
      size={size ?? context.size}
      tooltip={tooltip}
      tooltipPlacement={tooltipPlacement ?? context.tooltipPlacement}
      {...props}
    />
  )
}
