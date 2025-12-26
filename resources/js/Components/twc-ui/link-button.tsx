import type { VariantProps } from 'class-variance-authority'
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  composeRenderProps,
  type TooltipProps,
  TooltipTrigger
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { buttonVariants } from './button'
import { Icon, type IconType } from './icon'
import { Tooltip } from './tooltip'

export interface ToggleButtonProps extends AriaLinkProps {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  icon?: IconType
  tooltip?: string
  title?: string
  tooltipPlacement?: TooltipProps['placement']
  forceTitle?: boolean
}

export const LinkButton = ({
  tooltip = '',
  tooltipPlacement = 'bottom',
  variant = 'default',
  size = 'default',
  children,
  title = '',
  forceTitle = false,
  icon,
  ...props
}: ToggleButtonProps) => {
  const ariaLabel = title || tooltip

  const iconSizeClass = {
    default: 'size-5',
    full: 'size-5',
    sm: 'size-5',
    lg: 'size-5',
    icon: 'size-5',
    'icon-sm': 'size-4',
    'icon-xs': 'size-3',
    auto: 'size-5'
  }[size || 'icon']
  const isToolbar = variant === 'toolbar' || variant === 'toolbar-default'

  if (variant === 'toolbar-default') {
    size = 'auto'
    forceTitle = true
  }

  if (variant === 'toolbar') {
    tooltip = title
    title = ''
    size = 'icon'
  }

  if (!forceTitle && title && !tooltip && ['icon', 'icon-sm', 'icon-xs'].includes(size as string)) {
    tooltip = title
    title = ''
  }

  return (
    <TooltipTrigger>
      <AriaLink
        {...props}
        aria-label={ariaLabel}
        className={composeRenderProps(props.className, (className: any, renderProps) =>
          cn(
            'gap-2',
            buttonVariants({
              ...renderProps,
              variant,
              size
            }),
            className
          )
        )}
      >
        {() => (
          <>
            {icon && <Icon icon={icon} className={iconSizeClass} />}
            {title && <span>{title}</span>}
          </>
        )}
      </AriaLink>
      {tooltip && (
        <Tooltip placement={tooltipPlacement}>
          {title && variant !== 'toolbar' && (
            <div className={cn(isToolbar ? 'hidden md:flex' : '')}>{title}</div>
          )}
        </Tooltip>
      )}
    </TooltipTrigger>
  )
}
