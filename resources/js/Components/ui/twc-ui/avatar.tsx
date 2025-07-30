import * as AvatarPrimitive from '@radix-ui/react-avatar'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { generateColorFromString, getIdealTextColor } from '@/Lib/color-utils'
import { cn } from '@/Lib/utils'

// Basic Avatar components (original shadcn/ui implementation)
function AvatarRoot({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
      {...props}
    />
  )
}

// Enhanced Avatar component (from twc-ui implementation)
interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  fullname?: string
  initials?: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function Avatar({
  fullname = '',
  initials = '',
  src = null,
  className = '',
  size = 'md',
  ...props
}: AvatarProps) {
  const [backgroundColor, setBackgroundColor] = useState<string>('')
  const [textColor, setTextColor] = useState<string>('')

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
    if (fullname) {
      // Generate color based on fullname using improved algorithm
      const bgColor = generateColorFromString(fullname)
      setBackgroundColor(bgColor)
      setTextColor(getIdealTextColor(bgColor))
    }
  }, [fullname])

  return (
    <div className="rounded-full border border-border" data-testid="avatar-container">
      <AvatarRoot
        className={cn('rounded-full border-2 border-transparent', avatarSizeClass, className)}
        data-testid="avatar"
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
