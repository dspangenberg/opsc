import {
  CalendarDate,
  CalendarDateTime,
  type DateValue,
  Time
} from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import { format, parse } from 'date-fns'
import { useCallback, useMemo } from 'react'

export const DATE_FORMAT = import.meta.env.VITE_APP_DATE_FORMAT || 'yyyy-MM-dd'
export const TIME_FORMAT = import.meta.env.VITE_APP_TIME_FORMAT || 'HH:mm:ss'
export const DATE_TIME_FORMAT = import.meta.env.VITE_APP_DATE_TIME_FORMAT || 'yyyy-MM-dd HH:mm'

export const dateValueToDate = (dateValue: DateValue): Date => {
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

interface UseDateConversionReturn {
  parsedDate: DateValue | null
  handleChange: (newValue: DateValue | null) => void
}

export function useDateConversion(
  value: string | null | undefined,
  onChange?: (value: string | null) => void
): UseDateConversionReturn {
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

  return { parsedDate, handleChange }
}

interface UseDateTimeConversionReturn {
  parsedDateTime: DateValue | null
  handleChange: (newValue: DateValue | null) => void
}

export function useDateTimeConversion(
  value: string | null | undefined,
  onChange?: (value: string | null) => void
): UseDateTimeConversionReturn {
  const parsedDateTime = useMemo((): DateValue | null => {
    if (!value) return null

    try {
      const date = parse(value, DATE_TIME_FORMAT, new Date())
      if (Number.isNaN(date.getTime())) return null

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

  const handleChange = useCallback(
    (newValue: DateValue | null) => {
      if (!onChange) return

      if (!newValue) {
        onChange(null)
        return
      }

      try {
        const jsDate = dateValueToDate(newValue)
        const formattedDateTime = format(jsDate, DATE_TIME_FORMAT)
        onChange(formattedDateTime)
      } catch {
        onChange(null)
      }
    },
    [onChange]
  )

  return { parsedDateTime, handleChange }
}

interface UseTimeConversionReturn {
  parsedTime: Time | null
  handleChange: (newValue: Time | null) => void
}

export function useTimeConversion(
  value: string | null | undefined,
  onChange?: (value: string | null) => void
): UseTimeConversionReturn {
  const parsedTime = useMemo((): Time | null => {
    if (!value) return null

    try {
      const date = parse(value, TIME_FORMAT, new Date())
      if (Number.isNaN(date.getTime())) return null
      return new Time(date.getHours(), date.getMinutes(), date.getSeconds())
    } catch {
      return null
    }
  }, [value])

  const handleChange = useCallback(
    (newValue: Time | null) => {
      if (!onChange) return

      if (!newValue) {
        onChange(null)
        return
      }

      try {
        const jsDate = new Date(2000, 0, 1, newValue.hour, newValue.minute, newValue.second)
        const formattedTime = format(jsDate, TIME_FORMAT)
        onChange(formattedTime)
      } catch {
        onChange(null)
      }
    },
    [onChange]
  )

  return { parsedTime, handleChange }
}

interface UseDateRangeConversionReturn {
  parsedDate: RangeValue<DateValue> | null
  handleChange: (newValue: RangeValue<DateValue> | null) => void
}

export function useDateRangeConversion(
  value: RangeValue<string> | null | undefined,
  onChange?: (value: RangeValue<string> | null) => void
): UseDateRangeConversionReturn {
  const parsedDate = useMemo((): RangeValue<DateValue> | null => {
    if (!value?.start || !value.end) return null

    try {
      const startDate = parse(value.start, DATE_FORMAT, new Date())
      const endDate = parse(value.end, DATE_FORMAT, new Date())

      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null

      return {
        start: new CalendarDate(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate()
        ),
        end: new CalendarDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate())
      }
    } catch {
      return null
    }
  }, [value?.start, value?.end])

  const handleChange = useCallback(
    (newValue: RangeValue<DateValue> | null) => {
      if (!onChange) return

      if (!newValue?.start || !newValue.end) {
        onChange(null)
        return
      }

      try {
        const startDate = dateValueToDate(newValue.start)
        const endDate = dateValueToDate(newValue.end)
        const formattedRange = {
          start: format(startDate, DATE_FORMAT),
          end: format(endDate, DATE_FORMAT)
        }
        onChange(formattedRange)
      } catch {
        onChange(null)
      }
    },
    [onChange]
  )

  return { parsedDate, handleChange }
}
