import type { DateValue } from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import { useEffect, useRef, useState } from 'react'
import { useDateRangeConversion } from '@/Hooks/use-date-conversion'
import { DateRangePicker, type DateRangePickerProps } from './date-range-picker'
import { useFormContext } from './form'
import { FormFieldError, getFormError } from './form-errors'

interface FormDateRangePickerProps extends Omit<DateRangePickerProps, 'value' | 'onChange'> {
  value?: RangeValue<string> | null
  onChange?: (value: RangeValue<string> | null) => void
  name: string
}

const FormDateRangePicker = ({ value, onChange, ...props }: FormDateRangePickerProps) => {
  const form = useFormContext()
  const error = getFormError(form?.errors, props.name as string | undefined)
  const { parsedDate, handleChange } = useDateRangeConversion(value, onChange)

  // Use internal state to prevent resets during typing
  const [internalValue, setInternalValue] = useState<RangeValue<DateValue> | null>(parsedDate)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update internal value when external value changes (but not while user is typing)
  useEffect(() => {
    // Always reset if value becomes null (from form reset or calendar reset button)
    if (value === null || (value?.start === null && value?.end === null)) {
      setInternalValue(null)
      setIsTyping(false)
      return
    }

    if (!isTyping && parsedDate !== null) {
      setInternalValue(parsedDate)
    }
  }, [value, parsedDate, isTyping])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleInternalChange = (newValue: RangeValue<DateValue> | null) => {
    // If reset (null), handle immediately
    if (newValue === null) {
      setInternalValue(null)
      setIsTyping(false)
      handleChange(null)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      return
    }

    setIsTyping(true)
    setInternalValue(newValue)
    handleChange(newValue)

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Reset typing flag after a short delay
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
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
