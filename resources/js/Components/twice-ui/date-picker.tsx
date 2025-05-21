import type React from 'react'
import { type ChangeEvent, useEffect, useState } from 'react'
import { format, parse } from 'date-fns'
import { CalendarDate } from '@internationalized/date'
import { JollyDatePicker, JollyDateRangePicker } from '@/Components/jolly-ui/date-picker'
import type { DateRange } from 'react-aria-components'

// DatePicker interfaces and functions
interface DatePickerProps<T extends Record<string, unknown>> {
  label?: string
  value: string | null
  name: string
  className?: string
  autoFocus?: boolean
  hasError?: boolean
  errors?: Partial<Record<keyof T, string>>
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function createDateChangeHandler<T>(
  updateAndValidateWithoutEvent: <K extends keyof T>(field: K, value: T[K]) => void,
  field: keyof T
) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    updateAndValidateWithoutEvent(field, value as any)
  }
}

const joinErrors = <T extends Record<string, unknown>>(
  errors?: Partial<Record<keyof T, string>>
): string => {
  if (!errors) return ''
  const errorMessages = Object.values(errors) as string[];
  return errorMessages.join(', ');
};

export const DatePicker = <T extends Record<string, unknown>>({
  label,
  value,
  name,
  className = '',
  autoFocus = false,
  hasError = false,
  errors,
  onChange,
  ...props
}: DatePickerProps<T>) => {
  const [parsedDate, setParsedDate] = useState<CalendarDate | null>(() => {
    if (value) {
      const date = parse(value, 'dd.MM.yyyy', new Date())
      return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
    }
    return null
  })

  const handleDateChange = (date: CalendarDate | null) => {
    const formattedDate = date ? format(date.toDate('Europe/Berlin'), 'dd.MM.yyyy') : null

    const syntheticEvent = {
      target: {
        name,
        value: formattedDate,
        type: 'date',
        checked: false,
      },
      currentTarget: {
        name,
        value: formattedDate,
        type: 'date',
        checked: false,
      },
    } as ChangeEvent<HTMLInputElement>

    onChange(syntheticEvent)
  }

  useEffect(() => {
    if (value) {
      const date = parse(value, 'dd.MM.yyyy', new Date())
      setParsedDate(new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate()))
    } else {
      setParsedDate(null)
    }
  }, [value])

  return (
    <JollyDatePicker
      autoFocus={autoFocus}
      errorMessage={joinErrors<T>(errors)}
      label={label}
      isInvalid={hasError}
      value={parsedDate}
      className={className}
      onChange={handleDateChange}
      {...props}
    />
  )
}

// DateRangePicker interfaces and functions
interface DateRangePickerProps<T extends Record<string, unknown>> {
  label?: string;
  value: {
    start: string | null;
    end: string | null;
  } | null;
  name: string;
  className?: string;
  autoFocus?: boolean;
  hasError?: boolean;
  errors?: Partial<Record<keyof T, string>>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function createDateRangeChangeHandler<T>(
  updateAndValidateWithoutEvent: <K extends keyof T>(field: K, value: T[K]) => void,
  beginField: keyof T,
  endField: keyof T
) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value === null) {
      updateAndValidateWithoutEvent(beginField, null as any)
      updateAndValidateWithoutEvent(endField, null as any)
    } else {
      try {
        const { start, end } = JSON.parse(value)
        updateAndValidateWithoutEvent(beginField, start as any)
        updateAndValidateWithoutEvent(endField, end as any)
      } catch (error) {
        updateAndValidateWithoutEvent(beginField, null as any)
        updateAndValidateWithoutEvent(endField, null as any)
      }
    }
  }
}

export const DateRangePicker = <T extends Record<string, unknown>>({
  label,
  value,
  name,
  className = '',
  autoFocus = false,
  hasError = false,
  errors,
  onChange,
  ...props
}: DateRangePickerProps<T>) => {
  const [parsedDate, setParsedDate] = useState<DateRange | null>(() => {
    if (value?.start && value.end) {
      const dateStart = parse(value.start, 'dd.MM.yyyy', new Date())
      const dateEnd = parse(value.end, 'dd.MM.yyyy', new Date())

      return {
        start: new CalendarDate(dateStart.getFullYear(), dateStart.getMonth() + 1, dateStart.getDate()),
        end: new CalendarDate(dateEnd.getFullYear(), dateEnd.getMonth() + 1, dateEnd.getDate())
      }
    }
    return null
  })

  const handleDateChange = (date: DateRange | null) => {
    let newDate = null
    if (date?.start && date.end) {
      const dateStart = format(date.start.toDate('Europe/Berlin'), 'dd.MM.yyyy')
      const dateEnd = format(date.end.toDate('Europe/Berlin'), 'dd.MM.yyyy')
      newDate = {
        start: dateStart,
        end: dateEnd
      }
    }

    const syntheticEvent = {
      target: {
        name,
        value: JSON.stringify(newDate),
        type: 'text',
        checked: false
      },
      currentTarget: {
        name,
        value: JSON.stringify(newDate),
        type: 'text',
        checked: false
      }
    } as ChangeEvent<HTMLInputElement>

    onChange(syntheticEvent)
  }

  useEffect(() => {
    if (value?.start && value.end) {
      const dateStart = parse(value.start, 'dd.MM.yyyy', new Date())
      const dateEnd = parse(value.end, 'dd.MM.yyyy', new Date())
      setParsedDate({
        start: new CalendarDate(dateStart.getFullYear(), dateStart.getMonth() + 1, dateStart.getDate()),
        end: new CalendarDate(dateEnd.getFullYear(), dateEnd.getMonth() + 1, dateEnd.getDate())
      })
    } else {
      setParsedDate(null)
    }
  }, [value])

  return (
    <JollyDateRangePicker
      autoFocus={autoFocus}
      errorMessage={joinErrors<T>(errors)}
      label={label}
      isInvalid={hasError}
      value={parsedDate}
      className={className}
      onChange={handleDateChange}
      {...props}
    />
  )
}
