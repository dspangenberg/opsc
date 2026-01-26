import type * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Icon, type IconType } from './icon'

const alertStyles = tv({
  slots: {
    base: 'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current',
    title: 'col-start-2 line-clamp-1 min-h-4 pt-0.5 font-medium tracking-tight',
    description:
      'col-start-2 mt-1.5 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed'
  },
  variants: {
    variant: {
      default: {
        base: 'bg-card text-card-foreground'
      },
      destructive: {
        base: 'border-destructive/20 bg-destructive/5 text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current'
      },
      info: {
        base: 'bg-yellow-50'
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface AlertProps extends React.ComponentProps<'div'>, VariantProps<typeof alertStyles> {
  icon?: IconType
  title?: string
}

const Alert: React.FC<AlertProps> = ({ className, variant, icon, children, title, ...props }) => {
  const styles = alertStyles({ variant })
  return (
    <div data-slot="alert" role="alert" className={styles.base({ className })} {...props}>
      {icon && <Icon icon={icon} />}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </div>
  )
}

const AlertTitle: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
  const styles = alertStyles()
  return <div data-slot="alert-title" className={styles.title({ className })} {...props} />
}

const AlertDescription: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
  const styles = alertStyles()
  return (
    <div data-slot="alert-description" className={styles.description({ className })} {...props} />
  )
}

export { Alert, AlertTitle, AlertDescription }
