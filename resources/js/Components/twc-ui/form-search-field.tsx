import { FormFieldError } from './form-errors'
import { useFormContext } from './form'
import { SearchField, type SearchFieldProps } from './search-field'

const FormSearchField = ({ ...props }: SearchFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]

  return <SearchField errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { FormSearchField }
