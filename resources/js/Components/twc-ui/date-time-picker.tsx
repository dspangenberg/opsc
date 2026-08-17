import { Calendar04Icon } from '@hugeicons/core-free-icons'
import type { DateValue } from '@internationalized/date'
import type React from 'react'
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DialogProps as AriaDialogProps,
  type PopoverProps as AriaPopoverProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Dialog,
  Text,
  type ValidationResult
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { Button } from './button'
import { Calendar, type FooterButtons } from './calendar'
import { DateInput } from './date-field'
import { FieldError, FieldGroup, Label } from './field'
import { Popover } from './popover'

const BaseDateTimePicker = AriaDatePicker

const DateTimePickerContent = ({
  className,
  popoverClassName,
  ...props
}: AriaDialogProps & { popoverClassName?: AriaPopoverProps['className'] }) => (
  <Popover
    className={composeRenderProps(popoverClassName, className => cn('w-auto p-3', className))}
  >
    <Dialog
      className={cn(
        'pointer-events-auto z-100 flex h-auto w-full flex-col space-y-2 outline-none sm:flex-row sm:space-x-4 sm:space-y-0',
        className
      )}
      {...props}
    />
  </Popover>
)

interface DateTimePickerProps extends AriaDatePickerProps<DateValue> {
  label?: string
  description?: string
  maxYears?: number
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  errorComponent?: React.ComponentType<{
    children?: React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  }>
  footerButtons?: FooterButtons
  isRequired?: boolean
}

const DateTimePicker = ({
  label,
  description,
  className,
  value,
  maxYears = 100,
  footerButtons,
  errorMessage,
  onChange,
  isRequired = false,
  errorComponent: ErrorComponent = FieldError,
  ...props
}: DateTimePickerProps) => {
  const hasError = !!errorMessage

  return (
    <BaseDateTimePicker
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      value={value}
      onChange={onChange}
      granularity="minute"
      isRequired={isRequired}
      validationBehavior="native"
      {...props}
    >
      <Label value={label} isRequired={isRequired} />
      <FieldGroup className="gap-0 px-3 pr-1! data-invalid:focus-visible:border-destructive data-invalid:focus-visible:ring-destructive/20">
        <DateInput variant="ghost" className="flex-1" />
        <Button
          variant="ghost"
          size="icon-sm"
          icon={Calendar04Icon}
          className="mr-1 size-6 data-focus-visible:ring-offset-0"
        />
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <ErrorComponent>{errorMessage}</ErrorComponent>
      <DateTimePickerContent popoverClassName="min-h-fit" slot="dialog">
        <Calendar
          className="p-0"
          maxYears={maxYears}
          footerButtons={footerButtons}
          onChange={onChange}
        />
      </DateTimePickerContent>
    </BaseDateTimePicker>
  )
}

export { DateTimePicker, BaseDateTimePicker, DateTimePickerContent }
export type { DateTimePickerProps }
