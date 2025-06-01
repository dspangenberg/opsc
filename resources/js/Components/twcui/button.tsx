import type * as React from 'react'
import { Tooltip, TooltipTrigger } from "@/Components/twcui/tooltip"
import type { TooltipProps} from 'react-aria-components'
import { BaseButton, buttonVariants, type BaseButtonProps } from './base-button'
import { JSX } from 'react'

export interface ButtonProps extends BaseButtonProps {
  tooltip?: string
  tooltipPlacement?: TooltipProps['placement']
  forceTitle?: boolean
}

export const Button = ({
  tooltip = '',
  forceTitle = false,
  title = '',
  type = 'button',
  tooltipPlacement = 'bottom',
  form,
  variant,
  size = 'default',
  children,
  ...props
}: ButtonProps): JSX.Element => {

  const ariaLabel = title || tooltip

  if (variant === 'toolbar-default') {
    size = 'auto'
    forceTitle = true
  }

  if (variant === 'toolbar') {
    tooltip = title
    title = ''
  }

  if (!forceTitle && title && !tooltip && ['icon', 'icon-sm', 'icon-xs'].includes(size as string)) {
    tooltip = title
    title = ''
  }

  if (tooltip) {
    return (
      <TooltipTrigger>
        <BaseButton size={size} title={title} form={form} variant={variant} type={type} aria-label={ariaLabel} {...props}>
            {title || children}
        </BaseButton>
        <Tooltip  placement={tooltipPlacement}>{tooltip}</Tooltip>
      </TooltipTrigger>
    )
  }

  return (
    <BaseButton size={size} title={title} form={form} type={type} variant={variant} aria-label={ariaLabel} {...props}>
      {title || children}
    </BaseButton>
  )
}

export { buttonVariants }
