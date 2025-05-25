import { FormLabel } from './form-label'
import { Input } from '@/Components/ui/input'
import { cn } from '@/Lib/utils'
import type React from 'react'

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  help?: string
  required?: boolean
  passwordRules?: string
  suffix?: ReactNodeOrString
  suffixClassName?: string
}

type ReactNodeOrString = React.ReactNode | string

export const FormInput = ({
  ref,
  type = 'text',
  required = false,
  autoComplete = 'off',
  className = '',
  suffixClassName = '',
  passwordRules = '',
  suffix = '',
  help = '',
  label,
  error,
  ...props
}: FormInputProps & {
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
        <Input
          name={props.id}
          {...props}
          type={type}
          autoComplete={autoComplete}
          data-password-rules={passwordRules}
          className={cn('font-medium text-base rounded-sm shadow-none peer pe-12', suffix ?? 'pe-12', className)}
          aria-invalid={hasError}
        />
        {!!suffix && <div
          className={cn('text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50', suffixClassName)}
        >
          {suffix}
        </div>}
      </div>
      {help && <div className="text-xs font-normal text-gray-600">{help}</div>}
    </div>
  )
}

FormInput.displayName = 'FormInput'
