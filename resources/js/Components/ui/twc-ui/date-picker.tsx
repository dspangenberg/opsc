import { Calendar04Icon, MultiplicationSignIcon } from '@hugeicons/core-free-icons'
import { CalendarDate, type DateValue } from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import { format, isValid, parse, parseISO } from 'date-fns'
import React from 'react'
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  type PopoverProps as AriaPopoverProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  DatePickerStateContext,
  DateRangePickerStateContext,
  Text
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { Button } from './button'
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  RangeCalendar
} from './calendar'
import { DateInput } from './date-field'
import { FieldError, FieldGroup, Label } from './field'
import { useFormContext } from './form'
import { Icon } from './icon'
import { Popover } from './popover'

const BaseDatePicker = AriaDatePicker
const BaseDateRangePicker = AriaDateRangePicker

// Constants from date-field.tsx for consistency
const DATE_FORMAT = import.meta.env.VITE_APP_DATE_FORMAT || 'yyyy-MM-dd'

// Helper function to convert DateValue avaScript Date (same as in date-field.tsx)
const dateValueToDate = (dateValue: DateValue): Date => {
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day)
}

// Hilfsfunktion zum Parsen verschiedener Datumsformate
const parseToDateValue = (dateString: string): DateValue | null => {
  if (!dateString) return null

  try {
    let date: Date | null = null

    // Versuche zuerst ISO-Format (yyyy-MM-dd)
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = parseISO(dateString)
    } else {
      // Versuche das konfigurierte Format
      date = parse(dateString, DATE_FORMAT, new Date())
    }

    if (date && isValid(date)) {
      return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
    }
  } catch (error) {
    console.warn('Fehler beim Parsen des Datums:', dateString, error)
  }

  return null
}

const DatePickerContent = ({
  className,
  popoverClassName,
  ...props
}: AriaDialogProps & { popoverClassName?: AriaPopoverProps['className'] }) => (
  <Popover
    className={composeRenderProps(popoverClassName, className => cn('w-auto p-3', className))}
  >
    <AriaDialog
      className={cn(
        'pointer-events-auto z-[100] flex w-full flex-col space-y-4 outline-none sm:flex-row sm:space-x-4 sm:space-y-0',
        className
      )}
      {...props}
    />
  </Popover>
)

const DatePickerClearButton = () => {
  const state = React.useContext(DatePickerStateContext)
  if (!state || !state.value) return null
  return (
    <Button
      slot={null}
      variant="ghost"
      size="icon"
      className="size-6 flex-none data-[focus-visible]:ring-offset-0"
      onPress={() => state.setValue(null)}
    >
      <Icon icon={MultiplicationSignIcon} className="size-4" />
    </Button>
  )
}

const DateRangePickerClearButton = () => {
  const state = React.useContext(DateRangePickerStateContext)

  return (
    <Button
      slot={null}
      variant="ghost"
      aria-label="Clear"
      size="icon"
      className="size-6 flex-none data-[focus-visible]:ring-offset-0"
      onPress={() => state?.setValue(null)}
    >
      <Icon icon={MultiplicationSignIcon} className="size-4" />
    </Button>
  )
}

// DatePicker - orientiert an DateField
interface DatePickerProps extends Omit<AriaDatePickerProps<DateValue>, 'value' | 'onChange'> {
  label?: string
  description?: string
  value?: string | null
  onChange?: (value: string | null) => void
  error?: string | ((validation: AriaValidationResult) => string)
}

const DatePicker = ({
  label,
  description,
  className,
  value,
  onChange,
  isRequired = false,
  ...props
}: DatePickerProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string] || props.error
  const hasError = !!error

  const parsedDate = React.useMemo((): DateValue | null => {
    return parseToDateValue(value || '')
  }, [value])

  // Convert DateValue to string (same logic as DateField)
  const handleChange = React.useCallback(
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
    <BaseDatePicker
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      value={parsedDate}
      onChange={handleChange}
      validationBehavior="native"
      {...props}
    >
      <Label value={label} />
      <FieldGroup className="!pr-1 gap-0 px-3 data-[invalid]:focus-visible:border-destructive data-[invalid]:focus-visible:ring-destructive/20">
        <DateInput variant="ghost" className="flex-1" />
        <DatePickerClearButton />
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 data-[focus-visible]:ring-offset-0"
        >
          <Icon icon={Calendar04Icon} className="size-4" />
        </Button>
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{error}</FieldError>
      <DatePickerContent>
        <Calendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {day => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>{date => <CalendarCell date={date} />}</CalendarGridBody>
          </CalendarGrid>
        </Calendar>
      </DatePickerContent>
    </BaseDatePicker>
  )
}

