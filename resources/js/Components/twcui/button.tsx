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
  size = 'default',
  children,
  ...props
}: ButtonProps): JSX.Element => {

  if (!forceTitle && title && !tooltip && ['icon', 'icon-sm', 'icon-xs'].includes(size as string)) {
    tooltip = title
    title = ''
  }

  if (tooltip) {
    return (
      <TooltipTrigger>
        <BaseButton size={size} title={title} form={form} type={type} {...props}>
          {children}
        </BaseButton>
        <Tooltip>{tooltip}</Tooltip>
      </TooltipTrigger>
    )
  }

  return (
    <BaseButton size={size} title={title} form={form} type={type} {...props}>
      {children}
    </BaseButton>
  )
}

export { buttonVariants }
