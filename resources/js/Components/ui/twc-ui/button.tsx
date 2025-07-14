import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircleIcon } from 'lucide-react'
import type { JSX } from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
  type TooltipProps
} from 'react-aria-components'
import { Icon, type IconType } from '/components/twc-ui/icon'
import { cn } from '/lib/utils'
import { Tooltip, TooltipTrigger } from './tooltip'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors active:border-ring',
    /* Disabled */
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ',
    /* Focus Visible */
    'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
    'active:ring-[3px]',
    /* Resets */
    'focus-visible:outline-none ring-offset-1'
  ],
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground data-[hovered]:bg-primary/90 pressed:ring-primary/50 active:ring-ring/50 focus-visible:ring-primary/20',
        destructive:
          'bg-destructive text-destructive-foreground text-white data-[hovered]:bg-destructive/90 border pressed:ring-destructive/50 focus-visible:ring-destructive/20 focus-visible:border-destructive/20 ',
        outline:
          'border border-input bg-background  data-[hovered]:bg-accent data-[hovered]:text-accent-foreground focus-visible:ring-ring/20 pressed:ring-ring/50',
        secondary:
          'bg-secondary/90 text-secondary-foreground border-transparent border focus-visible:border-input focus-visible:border data-[hovered]:bg-secondary/20 pressed:ring-ring/50',
        ghost:
          'data-[hovered]:bg-accent data-[hovered]:text-accent-foreground focus-visible:border border border-transparent focus-visible:border-input focus-visible:ring-ring/20 pressed:ring-ring/50 text-sm',
        link: 'text-primary underline-offset-4 data-[hovered]:underline',
        toolbar:
          'data-[hovered]:bg-accent data-[hovered]:text-accent-foreground pressed:ring-ring/50 active:ring-ring/50 focus-visible:border focus-visible:border-primary focus-visible:ring-ring/20  text-sm',
        'toolbar-default':
          'border border-input bg-background  data-[hovered]:bg-accent data-[hovered]:text-accent-foreground focus-visible:ring-ring/20 pressed:ring-ring/50 text-sm'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'size-9',
        auto: 'h-9 w-auto py-2 px-2',
        'icon-xs': 'size-6',
        'icon-sm': 'size-7'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps extends AriaButtonProps, VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  disabled?: boolean
  icon?: IconType
  iconClassName?: string
  slot?: string | null
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
  const ariaLabel = title || tooltip

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

  const iconSizeClass = {
    auto: 'size-5',
    default: 'size-5',
    sm: 'size-5',
    lg: 'size-5',
    icon: 'size-5',
    'icon-sm': 'size-4',
    'icon-xs': 'size-3'
  }[size || 'default']

  const isToolbar = variant === 'toolbar' || variant === 'toolbar-default'

  const buttonElement = (
    <AriaButton
      form={form}
      type={type}
      slot={slot}
      isDisabled={disabled || isLoading}
      isPending={isLoading}
      aria-label={ariaLabel}
      className={composeRenderProps(className, className =>
        cn(
          'gap-2',
          buttonVariants({
            variant,
            size
          }),
          className
        )
      )}
      {...props}
    >
      {composeRenderProps(children, children => (
        <div className={cn('flex gap-2', size === 'icon' ? 'mx-auto' : '')}>
          {!isLoading && icon && (
            <Icon
              aria-label={title || tooltip}
              icon={icon}
              className={cn(disabled ? 'text-muted-foreground' : '', iconSizeClass, iconClassName)}
            />
          )}
          {isLoading && (
            <LoaderCircleIcon className={cn('animate-spin', iconSizeClass)} aria-hidden="true" />
          )}
          {(title || children) && variant !== 'toolbar' && (
            <div className={cn(isToolbar ? 'hidden md:flex' : '')}>{title || children}</div>
          )}
        </div>
      ))}
    </AriaButton>
  )

  if (tooltip) {
    return (
      <TooltipTrigger>
        {buttonElement}
        <Tooltip placement={tooltipPlacement}>{tooltip}</Tooltip>
      </TooltipTrigger>
    )
  }

  return buttonElement
}

export { buttonVariants }
