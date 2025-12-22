import type { TimeValue as AriaTimeValue } from 'react-aria-components'
import { useTimeConversion } from '@/Hooks/use-date-conversion'
import { FormFieldError } from './form-errors'
import { TimeField, type TimeFieldProps } from './time-field'
import { useFormContext } from './form'

interface FormTimeFieldProps extends Omit<TimeFieldProps<AriaTimeValue>, 'value' | 'onChange'> {
  value?: string | null
  onChange?: (value: string | null) => void
}

const FormTimeField = ({ value, onChange, ...props }: FormTimeFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]
  const { parsedTime } = useTimeConversion(value, onChange)

  const handleTimeFieldChange = (newValue: AriaTimeValue | null) => {
    if (onChange) {
      onChange(newValue ? newValue.toString() : null)
    }
  }

  return <TimeField errorComponent={FormFieldError} errorMessage={error} value={parsedTime} onChange={handleTimeFieldChange} {...props} />
}

export { FormTimeField }
export type { FormTimeFieldProps }
