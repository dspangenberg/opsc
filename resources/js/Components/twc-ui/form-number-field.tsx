import { FormFieldError } from './form-errors'
import { useFormContext } from './form'
import { NumberField, type NumberFieldProps } from './number-field'

const FormNumberField = ({ ...props }: NumberFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]

  return <NumberField errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { FormNumberField }
