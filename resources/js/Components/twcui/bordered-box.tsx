import type React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '@/Lib/utils'

interface BorderedBoxProps {
  className?: string
  innerClassName?: string
  children: React.ReactNode
}

export const BorderedBox: React.FC<BorderedBoxProps> = ({children, className, innerClassName}) => {
  return (
    <div className={cn('relative flex-1 flex border-border/80 bg-page-content rounded-lg p-1 border overflow-hidden flex-col max-h-fit', className)}>
      <ScrollArea className={cn('flex-1 border rounded-md max-h-fit bg-transparent absolute top-0 bottom-0 left-0 right-0', innerClassName)}>
        {children}
      </ScrollArea>
    </div>
  )
}
