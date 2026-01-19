import type { DateValue } from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import { useEffect, useRef, useState } from 'react'
import { useDateRangeConversion } from '@/Hooks/use-date-conversion'
import { DateRangePicker, type DateRangePickerProps } from './date-range-picker'
import { useFormContext } from './form'
import { FormFieldError } from './form-errors'

interface FormDateRangePickerProps extends Omit<DateRangePickerProps, 'value' | 'onChange'> {
  value?: RangeValue<string> | null
  onChange?: (value: RangeValue<string> | null) => void
  name: string
}

const FormDateRangePicker = ({ value, onChange, ...props }: FormDateRangePickerProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]
  const { parsedDate, handleChange } = useDateRangeConversion(value, onChange)

  // Use internal state to prevent resets during typing
  const [internalValue, setInternalValue] = useState<RangeValue<DateValue> | null>(parsedDate)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)

  // Update internal value when external value changes (but not while user is typing)
  useEffect(() => {
    if (!isTypingRef.current) {
      setInternalValue(parsedDate)
    }
  }, [parsedDate])

  const handleInternalChange = (newValue: RangeValue<DateValue> | null) => {
    isTypingRef.current = true
    setInternalValue(newValue)
    handleChange(newValue)

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Reset typing flag after a short delay
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false
    }, 500)
  }

  return (
    <DateRangePicker
      errorComponent={FormFieldError}
      errorMessage={error}
      value={internalValue}
      onChange={handleInternalChange}
      {...props}
    />
  )
}

export { FormDateRangePicker }
export type { FormDateRangePickerProps }
