import { FormFieldError } from './form-errors'
import { useFormContext } from './form'
import { TextField, type TextFieldProps } from './text-field'

const FormTextField = ({ ...props }: TextFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]

  return <TextField errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { FormTextField }
