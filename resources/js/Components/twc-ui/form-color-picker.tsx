import { ColorSwatchPicker, type ColorSwatchPickerProps } from './color-swatch-picker'
import { useFormContext } from './form'
import { FormFieldError, getFormError } from './form-errors'

interface FormColorPickerProps extends Omit<ColorSwatchPickerProps, 'value' | 'onChange'> {
  value?: string | null
  onChange?: (value: string) => void
}

const FormColorPicker = ({ value, onChange, ...props }: FormColorPickerProps) => {
  const form = useFormContext()
  const error = getFormError(form?.errors, props.name as string | undefined)
  const errorFromProps = (props as { errorMessage?: string | undefined }).errorMessage
  const resolvedError = errorFromProps ?? error

  return (
    <ColorSwatchPicker
      errorComponent={FormFieldError}
      errorMessage={resolvedError}
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}

export type { FormColorPickerProps }
export { FormColorPicker }
