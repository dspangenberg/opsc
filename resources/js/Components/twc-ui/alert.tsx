import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/Lib/utils'
import { Icon, type IconType } from './icon'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'bg-destructive/5 border-destructive/20 text-destructive [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
        info: 'bg-yellow-50'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

interface AlertProps extends React.ComponentProps<'div'>, VariantProps<typeof alertVariants> {
  icon?: IconType
  title?: string
}

const Alert: React.FC<AlertProps> = ({ className, variant, icon, children, title, ...props }) => {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon && <Icon icon={icon} />}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </div>
  )
}

const AlertTitle: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 pt-0.5 font-medium tracking-tight',
        className
      )}
      {...props}
    />
  )
}

const AlertDescription: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 mt-1.5 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
