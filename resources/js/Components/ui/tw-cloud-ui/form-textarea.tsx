import { FormLabel } from './form-label'
import { Textarea } from '@/Components/ui/textarea'
import { cn } from '@/Lib/utils'
import type React from 'react'

export interface FormTextareaProps extends React.ComponentProps<'textarea'> {
  label?: string
  error?: string
  help?: string
  required?: boolean
  rows?: number
}

export const FormTextarea = ({
  ref,
  required = false,
  className = '',
  help = '',
  rows = 3,
  label,
  error,
  ...props
}: FormTextareaProps & {
  ref?: React.RefObject<HTMLInputElement>
}) => {
  const hasError = !!error

  return (
    <div className="space-y-2">
      {label && (
        <FormLabel htmlFor={props.name} required={required}>
          {label}:
        </FormLabel>
      )}
      <div className="relative">
        <Textarea
          ref={ref}
          rows={rows}
          {...props}
          className={cn('font-medium text-base rounded-sm shadow-none', className)}
          aria-invalid={hasError}
        />
      </div>
      {help && <div className="text-xs font-normal text-gray-600">{help}</div>}
    </div>
  )
}

FormTextarea.displayName = 'FormTextArea'
