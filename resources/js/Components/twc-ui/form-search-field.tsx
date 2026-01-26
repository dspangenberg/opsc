import { useFormContext } from './form'
import { FormFieldError, getFormError } from './form-errors'
import { SearchField, type SearchFieldProps } from './search-field'

const FormSearchField = ({ ...props }: SearchFieldProps) => {
  const form = useFormContext()
  const error = getFormError(form?.errors, props.name as string | undefined)

  return <SearchField errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { FormSearchField }
