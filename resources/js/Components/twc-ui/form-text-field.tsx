import { useFormContext } from './form'
import { FormFieldError, getFormError } from './form-errors'
import { TextField, type TextFieldProps } from './text-field'

const FormTextField = ({ ...props }: TextFieldProps) => {
  const form = useFormContext()
  const errorFromProps = (props as { error?: string }).error
  const error = errorFromProps ?? getFormError(form?.errors, props.name as string | undefined)

  return <TextField errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { FormTextField }
