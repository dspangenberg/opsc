import * as AvatarPrimitive from '@radix-ui/react-avatar'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { generateColorFromString, getIdealTextColor } from '@/Lib/color-utils'
import { cn } from '@/Lib/utils'

const AvatarRoot = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  )
}

const AvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  )
}

const AvatarFallback = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
      {...props}
    />
  )
}

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  fullname?: string
  initials?: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Avatar = ({
  fullname = '',
  initials = '',
  className = '',
  size = 'md',
  src,
  ...props
}: AvatarProps) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('')
  const [textColor, setTextColor] = useState<string>('')

  if (!initials) {
    initials = fullname
      .split(' ')
      .map(n => n[0])
      .join('')
  }

  const avatarSizeClass = {
    sm: 'size-7',
    md: 'size-8',
    lg: 'size-10'
  }[size]

  const fallBackFontSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  }[size]

  useEffect(() => {
    if (!src && fullname) {
      const bgColor = generateColorFromString(fullname)
      setBackgroundColor(bgColor)
      setTextColor(getIdealTextColor(bgColor))
    }
  }, [fullname, src])

  return (
    <div className="rounded-full border border-border" data-testid="avatar-container">
      <AvatarRoot
        className={cn('rounded-full border-2 border-transparent', avatarSizeClass, className)}
        {...props}
      >
        <AvatarImage src={src ?? undefined} alt={fullname} />
        <AvatarFallback
          style={{ backgroundColor, color: textColor }}
          className={cn('rounded-full', fallBackFontSize)}
        >
          {initials}
        </AvatarFallback>
      </AvatarRoot>
    </div>
  )
}

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback }
