import type React from 'react'
import { cn } from '@/Lib/utils'
import { ScrollArea } from './scroll-area'

interface BorderedBoxProps {
  className?: string
  innerClassName?: string
  children: React.ReactNode
}

export const BorderedBox: React.FC<BorderedBoxProps> = ({
  children,
  className,
  innerClassName
}) => {
  return (
    <div
      className={cn(
        'relative flex max-h-fit flex-1 flex-col overflow-hidden rounded-lg border border-border/80 bg-page-content p-1',
        className
      )}
    >
      <ScrollArea
        className={cn(
          'absolute top-0 right-0 bottom-0 left-0 max-h-fit flex-1 rounded-md border bg-transparent',
          innerClassName
        )}
      >
        {children}
      </ScrollArea>
    </div>
  )
}
