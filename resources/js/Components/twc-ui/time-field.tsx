'use client'

import type React from 'react'
import {
  TimeField as AriaTimeField,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue as AriaTimeValue,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
  type ValidationResult
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { DateInput } from './date-field'
import { FieldError, Label } from './field'

const BaseTimeField = AriaTimeField

interface TimeFieldProps<T extends AriaTimeValue> extends AriaTimeFieldProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  errorComponent?: React.ComponentType<{
    children?: React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  }>
}

const TimeField = <T extends AriaTimeValue>({
  label,
  description,
  errorComponent: ErrorComponent = FieldError,
  errorMessage,
  className,
  ...props
}: TimeFieldProps<T>) => {
  const hasError = !!errorMessage

  return (
    <BaseTimeField
      isInvalid={hasError}
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-2', className)
      )}
      {...props}
    >
      <Label value={label} />
      <DateInput />
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <ErrorComponent>{errorMessage}</ErrorComponent>
    </BaseTimeField>
  )
}

export { TimeField, BaseTimeField }
export type { TimeFieldProps }
