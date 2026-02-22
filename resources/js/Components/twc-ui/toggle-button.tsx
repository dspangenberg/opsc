import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  composeRenderProps
} from 'react-aria-components'
import type { VariantProps } from 'tailwind-variants'
import { cn } from '@/Lib/utils'
import { buttonVariants } from './button'
import { Icon, type IconType } from './icon'
import { Tooltip, type TooltipProps, TooltipTrigger } from './tooltip'

export interface ToggleButtonProps extends AriaToggleButtonProps {
  variant?: 'ghost' | 'outline' | 'toolbar' | 'toggle'
  size?: VariantProps<typeof buttonVariants>['size']
  icon?: IconType
  tooltip?: string
  title?: string
  tooltipPlacement?: TooltipProps['placement']
}

export const ToggleButton = ({
  tooltip = '',
  tooltipPlacement = 'bottom',
  variant = 'ghost',
  size = 'icon',
  title = '',
  icon,
  ...props
}: ToggleButtonProps) => {
  const styles = buttonVariants({ variant, size })

  const finalTooltip = tooltip || props['aria-label']
  return (
    <TooltipTrigger>
      <AriaToggleButton
        {...props}
        className={composeRenderProps(props.className, className =>
          styles.base({ className: cn('gap-2', className) })
        )}
      >
        {icon && <Icon icon={icon} className={styles.icon()} />}
        {title && <span>{title}</span>}
      </AriaToggleButton>
      {tooltip && <Tooltip placement={tooltipPlacement}>{finalTooltip}</Tooltip>}
    </TooltipTrigger>
  )
}
