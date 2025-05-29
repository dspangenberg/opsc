import type * as React from 'react'
import { Tooltip, TooltipTrigger } from "@/Components/jolly-ui/tooltip"

import { BaseButton, buttonVariants, type BaseButtonProps } from './base-button'
import { JSX } from 'react'

export interface ButtonProps extends BaseButtonProps {
  tooltip?: string
  forceTitle?: boolean
}

export const Button = ({
  tooltip = '',
  forceTitle = false,
  title = '',
  type = 'button',
  form,
  variant,
  size = 'default',
  children,
  ...props
}: ButtonProps): JSX.Element => {

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
        <BaseButton size={size} title={title} form={form} variant={variant}  type={type} {...props}>
          <>
          {title || children}
            <Tooltip  placement="bottom">{tooltip}</Tooltip>
          </>
        </BaseButton>
      </TooltipTrigger>
    )
  }

  return (
    <BaseButton size={size} title={title} form={form} type={type} variant={variant} {...props}>
      {title || children}
    </BaseButton>
  )
}

export { buttonVariants }
