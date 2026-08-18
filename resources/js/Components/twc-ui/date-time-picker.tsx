import { Calendar04Icon } from '@hugeicons/core-free-icons'
import { type DateValue, Time } from '@internationalized/date'
import type React from 'react'
import { useCallback, useRef, useState } from 'react'
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
import { TimeField } from './time-field'

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
  showTime?: boolean
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
  showTime = true,
  errorComponent: ErrorComponent = FieldError,
  ...props
}: DateTimePickerProps) => {
  const hasError = !!errorMessage

  const getInitialTime = (): Time => {
    if (value && 'hour' in value) {
      return new Time(value.hour, value.minute, value.second ?? 0)
    }
    return new Time(0, 0, 0)
  }

  const timeRef = useRef<Time>(getInitialTime())
  const [timeDisplay, setTimeDisplay] = useState<Time>(getInitialTime)

  const handleDateChange = useCallback((date: DateValue | null) => {
    if (!date) {
      onChange?.(null)
      return
    }
    if (showTime) {
      const t = timeRef.current
      const combined = date.set({ hour: t.hour, minute: t.minute, second: t.second })
      onChange?.(combined)
    } else {
      onChange?.(date)
    }
  }, [onChange, showTime])

  const handleTimeChange = useCallback((time: Time | null) => {
    if (!time) return
    timeRef.current = time
    setTimeDisplay(time)
  }, [])

  const handlePopoverClose = useCallback(() => {
    if (!value || !showTime) return
    const t = timeRef.current
    const combined = value.set({ hour: t.hour, minute: t.minute, second: t.second })
    onChange?.(combined)
  }, [value, showTime, onChange])

  return (
    <BaseDateTimePicker
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      value={value}
      onChange={handleDateChange}
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
      <DateTimePickerContent
        popoverClassName="min-h-fit"
        slot="dialog"
        onDismiss={handlePopoverClose}
      >
        <Calendar
          className="p-0"
          maxYears={maxYears}
          footerButtons={footerButtons}
          onChange={handleDateChange}
        />
        {showTime && (
          <div className="flex flex-col items-center justify-center border-l border-border pl-4">
            <TimeField
              value={timeDisplay}
              onChange={handleTimeChange}
              granularity="minute"
            />
          </div>
        )}
      </DateTimePickerContent>
    </BaseDateTimePicker>
  )
}

export { DateTimePicker, BaseDateTimePicker, DateTimePickerContent }
export type { DateTimePickerProps }
