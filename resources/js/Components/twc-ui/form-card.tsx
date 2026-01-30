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
    <div className={cn(className, 'flex h-full flex-1 flex-col overflow-hidden')}>
      <div className="relative flex max-h-fit flex-1 flex-col gap-1.5 overflow-hidden rounded-lg border border-border/80 bg-page-content p-1.5">
        <ScrollArea
          className={cn(
            'flex-1 min-h-0 rounded-md border bg-background',
            innerClassName
          )}
        >
          {children}
        </ScrollArea>
        {footer && (
          <div className={cn(className, 'flex w-full flex-none items-center justify-end')}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