// DateRangePicker - vereinfacht
interface DateRangePickerProps
  extends Omit<AriaDateRangePickerProps<DateValue>, 'value' | 'onChange'> {
  label?: string
  description?: string
  value?: RangeValue<string> | null
  onChange?: (value: RangeValue<string> | null) => void
  error?: string | ((validation: AriaValidationResult) => string)
  name?: string
}

const DateRangePicker = ({
  label,
  description,
  className,
  value,
  onChange,
  isRequired = false,
  ...props
}: DateRangePickerProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string] || props.error
  const hasError = !!error

  const parsedDate = React.useMemo((): RangeValue<DateValue> | null => {
    if (!value?.start || !value.end) {
      return null
    }

    try {
      const startDateValue = parseToDateValue(value.start)
      const endDateValue = parseToDateValue(value.end)

      if (!startDateValue || !endDateValue) return null

      return {
        start: startDateValue,
        end: endDateValue
      }
    } catch (error) {
      console.warn('DateRangePicker: Fehler beim Parsen:', error)
      return null
    }
  }, [value?.start, value?.end])

  // Convert RangeValue<DateValue> to RangeValue<string>
  const handleChange = React.useCallback(
    (newValue: RangeValue<DateValue> | null) => {
      if (!onChange) return

      if (!newValue?.start || !newValue.end) {
        onChange(null)
        return
      }

      try {
        const startDate = dateValueToDate(newValue.start)
        const endDate = dateValueToDate(newValue.end)

        // Formatiere immer zu yyyy-MM-dd für die registerDateRange-Funktion
        const formattedRange = {
          start: format(startDate, 'yyyy-MM-dd'),
          end: format(endDate, 'yyyy-MM-dd')
        }

        onChange(formattedRange)
      } catch (error) {
        console.warn('DateRangePicker: Fehler beim Formatieren:', error)
        onChange(null)
      }
    },
    [onChange]
  )

  return (
    <BaseDateRangePicker
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      value={parsedDate}
      onChange={handleChange}
      validationBehavior="native"
      {...props}
    >
      <Label value={label} />
      <FieldGroup className="gap-2 px-3">
        <div className="flex flex-1 items-center justify-start gap-1">
          <DateInput className="flex-1" variant="ghost" slot={'start'} />
          <span aria-hidden className="flex-auto text-center text-base text-muted-foreground">
            -
          </span>
          <DateInput className="flex-auto" variant="ghost" slot={'end'} />
        </div>

        <div className="flex flex-none items-center justify-end gap-1">
          <DateRangePickerClearButton />
          <Button variant="ghost" size="icon" className="size-6 data-[focus-visible]:ring-offset-0">
            <Icon icon={Calendar04Icon} className="size-4" />
          </Button>
        </div>
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{error}</FieldError>
      <DatePickerContent popoverClassName="min-h-[360px]">
        <RangeCalendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {day => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>{date => <CalendarCell date={date} />}</CalendarGridBody>
          </CalendarGrid>
        </RangeCalendar>
      </DatePickerContent>
    </BaseDateRangePicker>
  )
}

// Hilfsfunktion für manuelle DateRange-Handler (für Kompatibilität)
export const createDateRangeChangeHandler = (
  updateFunction: (name: string, value: any) => void,
  startFieldName: string,
  endFieldName: string
) => {
  return (rangeValue: RangeValue<string> | null) => {
    if (rangeValue) {
      // Konvertiere von yyyy-MM-dd zum konfigurierten Format
      let startFormatted: string
      let endFormatted: string

      if (DATE_FORMAT === 'yyyy-MM-dd') {
        startFormatted = rangeValue.start
        endFormatted = rangeValue.end
      } else {
        const startDate = parseISO(rangeValue.start)
        const endDate = parseISO(rangeValue.end)

        startFormatted = format(startDate, DATE_FORMAT)
        endFormatted = format(endDate, DATE_FORMAT)
      }

      updateFunction(startFieldName, startFormatted)
      updateFunction(endFieldName, endFormatted)
    } else {
      updateFunction(startFieldName, null)
      updateFunction(endFieldName, null)
    }
  }
}

export { DatePicker, DateRangePicker, BaseDatePicker, BaseDateRangePicker }
export type { DatePickerProps, DateRangePickerProps }
