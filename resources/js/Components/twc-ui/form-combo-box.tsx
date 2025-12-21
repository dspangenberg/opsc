import { FormFieldError } from './form-errors'
import { useFormContext } from './form'
import { ComboBox, type ComboBoxProps } from './combo-box'

const FormComboBox = <T extends Record<string, unknown>>({ ...props }: ComboBoxProps<T>) => {
  const form = useFormContext()
  const realError = form?.errors?.[props.name]
  return <ComboBox<T> error={realError} {...props} errorComponent={FormFieldError} />
}

export { FormComboBox }
