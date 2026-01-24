import { ComboBox, type ComboBoxProps } from './combo-box'
import { useFormContext } from './form'
import { FormFieldError, getFormError } from './form-errors'

const FormComboBox = <T extends Record<string, unknown>>({ ...props }: ComboBoxProps<T>) => {
  const form = useFormContext()
  const errorFromProps = (props as { error?: string }).error
  const error = errorFromProps ?? getFormError(form?.errors, props.name as string | undefined)
  return <ComboBox<T> error={error} {...props} errorComponent={FormFieldError} />
}

export { FormComboBox }
