import { FormFieldError, getFormError } from './form-errors'
import { useFormContext } from './form'
import { Select, type SelectProps } from './select'

const FormSelect = <T extends object>({ name, ...props }: SelectProps<T>) => {
  const form = useFormContext()
  const errorFromProps = (props as { error?: string }).error
  const error = errorFromProps ?? getFormError(form?.errors, name as string | undefined)
  return <Select<T> error={error} name={name} {...props} errorComponent={FormFieldError} />
}

export { FormSelect }
