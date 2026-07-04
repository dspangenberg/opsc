import type React from 'react'
import { cn } from '@/Lib/utils'

interface FormLayoutGroupProps {
  border?: boolean
  cols?: 6 | 12 | 24
  fullWidth?: boolean
  grid?: boolean
  margin?: boolean
  title?: string
  className?: string
  action?: React.ReactNode
  description?: React.ReactNode | string
  titleClass?: string
  children?: React.ReactNode
}

export const FormGrid: React.FC<FormLayoutGroupProps> = ({
  border = false,
  cols = 24,
  fullWidth = true,
  action = null,
  description = undefined,
  grid = true,
  margin = true,
  title = '',
  className = '',
  titleClass = 'font-medium text-sm text-black pt-4 pb-3',
  children
}) => {
  const gridCols = {
    6: 'grid-cols-6',
    12: 'grid-cols-12',
    24: 'grid-cols-24'
  }[cols]

  return (
    <div className="flex-1">
      {title !== '' && (
        <div className="flex flex-1 flex-col border-b py-0">
          <div className={cn('flex items-center px-4', titleClass)}>
            <div className="flex-1">{title}</div>
            <div className="flex-none">{action}</div>
          </div>
          {description && (
            <div className="-mt-1 flex-1 px-4 pb-2 text-foreground/60 text-xs">{description}</div>
          )}
        </div>
      )}
      <div
        className={cn(
          'flex-1 px-4 pt-4 last:mb-3',
          border ? 'border/50 mx-0 mt-4 mb-4 border-t' : '',
          grid ? 'm-0 grid gap-x-3 gap-y-6 px-4 py-2' : '',
          margin ? 'mt-3' : 'not-first:mt-2',
          grid ? gridCols : '',
          fullWidth ? 'w-full' : '',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
