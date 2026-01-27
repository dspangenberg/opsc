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
      <div className="relative flex max-h-fit flex-1 flex-col overflow-hidden rounded-lg border border-border/80 bg-page-content p-1.5">
        <ScrollArea
          className={cn(
            'absolute top-0 right-0 bottom-0 left-0 max-h-fit flex-1 overflow-scroll rounded-md border bg-background',
            innerClassName
          )}
        >
          {children}
        </ScrollArea>
        {footer && (
          <div className={cn(className, 'mt-1.5 flex w-full flex-none items-center justify-end')}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
