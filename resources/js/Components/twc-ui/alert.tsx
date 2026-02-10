import {
  AlertCircleIcon,
  CancelCircleIcon,
  InformationCircleIcon
} from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/Lib/utils'
import { Icon, type IconType } from './icon'

const alertStyles = tv({
  slots: {
    base: 'relative flex w-full items-center gap-2.5 rounded-md border px-4 py-2 text-sm',
    title: 'font-medium tracking-tight',
    icon: 'size-5 shrink-0 text-background',
    description: 'w-full text-muted-foreground text-sm leading-normal',
    actions: 'flex-none justify-end'
  },
  variants: {
    variant: {
      default: {
        base: 'bg-card text-card-foreground',
        icon: 'rounded-full bg-card-foreground/50 text-white'
      },
      destructive: {
        base: 'm-0 border-destructive/20 bg-destructive/5 text-destructive',
        description: 'text-destructive',
        icon: 'rounded-full bg-destructive text-white'
      },
      info: {
        base: 'border-info/20 bg-info/5 text-info',
        description: 'text-info',
        icon: 'rounded-full bg-info text-white'
      },
      warning: {
        base: 'border-warning bg-warning text-warning-foreground',
        description: 'text-warning-foreground',
        icon: 'rounded-full bg-warning-foreground text-white'
      },
      success: {
        base: 'border-success/20 bg-success/5 text-success',
        description: 'text-success',
        icon: 'rounded-full bg-success text-white'
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface AlertProps extends React.ComponentProps<'div'>, VariantProps<typeof alertStyles> {
  icon?: IconType | false | null
  title?: string
  actions?: React.ReactNode
  iconClassName?: string
}

const Alert: React.FC<AlertProps> = ({
  actions,
  className,
  variant,
  icon = null,
  iconClassName,
  children,
  title,
  ...props
}) => {
  const styles = alertStyles({ variant })
  let realIcon = icon

  if (!icon) {
    switch (variant) {
      case 'destructive':
        realIcon = CancelCircleIcon
        break
      case 'info':
        realIcon = InformationCircleIcon
        break
      case 'warning':
        realIcon = AlertCircleIcon
        break
      default:
        realIcon = AlertCircleIcon
        break
    }
  }

  if (icon === false) realIcon = null

  return (
    <div className="m-1 w-full">
      <div data-slot="alert" role="alert" className={styles.base({ className })} {...props}>
        {realIcon && <Icon icon={realIcon} className={cn(styles.icon(), iconClassName)} />}

        <div className="flex-1 space-y-0.5">
          {title && <AlertTitle variant={variant}>{title}</AlertTitle>}
          {children && (
            <AlertDescription className={styles.description()}>{children}</AlertDescription>
          )}
        </div>
        {actions && <div className={styles.actions()}>{actions}</div>}
      </div>
    </div>
  )
}

const AlertTitle: React.FC<React.ComponentProps<'div'> & VariantProps<typeof alertStyles>> = ({
  className,
  variant,
  ...props
}) => {
  const styles = alertStyles({ variant })
  return <div data-slot="alert-title" className={styles.title({ className })} {...props} />
}

const AlertDescription: React.FC<
  React.ComponentProps<'div'> & VariantProps<typeof alertStyles>
> = ({ className, variant, ...props }) => {
  const styles = alertStyles({ variant })
  return (
    <div data-slot="alert-description" className={styles.description({ className })} {...props} />
  )
}

export { Alert, AlertTitle, AlertDescription }
