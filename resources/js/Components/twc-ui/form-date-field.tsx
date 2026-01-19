import { useDateConversion } from '@/Hooks/use-date-conversion'
import { DateField, type DateFieldProps } from './date-field'
import { useFormContext } from './form'
import { FormFieldError } from './form-errors'

interface FormDateFieldProps extends Omit<DateFieldProps, 'value' | 'onChange'> {
  value?: string | null
  onChange?: (value: string | null) => void
}

const FormDateField = ({ value, onChange, ...props }: FormDateFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]
  const { parsedDate, handleChange } = useDateConversion(value, onChange)

  return (
    <DateField
      errorComponent={FormFieldError}
      errorMessage={error}
      value={parsedDate}
      onChange={handleChange}
      {...props}
    />
  )
}

export { FormDateField }
export type { FormDateFieldProps }
