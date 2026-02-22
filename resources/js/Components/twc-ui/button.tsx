import { LoaderCircleIcon } from 'lucide-react'
import type { JSX } from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
  type TooltipProps
} from 'react-aria-components'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/Lib/utils'
import { Icon, type IconType } from './icon'
import { Tooltip, TooltipTrigger } from './tooltip'

const buttonVariants = tv({
  slots: {
    base: [
      'inline-flex pressed:translate-y-px items-center justify-center whitespace-nowrap rounded-md font-medium text-sm pressed:shadow-black/20 pressed:shadow-inner pressed:brightness-95 transition-colors',
      /* Disabled */
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      /* Focus Visible */
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20',
      'pressed:shadow-black/20',
      /* Resets */
      'ring-offset-1 focus-visible:outline-none'
    ],
    icon: ''
  },
  variants: {
    variant: {
      default: {
        base: 'bg-primary text-primary-foreground focus-visible:ring-primary/20 data-[hovered]:bg-primary/90'
      },
      destructive: {
        base: 'border bg-destructive text-destructive-foreground text-white focus-visible:border-destructive/20 focus-visible:ring-destructive/20 data-[hovered]:bg-destructive/90'
      },
      outline: {
        base: 'border border-input bg-background selected:bg-accent focus-visible:ring-ring/20 data-[hovered]:bg-accent data-[hovered]:text-accent-foreground'
      },
      secondary: {
        base: 'border border-transparent bg-secondary/90 text-secondary-foreground focus-visible:border focus-visible:border-input data-[hovered]:border-border data-[hovered]:bg-secondary/50'
      },
      ghost: {
        base: 'border border-transparent selected:bg-muted text-sm focus-visible:border focus-visible:border-input focus-visible:ring-ring/20 data-[hovered]:border-border data-[hovered]:bg-accent/80 data-[hovered]:text-accent-foreground'
      },
      link: {
        base: 'cursor-pointer text-primary underline-offset-4 data-[hovered]:underline'
      },
      'ghost-destructive': {
        base: 'border border-transparent text-sm focus-visible:border focus-visible:border-input focus-visible:ring-ring/20 data-[hovered]:border-border data-[hovered]:bg-accent data-[hovered]:text-destructive-foreground'
      },
      toolbar: {
        base: 'border selected:border border-transparent selected:bg-muted text-primary text-sm focus-visible:border focus-visible:border-primary focus-visible:ring-ring/20 active:ring-ring/50 data-[hovered]:border-border data-[hovered]:bg-accent'
      },
      toggle: {
        base: 'selected:bg-background selected:shadow hover:border-primary',
        icon: 'text-primary'
      },
      'toolbar-default': {
        base: 'border border-input bg-background text-sm focus-visible:ring-ring/20 data-hovered:bg-accent data-hovered:text-accent-foreground'
      }
    },
    size: {
      default: { base: 'h-9 px-4 py-2', icon: 'size-5' },
      full: { base: 'h-9 w-full px-4 py-2', icon: 'size-5' },
      sm: { base: 'h-8 rounded-md px-3 text-xs', icon: 'size-5' },
      lg: { base: 'h-10 rounded-md px-8', icon: 'size-5' },
      icon: { base: 'aspect-square size-9 p-0', icon: 'size-5' },
      auto: { base: 'h-9 w-auto px-2 py-2', icon: 'size-5' },
      'icon-xs': { base: 'aspect-square size-6 p-0', icon: 'size-3' },
      'icon-sm': { base: 'aspect-square size-7 p-0', icon: 'size-4' }
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

type ButtonLabelingOptions = {
  title?: string
  tooltip?: string
  size?: VariantProps<typeof buttonVariants>['size']
  variant?: VariantProps<typeof buttonVariants>['variant']
  forceTitle?: boolean
}

export const resolveButtonLabeling = ({
  title = '',
  tooltip = '',
  size,
  variant,
  forceTitle = false
}: ButtonLabelingOptions) => {
  const ariaLabel = title || tooltip
  let nextTitle = title
  let nextTooltip = tooltip
  let nextSize = size
  let nextForceTitle = forceTitle

  if (variant === 'toolbar-default') {
    nextSize = 'auto'
    nextForceTitle = true
  }

  if (variant === 'toolbar') {
    nextTooltip = nextTitle
    nextTitle = ''
    nextSize = 'icon'
  }

  if (
    !nextForceTitle &&
    nextTitle &&
    !nextTooltip &&
    ['icon', 'icon-sm', 'icon-xs'].includes(nextSize as string)
  ) {
    nextTooltip = nextTitle
    nextTitle = ''
  }

  return {
    ariaLabel,
    title: nextTitle,
    tooltip: nextTooltip,
    size: nextSize,
    isToolbar: variant === 'toolbar' || variant === 'toolbar-default'
  }
}

export interface ButtonProps extends AriaButtonProps, VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  disabled?: boolean
  icon?: IconType
  iconClassName?: string
  slot?: string | null
  tabIndex?: number
  title?: string
  tooltip?: string
  tooltipPlacement?: TooltipProps['placement']
  forceTitle?: boolean
}

export const Button = ({
  className,
  disabled = false,
  variant,
  size,
  form,
  type = 'button',
  isLoading = false,
  icon,
  iconClassName,
  slot,
  children,
  title = '',
  tooltip = '',
  forceTitle = false,
  tooltipPlacement = 'bottom',
  ...props
}: ButtonProps): JSX.Element => {
  const {
    ariaLabel,
    title: resolvedTitle,
    tooltip: resolvedTooltip,
    size: resolvedSize,
    isToolbar
  } = resolveButtonLabeling({ title, tooltip, size, variant, forceTitle })

  const styles = buttonVariants({ variant, size: resolvedSize })

  const buttonElement = (
    <AriaButton
      form={form}
      type={type}
      slot={slot}
      isDisabled={disabled || isLoading}
      isPending={isLoading}
      aria-label={ariaLabel}
      className={composeRenderProps(className, className =>
        styles.base({ className: cn('gap-2', className) })
      )}
      {...props}
    >
      {composeRenderProps(children, children => (
        <div className={cn('flex gap-2', resolvedSize === 'icon' ? 'mx-auto' : '')}>
          {!isLoading ? (
            icon && (
              <Icon
                aria-label={resolvedTitle || resolvedTooltip}
                icon={icon}
                className={cn(
                  disabled ? 'text-muted-foreground' : '',
                  styles.icon({ className: iconClassName })
                )}
              />
            )
          ) : (
            <LoaderCircleIcon className={cn('animate-spin', styles.icon())} />
          )}
          {(resolvedTitle || children) && variant !== 'toolbar' && (
            <div className={cn(isToolbar ? 'hidden md:flex' : '')}>{resolvedTitle || children}</div>
          )}
        </div>
      ))}
    </AriaButton>
  )

  if (resolvedTooltip) {
    return (
      <TooltipTrigger>
        {buttonElement}
        <Tooltip placement={tooltipPlacement}>{resolvedTooltip}</Tooltip>
      </TooltipTrigger>
    )
  }

  return buttonElement
}

export { buttonVariants }
