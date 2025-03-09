/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as React from 'react'

import { cn } from '@/Lib/utils'

const colors = [
  '#00bcf2',
  '#0078d4',
  '#002050',
  '#008272',
  '#bad80a',
  '#004b1c',
  '#e3008c',
  '#b4a0ff',
  '#5c2d91',
  '#000000',
  '#d83b01',
  '#e81123',
  '#a80000',
  '#e81123',
  '#5c005c',
  '#b4a0ff',
  '#00188f'
]

// Function to determine ideal text color
const getIdealTextColor = (bgColor: string): string => {
  const hex = bgColor.replace('#', '')
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 125 ? '#000000' : '#FFFFFF'
}

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  fullname?: string
  initials?: string
}

const Avatar = (
  {
    ref,
    className,
    fullname,
    initials,
    ...props
  }: AvatarProps & {
    ref?: React.RefObject<React.ElementRef<typeof AvatarPrimitive.Root>>;
  }
) => (<div className="border rounded-full border-stone-200">
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 border-transparent border-2 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
</div>)
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
    ref: React.RefObject<React.ElementRef<typeof AvatarPrimitive.Image>>;
  }
) => (<AvatarPrimitive.Image
  ref={ref}
  className={cn('aspect-square h-full w-full', className)}
  {...props}
/>)
AvatarImage.displayName = AvatarPrimitive.Image.displayName

interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  fullname: string
  initials: string
}

const AvatarFallback = (
  {
    ref,
    className,
    fullname,
    initials,
    ...props
  }: AvatarFallbackProps & {
    ref?: React.RefObject<React.ElementRef<typeof AvatarPrimitive.Fallback>>;
  }
) => {
  const [backgroundColor, setBackgroundColor] = React.useState<string>('')
  const [textColor, setTextColor] = React.useState<string>('')

  React.useEffect(() => {
    if (fullname) {
      // Generate color based on fullname
      const colorIndex =
        fullname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
      const bgColor = colors[colorIndex]
      setBackgroundColor(bgColor)
      setTextColor(getIdealTextColor(bgColor))

      // Generate initials
      const nameParts = fullname.split(' ')
    }
  }, [fullname])

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      style={{ backgroundColor, color: textColor }}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full text-sm font-medium',
        className
      )}
      {...props}
    >
      {initials}
    </AvatarPrimitive.Fallback>
  )
}
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
