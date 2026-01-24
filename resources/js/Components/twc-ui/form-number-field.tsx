import { FormFieldError, getFormError } from './form-errors'
import { useFormContext } from './form'
import { NumberField, type NumberFieldProps } from './number-field'

const FormNumberField = ({ ...props }: NumberFieldProps) => {
  const form = useFormContext()
  const error = getFormError(form?.errors, props.name as string | undefined)

  return <NumberField errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { FormNumberField }
