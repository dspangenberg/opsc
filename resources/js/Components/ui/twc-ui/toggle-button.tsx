import React from 'react'
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonProps as AriaToggleButtonProps,
  composeRenderProps,
} from 'react-aria-components'
import { type VariantProps } from 'class-variance-authority'
import { Icon, type IconType } from './icon'
import { TooltipTrigger, Tooltip, TooltipProps } from './tooltip'
import { cn } from '@/Lib/utils'
import { buttonVariants } from './button'

export interface ToggleButtonProps extends AriaToggleButtonProps {
  variant?: 'ghost' | 'outline' | 'toolbar'
  size?: VariantProps<typeof buttonVariants>['size']
  icon: IconType
  tooltip?: string
  tooltipPlacement?: TooltipProps['placement']
}

export const ToggleButton = ({
  tooltip = '',
  tooltipPlacement = 'bottom',
  variant = 'ghost',
  size = 'icon',
  icon,
  ...props
}: ToggleButtonProps) => {
  const iconSizeClass = {
    default: 'size-5',
    sm: 'size-5',
    lg: 'size-5',
    icon: 'size-5',
    'icon-sm': 'size-4',
    'icon-xs': 'size-3',
    auto: 'size-5'
  }[size || 'icon']

  const finalTooltip = tooltip || props['aria-label']
  return (
    <TooltipTrigger>
      <AriaToggleButton
        {...props}
        className={composeRenderProps(props.className, (className, renderProps) =>
        cn(
          buttonVariants({
            ...renderProps,
            variant,
            size,
          }),
          className
        )
      )}
        >
        <Icon icon={icon} className={iconSizeClass} />


      </AriaToggleButton>
      <Tooltip placement={tooltipPlacement}>{finalTooltip}</Tooltip>
    </TooltipTrigger>
  )
}
