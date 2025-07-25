"use client"

import { CalendarDate, type DateValue } from '@internationalized/date'
import type { VariantProps } from "class-variance-authority"
import { format, parse } from 'date-fns'
import React, { useCallback, useMemo } from "react"
import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  DateSegment as AriaDateSegment,
  type DateSegmentProps as AriaDateSegmentProps,
  TimeField as AriaTimeField,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue as AriaTimeValue,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
} from "react-aria-components"
import { cn } from "@/Lib/utils"
import { FieldError, fieldGroupVariants, Label } from "./field"
import { useFormContext } from './form'

const BaseDateField = AriaDateField
const BaseTimeField = AriaTimeField

const DateSegment = ({ className, ...props }: AriaDateSegmentProps) => (
  <AriaDateSegment
    className={composeRenderProps(className, (className) =>
      cn(
        'inline rounded p-0.5 type-literal:px-0 caret-transparent outline-0',
        /* Placeholder */
        "data-[placeholder]:text-muted-foreground ",
        /* Disabled */
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        /* Focused */
        "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
        className
      )
    )}
    {...props}
  />
)

interface DateInputProps
  extends AriaDateInputProps,
    VariantProps<typeof fieldGroupVariants> {
  isInvalid?: boolean
}

const DATE_FORMAT = import.meta.env.VITE_APP_DATE_FORMAT || 'yyyy-MM-dd'
const TIMEZONE = import.meta.env.VITE_TIMEZONE || 'UTC'

const DateInput = ({
  className,
  isInvalid,
  variant,
  ...props
}: Omit<DateInputProps, "children">) => (
  <AriaDateInput
    className={composeRenderProps(className, (className) =>
      cn(fieldGroupVariants({ variant }), "text-sm", className)
    )}
    {...props}
  >
    {(segment) => <DateSegment segment={segment} />}
  </AriaDateInput>
)

// Helper function to convert DateValue to JavaScript Date
const dateValueToDate = (dateValue: DateValue): Date => {
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day)
}

interface DateFieldProps extends Omit<AriaDateFieldProps<DateValue>, 'value' | 'onChange'> {
  label?: string
  description?: string
  value?: string | null
  onChange?: (value: string | null) => void
  error?: string | ((validation: AriaValidationResult) => string)
}

const DateField = ({
  label,
  description,
  className,
  value,
  onChange,
  isRequired = false,
  ...props
}: DateFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string] || props.error
  const hasError = !!error

  const parsedDate = useMemo((): DateValue | null => {
    if (!value) return null

    try {
      const date = parse(value, DATE_FORMAT, new Date())
      if (Number.isNaN(date.getTime())) return null
      return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
    } catch {
      return null
    }
  }, [value])

  // Convert DateValue to string
  const handleChange = useCallback((newValue: DateValue | null) => {
    if (!onChange) return

    if (!newValue) {
      onChange(null)
      return
    }

    try {
      const jsDate = dateValueToDate(newValue)
      const formattedDate = format(jsDate, DATE_FORMAT)
      onChange(formattedDate)
    } catch {
      onChange(null)
    }
  }, [onChange])

  return (
    <BaseDateField
      className={composeRenderProps(className, (className) =>
        cn('group flex flex-col gap-2 data-[invalid]:border-destructive', className)
      )}
      isInvalid={hasError}
      value={parsedDate}
      onChange={handleChange}
      validationBehavior="native"
      {...props}
    >
      <Label value={label} />
      <DateInput />
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{error}</FieldError>
    </BaseDateField>
  )
}

interface TimeFieldProps<T extends AriaTimeValue>
  extends AriaTimeFieldProps<T> {
  label?: string
  description?: string
  error?: string | ((validation: AriaValidationResult) => string)
}

const TimeField = <T extends AriaTimeValue>({
  label,
  description,
  error,
  className,
  ...props
}: TimeFieldProps<T>) => {
  const form = useFormContext()
  const realError = form?.errors?.[props.name as string] || error
  const hasError = !!realError

  return (
    <BaseTimeField
      isInvalid={hasError}
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className)
      )}
      {...props}
    >
      <Label value={label} />
      <DateInput />
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{realError}</FieldError>
    </BaseTimeField>
  )
}

export {
  DateField,
  DateSegment,
  DateInput,
  BaseTimeField,
  BaseDateField,
  TimeField,
}
export type { DateInputProps, DateFieldProps, TimeFieldProps }
