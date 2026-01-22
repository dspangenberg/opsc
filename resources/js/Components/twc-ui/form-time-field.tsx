import type { TimeValue as AriaTimeValue } from 'react-aria-components'
import { useTimeConversion } from '@/Hooks/use-date-conversion'
import { useFormContext } from './form'
import { FormFieldError, getFormError } from './form-errors'
import { TimeField, type TimeFieldProps } from './time-field'

interface FormTimeFieldProps extends Omit<TimeFieldProps<AriaTimeValue>, 'value' | 'onChange'> {
  value?: string | null
  onChange?: (value: string | null) => void
}

const FormTimeField = ({ value, onChange, ...props }: FormTimeFieldProps) => {
  const form = useFormContext()
  const error = getFormError(form?.errors, props.name as string | undefined)
  const { parsedTime } = useTimeConversion(value, onChange)

  const handleTimeFieldChange = (newValue: AriaTimeValue | null) => {
    if (onChange) {
      onChange(newValue ? newValue.toString() : null)
    }
  }

  return (
    <TimeField
      errorComponent={FormFieldError}
      errorMessage={error}
      value={parsedTime}
      onChange={handleTimeFieldChange}
      {...props}
    />
  )
}

export { FormTimeField }
export type { FormTimeFieldProps }
