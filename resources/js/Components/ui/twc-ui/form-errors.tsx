import { Sad01Icon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { useMemo } from 'react'
import { cn } from '@/Lib/utils'
import { Icon } from './icon'

interface Props {
  errors: Partial<Record<string, string>>
  title?: string
  showErrors?: boolean
}

export const FormErrors: React.FC<Props> = ({
  errors,
  showErrors = true,
  title = 'Oobs! Something went wrong:'
}) => {
  const errorMessages = useMemo(() => {
    if (!errors) return []
    return Object.values(errors)
  }, [errors])

  if (errorMessages.length === 0) {
    return null
  }

  return (

    <div
      className="mx-4 mb-6 rounded-lg border border-destructive/50 bg-destructive/5 p-4 pt-2 text-destructive"
      role="alert"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <div className="flex-none">
            <div
              className={cn(
                'mx-auto flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/20 sm:mx-0 sm:size-8'
              )}
            >
              <Icon
                icon={Sad01Icon}
                className={cn('size-5 stroke-3 text-destructive')}
              />
            </div>
          </div>
          <div className="flex-1 font-medium text-base">{title}</div>
        </div>
        {showErrors && (
          <div className="grow space-y-1 pt-2">
            <ul
              className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md list-inside list-disc pl-12 text-sm opacity-80"
            >
              {errorMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    
  )
}
