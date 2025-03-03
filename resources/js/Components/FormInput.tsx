/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormLabel } from '@/Components/FormLabel'
import { Input } from '@/Components/ui/input'
import { cn, focusInput, hasErrorInput } from '@/Lib/utils'
import React, { forwardRef, type InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  help?: string
  required?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ type = 'text', required = false, className = '', help = '', label, error, ...props }, ref) => {
    return (
      <div className="space-y-0.5">
        {label && (
          <FormLabel htmlFor={props.name} required={required}>
            {label}:
          </FormLabel>
        )}
        <Input
          ref={ref}
          name={props.id}
          {...props}
          type={type}
          hasError={!!error}
          className={cn(error ? [hasErrorInput] : [focusInput])}
        />
        {help && <div className="text-sm font-normal text-gray-600">{help}</div>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
