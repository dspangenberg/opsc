import { FormFieldError } from './form-errors'
import { useFormContext } from './form'
import { TextArea, type TextAreaProps } from './text-area'

const FormTextArea = ({ ...props }: TextAreaProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]

  return <TextArea errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { FormTextArea }
