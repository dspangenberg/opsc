import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  composeRenderProps,
  type TooltipProps,
  TooltipTrigger
} from 'react-aria-components'
import type { VariantProps } from 'tailwind-variants'
import { cn } from '@/Lib/utils'
import { buttonVariants, resolveButtonLabeling } from './button'
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
  const {
    ariaLabel,
    title: resolvedTitle,
    tooltip: resolvedTooltip,
    size: resolvedSize,
    isToolbar
  } = resolveButtonLabeling({ title, tooltip, size, variant, forceTitle })
  const styles = buttonVariants({ variant, size: resolvedSize })

  return (
    <TooltipTrigger>
      <AriaLink
        {...props}
        aria-label={ariaLabel}
        className={composeRenderProps(props.className, className =>
          styles.base({ className: cn('gap-2', className) })
        )}
      >
        {() => (
          <>
            {icon && <Icon icon={icon} className={styles.icon()} />}
            {resolvedTitle && <span>{resolvedTitle}</span>}
          </>
        )}
      </AriaLink>
      {(resolvedTooltip || resolvedTitle) && (
        <Tooltip placement={tooltipPlacement}>
          {resolvedTooltip
            ? resolvedTooltip
            : resolvedTitle && (
                <div className={cn(isToolbar ? 'hidden md:flex' : '')}>{resolvedTitle}</div>
              )}
        </Tooltip>
      )}
    </TooltipTrigger>
  )
}
