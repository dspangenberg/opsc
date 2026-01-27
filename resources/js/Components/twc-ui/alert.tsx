import { AlertCircleIcon, InformationCircleIcon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Icon, type IconType } from './icon'

const alertStyles = tv({
  slots: {
    base: 'relative flex w-full items-center gap-4 gap-y-0.5 rounded-md border px-4 py-1.5 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current',
    title: 'col-start-2 line-clamp-1 min-h-4 pt-0.5 font-medium tracking-tight',
    icon: 'size-5 text-foreground',
    description:
      'flex-1 justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed',
    actions: 'flex-none justify-end'
  },
  variants: {
    variant: {
      default: {
        base: 'bg-card text-card-foreground'
      },
      destructive: {
        base: 'm-0 border-destructive/20 bg-destructive/5 text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current',
        description: 'text-destructive',
        icon: 'text-destructive'
      },
      info: {
        base: 'border-yellow-200 bg-yellow-50 dark:border-yellow-900/40 dark:bg-yellow-950/40',
        description: 'text-yellow-700',
        icon: 'text-yellow-700'
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
}

const Alert: React.FC<AlertProps> = ({
  actions,
  className,
  variant,
  icon = null,
  children,
  title,
  ...props
}) => {
  const styles = alertStyles({ variant })
  let realIcon = icon

  if (icon === null) {
    switch (variant) {
      case 'destructive':
        realIcon = AlertCircleIcon
        break
      case 'info':
        realIcon = InformationCircleIcon
        break
    }
  }

  return (
    <div className="m-1">
      <div data-slot="alert" role="alert" className={styles.base({ className })} {...props}>
        {realIcon && (
          <div>
            <Icon icon={realIcon} className={styles.icon()} />
          </div>
        )}
        <div className="flex-1 space-y-1.5">
          {title && <AlertTitle variant={variant}>{title}</AlertTitle>}
          <AlertDescription variant={variant}>{children}</AlertDescription>
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
