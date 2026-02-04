import * as AvatarPrimitive from '@radix-ui/react-avatar'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useInitials } from '@/Hooks/use-initials'
import { generateColorFromString, getIdealTextColor } from '@/Lib/color-utils'
import { cn } from '@/Lib/utils'

const avatarVariants = tv({
  slots: {
    base: 'relative flex shrink-0 overflow-hidden rounded-full p-0.5 text-primary-foreground focus-visible:ring-primary/20 data-[hovered]:bg-primary/90',
    image: 'aspect-square size-full rounded-full',
    fallback: 'flex size-full items-center justify-center rounded-full uppercase',
    badge: 'flex items-center justify-center rounded-full border text-white text-xs',
    badgeContainer: 'absolute -right-1.5 -bottom-1.5 rounded-full border-2 border-background'
  },
  variants: {
    variant: {
      default: {
        badge: 'bg-background text-foreground'
      },
      destructive: {
        badge: 'border-destructive bg-destructive/80 text-white'
      },
      info: {
        badge: 'bg-primary text-background'
      },
      warning: {
        badge:
          'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
      }
    },
    size: {
      sm: {
        base: 'size-7',
        fallback: 'text-xs',
        badge: 'size-5'
      },
      md: {
        base: 'size-9',
        fallback: 'text-sm',
        badge: 'size-5'
      },
      lg: {
        base: 'size-10',
        fallback: 'text-lg',
        badge: 'size-5'
      }
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})

type AvatarVariants = VariantProps<typeof avatarVariants>

const AvatarRoot = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) => {
  return <AvatarPrimitive.Root data-slot="avatar" className={className} {...props} />
}

const AvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={className} {...props} />
}

const AvatarFallback = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => {
  return <AvatarPrimitive.Fallback data-slot="avatar-fallback" className={className} {...props} />
}

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  fullname?: string
  initials?: string
  src?: string | null
  size?: AvatarVariants['size']
  className?: string
  variant?: AvatarVariants['variant']
  badge?: React.ReactNode
  alt?: string
  children?: React.ReactNode
  badgeClassName?: string
}

const Avatar = ({
  fullname = '',
  initials = '',
  badgeClassName,
  className,
  size = 'md',
  variant = 'default',
  src,
  badge,
  alt,
  children,
  ...props
}: AvatarProps) => {
  const initialsHook = useInitials()

  const [backgroundColor, setBackgroundColor] = useState<string>('')
  const [textColor, setTextColor] = useState<string>('')
  const realInitials = initials ? initials : initialsHook(fullname)

  useEffect(() => {
    if (!src && fullname) {
      const bgColor = generateColorFromString(fullname)
      setBackgroundColor(bgColor)
      setTextColor(getIdealTextColor(bgColor))
    }
  }, [fullname, src])

  const styles = avatarVariants({
    variant,
    size
  })

  return (
    <div className="relative">
      <div className="rounded-full border border-border" data-testid="avatar-container">
        <AvatarRoot className={cn(styles.base(), className)} {...props}>
          {children}
          <AvatarImage className={styles.image()} src={src ?? undefined} alt={alt || fullname} />
          <AvatarFallback
            style={{
              backgroundColor,
              color: textColor
            }}
            className={styles.fallback()}
          >
            {realInitials}
          </AvatarFallback>
        </AvatarRoot>
      </div>
      {badge && (
        <div className={cn(styles.badgeContainer())}>
          <div className={cn(styles.badge(), badgeClassName)}>{badge}</div>
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback }
export type { AvatarProps, AvatarVariants }
