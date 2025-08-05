import { cn } from '@/Lib/utils'
import { CalendarDateTime, type DateValue } from '@internationalized/date'
import type { VariantProps } from 'class-variance-authority'
import { format, parse } from 'date-fns'
import { useCallback, useMemo } from 'react'
import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  DateSegment as AriaDateSegment,
  type DateSegmentProps as AriaDateSegmentProps,
  type ValidationResult as AriaValidationResult,
  Text,
  composeRenderProps
} from 'react-aria-components'
import { FieldError, Label, fieldGroupVariants } from './field'
import { useFormContext } from './form'

const BaseDateField = AriaDateField

const DateSegment = ({ className, ...props }: AriaDateSegmentProps) => (
  <AriaDateSegment
    className={composeRenderProps(className, className =>
      cn(
        'inline rounded p-0.5 type-literal:px-0 caret-transparent outline-0',
        /* Placeholder */
        'data-[placeholder]:text-muted-foreground ',
        /* Disabled */
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        /* Focused */
        'data-[placeholder]:data-[focused]:text-white data-[focused]:bg-primary data-[focused]:text-white',
        className
      )
    )}
    {...props}
  />
)

interface DateInputProps extends AriaDateInputProps, VariantProps<typeof fieldGroupVariants> {
  isInvalid?: boolean
}

const DATE_FORMAT = import.meta.env.VITE_APP_DATE_TIME_FORMAT || 'yyyy-MM-dd HH:mm'
const TIMEZONE = import.meta.env.VITE_TIMEZONE || 'UTC'

const DateInput = ({
  className,
  isInvalid,
  variant,
  ...props
}: Omit<DateInputProps, 'children'>) => (
  <AriaDateInput
    className={composeRenderProps(className, className =>
      cn(fieldGroupVariants({ variant }), 'text-sm', className)
    )}
    {...props}
  >
    {segment => <DateSegment segment={segment} />}
  </AriaDateInput>
)

// Helper function to convert DateValue to JavaScript Date
const dateValueToDate = (dateValue: DateValue): Date => {
  const hasTime = 'hour' in dateValue && 'minute' in dateValue
  if (hasTime) {
    return new Date(
      dateValue.year,
      dateValue.month - 1,
      dateValue.day,
      dateValue.hour,
      dateValue.minute
    )
  }
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day)
}

interface DateTimeFieldProps extends Omit<AriaDateFieldProps<DateValue>, 'value' | 'onChange'> {
  label?: string
  description?: string
  value?: string | null
  onChange?: (value: string | null) => void
  error?: string | ((validation: AriaValidationResult) => string)
}

const DateTimeField = ({
  label,
  description,
  className,
  value,
  onChange,
  isRequired = false,
  ...props
}: DateTimeFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string] || props.error
  const hasError = !!error

  const parsedDate = useMemo((): DateValue | null => {
    if (!value) return null

    try {
      const date = parse(value, DATE_FORMAT, new Date())
      if (Number.isNaN(date.getTime())) return null

      // Für DateTime mit Minuten-Granularität verwenden wir CalendarDateTime
      return new CalendarDateTime(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes()
      )
    } catch {
      return null
    }
  }, [value])

  // Convert DateValue to string
  const handleChange = useCallback(
    (newValue: DateValue | null) => {
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
    },
    [onChange]
  )

  return (
    <BaseDateField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-2 data-[invalid]:border-destructive', className)
      )}
      isInvalid={hasError}
      value={parsedDate}
      granularity="minute"
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

export { DateTimeField }
export type { DateInputProps, DateTimeFieldProps }
