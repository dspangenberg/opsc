import { useDateTimeConversion } from '@/Hooks/use-date-conversion'
import { FormFieldError } from './form-errors'
import { DateTimeField, type DateTimeFieldProps } from './date-time-field'
import { useFormContext } from './form'

interface FormDateTimeFieldProps extends Omit<DateTimeFieldProps, 'value' | 'onChange'> {
  value?: string | null
  onChange?: (value: string | null) => void
}

const FormDateTimeField = ({ value, onChange, ...props }: FormDateTimeFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]
  const { parsedDateTime, handleChange } = useDateTimeConversion(value, onChange)

  return (
    <DateTimeField
      errorComponent={FormFieldError}
      errorMessage={error}
      value={parsedDateTime}
      onChange={handleChange}
      {...props}
    />
  )
}

export { FormDateTimeField }
export type { FormDateTimeFieldProps }
