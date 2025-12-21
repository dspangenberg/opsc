import { FormFieldError } from './form-errors'
import { useFormContext } from './form'
import { Select, type SelectProps } from './select'

const FormSelect = <T extends object>({ name, ...props }: SelectProps<T>) => {
  const form = useFormContext()
  const realError = form?.errors?.[name as string]
  return <Select<T> error={realError} name={name} {...props} errorComponent={FormFieldError} />
}

export { FormSelect }
