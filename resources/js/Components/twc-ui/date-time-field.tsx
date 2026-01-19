'use client'

import type { DateValue } from '@internationalized/date'
import type React from 'react'
import {
  type DateFieldProps as AriaDateFieldProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
  type ValidationResult
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { BaseDateField, DateInput } from './date-field'
import { FieldError, Label } from './field'

interface DateTimeFieldProps extends AriaDateFieldProps<DateValue> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  errorComponent?: React.ComponentType<{
    children?: React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  }>
}

const DateTimeField = ({
  label,
  description,
  className,
  errorComponent: ErrorComponent = FieldError,
  value,
  errorMessage,
  onChange,
  isRequired = false,
  ...props
}: DateTimeFieldProps) => {
  const hasError = !!errorMessage

  return (
    <BaseDateField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-2 data-invalid:border-destructive', className)
      )}
      isInvalid={hasError}
      value={value}
      granularity="minute"
      onChange={onChange}
      validationBehavior="native"
      {...props}
    >
      {label && <Label value={label} isRequired={isRequired} />}
      <DateInput />
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <ErrorComponent>{errorMessage}</ErrorComponent>
    </BaseDateField>
  )
}

export { DateTimeField }
export type { DateTimeFieldProps }
