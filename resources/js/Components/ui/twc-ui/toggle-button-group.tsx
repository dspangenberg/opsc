'use client'

import React from 'react'
import {
  composeRenderProps,
  ToggleButtonGroup as AriaToggleButtonGroup,
  ToggleButtonGroupProps as AriaToggleButtonGroupProps, type TooltipProps
} from 'react-aria-components'
import { tv, type VariantProps } from 'tailwind-variants'
import { ToggleButton, ToggleButtonProps } from './toggle-button'
import { buttonVariants } from './button'

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
}

const toggleButtonGroupVariants = tv({
  base: 'group/toggle-button-group flex w-fit items-center rounded-md gap-1.5',
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
  children,
  ...props
}: ToggleButtonGroupProps) => {
  return (
    <AriaToggleButtonGroup
      {...props}
      data-slot="toggle-button-group"
      data-variant={variant}
      data-size={size}
      className={composeRenderProps(className, (cls) =>
        toggleButtonGroupVariants({
          variant,
          className: cls
        })
      )}
    >
      <ToggleButtonGroupContext.Provider value={{
        variant,
        size,
        tooltipPlacement
      }}
      >
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
