import type { RangeValue } from '@react-types/shared'
import { useDateRangeConversion } from '@/Hooks/use-date-conversion'
import { FormFieldError } from './form-errors'
import { DateRangePicker, type DateRangePickerProps } from './date-range-picker'
import { useFormContext } from './form'

interface FormDateRangePickerProps extends Omit<DateRangePickerProps, 'value' | 'onChange'> {
  value?: RangeValue<string> | null
  onChange?: (value: RangeValue<string> | null) => void
  name: string
}

const FormDateRangePicker = ({ value, onChange, ...props }: FormDateRangePickerProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]
  const { parsedDate, handleChange } = useDateRangeConversion(value, onChange)

  return (
    <DateRangePicker
      errorComponent={FormFieldError}
      errorMessage={error}
      value={parsedDate}
      onChange={handleChange}
      {...props}
    />
  )
}

export { FormDateRangePicker }
export type { FormDateRangePickerProps }
