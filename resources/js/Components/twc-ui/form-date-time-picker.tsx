import { useDateTimeConversion } from '@/Hooks/use-date-conversion'
import { DateTimePicker, type DateTimePickerProps } from './date-time-picker'
import { useFormContext } from './form'
import { FormFieldError, getFormError } from './form-errors'

interface FormDateTimePickerProps extends Omit<DateTimePickerProps, 'value' | 'onChange'> {
  value?: string | null
  onChange?: (value: string | null) => void
}

const FormDateTimePicker = ({ value, onChange, ...props }: FormDateTimePickerProps) => {
  const form = useFormContext()
  const error = getFormError(form?.errors, props.name as string | undefined)
  const { parsedDateTime, handleChange } = useDateTimeConversion(value, onChange)

  return (
    <DateTimePicker
      errorComponent={FormFieldError}
      errorMessage={error}
      value={parsedDateTime}
      onChange={handleChange}
      {...props}
    />
  )
}

export { FormDateTimePicker }
export type { FormDateTimePickerProps }
