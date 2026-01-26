import { useDateConversion } from '@/Hooks/use-date-conversion'
import { DatePicker, type DatePickerProps } from './date-picker'
import { useFormContext } from './form'
import { FormFieldError, getFormError } from './form-errors'

interface FormDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  value?: string | null
  onChange?: (value: string | null) => void
}

const FormDatePicker = ({ value, onChange, ...props }: FormDatePickerProps) => {
  const form = useFormContext()
  const error = getFormError(form?.errors, props.name as string | undefined)
  const { parsedDate, handleChange } = useDateConversion(value, onChange)

  return (
    <DatePicker
      errorComponent={FormFieldError}
      errorMessage={error}
      value={parsedDate}
      onChange={handleChange}
      {...props}
    />
  )
}

export { FormDatePicker }
export type { FormDatePickerProps }
