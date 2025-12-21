import type { DateValue } from '@internationalized/date'
import type React from 'react'
import {
  type DateFieldProps as AriaDateFieldProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
  type ValidationResult
} from 'react-aria-components'
import { useDateTimeConversion } from '@/Hooks/use-date-conversion'
import { cn } from '@/Lib/utils'
import { BaseDateField, DateInput } from './date-field'
import { FieldError, FormFieldError, Label } from './field'
import { useFormContext } from './form'

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
      <Label value={label} />
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

interface FormDateTimeFieldProps extends Omit<DateTimeFieldProps, 'value' | 'onChange'> {
  value?: string | null
  onChange?: (value: string | null) => void
}

const FormDateTimeField = ({ value, onChange, ...props }: FormDateTimeFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]
  const { parsedDateTime, handleChange } = useDateTimeConversion(value, onChange)

  return (
    <DateTimeField
      errorComponent={FormFieldError}
      errorMessage={error}
      value={parsedDateTime}
      onChange={handleChange}
      {...props}
    />
  )
}

export { DateTimeField, FormDateTimeField }
export type { DateTimeFieldProps, FormDateTimeFieldProps }
