/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormLabel } from '@/Components/FormLabel'
import { Input } from '@/Components/ui/input'
import { cn, focusInput, hasErrorInput } from '@/Lib/utils'
import type React from 'react';
import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  help?: string
  hasError: boolean
  required?: boolean
}

export const FormInput = (
  {
    ref,
    type = 'text',
    required = false,
    className = '',
    help = '',
    label,
    error,
    ...props
  }: FormInputProps & {
    ref?: React.RefObject<HTMLInputElement>;
  }
) => {

  const hasError = !!error;

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
        className={cn(error ? [hasErrorInput] : [focusInput])}
      />
      {help && <div className="text-sm font-normal text-gray-600">{help}</div>}
    </div>
  )
}

FormInput.displayName = 'FormInput'
