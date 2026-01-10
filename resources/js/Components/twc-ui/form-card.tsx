import type React from 'react'
import { cn } from '@/Lib/utils'
import { ScrollArea } from '../ui/scroll-area'

interface FormCardProps {
  className?: string
  innerClassName?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export const FormCard: React.FC<FormCardProps> = ({
  children,
  className,
  footer,
  innerClassName
}) => {
  return (
    <div className="flex w-full flex-col">
      <div
        className={cn(
          'relative flex max-h-fit flex-1 flex-col overflow-hidden rounded-lg border border-border/80 bg-page-content p-1',
          className
        )}
      >
        <ScrollArea
          className={cn(
            'absolute top-0 right-0 bottom-0 left-0 max-h-fit flex-1 rounded-md border bg-white',
            innerClassName
          )}
        >
          {children}
        </ScrollArea>
      </div>
      {footer && (
        <div className={cn(className, 'flex flex-none items-center justify-end px-2 py-2')}>
          {footer}
        </div>
      )}
    </div>
  )
}
