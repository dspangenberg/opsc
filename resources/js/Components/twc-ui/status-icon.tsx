import {
  AlertCircleIcon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon
} from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/Lib/utils'
import { Icon, type IconType } from './icon'

const alertStyles = tv({
  slots: {
    icon: 'size-5 shrink-0 text-background'
  },
  variants: {
    variant: {
      default: {
        icon: 'rounded-full bg-card-foreground/50 text-white'
      },
      destructive: { icon: 'rounded-full bg-destructive text-white' },
      info: {
        icon: 'rounded-full bg-info text-white'
      },
      warning: {
        icon: 'rounded-full bg-warning-foreground text-white'
      },
      success: {
        icon: 'rounded-full bg-success text-white'
      }
    },
    size: {
      default: { icon: 'size-5' },
      full: { base: 'h-9 w-full px-4 py-2', icon: 'size-5' },
      sm: { base: 'h-8 rounded-md px-3 text-xs', icon: 'size-4' },
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

interface AlertProps extends React.ComponentProps<'div'>, VariantProps<typeof alertStyles> {
  variant: VariantProps<typeof alertStyles>['variant']
  size?: VariantProps<typeof alertStyles>['size']
}

const StatusIcon: React.FC<AlertProps> = ({ variant, size }) => {
  const styles = alertStyles({ variant, size })
  let realIcon: IconType

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
    case 'success':
      realIcon = CheckmarkCircle01Icon
      break
    default:
      realIcon = AlertCircleIcon
      break
  }

  return <Icon icon={realIcon} className={cn(styles.icon())} />
}

export { StatusIcon }
