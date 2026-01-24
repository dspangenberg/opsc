import { FormFieldError, getFormError } from './form-errors'
import { useFormContext } from './form'
import { TextArea, type TextAreaProps } from './text-area'

const FormTextArea = ({ ...props }: TextAreaProps) => {
  const form = useFormContext()
  const errorFromProps = (props as { error?: string }).error
  const error = errorFromProps ?? getFormError(form?.errors, props.name as string | undefined)

  return <TextArea errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { FormTextArea }
