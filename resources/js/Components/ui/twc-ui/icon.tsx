import { cn } from '/lib/utils'
import { type LucideProps } from 'lucide-react'
import { type ComponentType } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'

export type IconType = ComponentType<LucideProps> | IconSvgElement

interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: IconType
  strokeWidth?: number
}

function isHugeIcon(icon: IconType): icon is IconSvgElement {
  return Array.isArray(icon) && Array.isArray(icon[0])
}

export function Icon({ icon, className, strokeWidth = 1.5, ...props }: IconProps) {
  if (isHugeIcon(icon)) {
    return (
      <HugeiconsIcon
        icon={icon}
        strokeWidth={strokeWidth ? Number(strokeWidth) : undefined}
        {...props}
        className={cn('h-4 w-4', className)}
      />
    )
  }

  const IconComponent = icon as ComponentType<LucideProps>
  return <IconComponent className={cn('h-4 w-4', className)} strokeWidth={strokeWidth} {...props} />
}
