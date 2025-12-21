import { useCallback } from 'react'
import type { ValidationResult } from 'react-aria-components'
import { FormFieldError } from './form-errors'
import { useFormContext } from './form'
import { RadioGroup, type RadioGroupProps } from './radio-group'

const useRadioGroupChange = (
  onChange?: ((value: string | number | null) => void) | ((value: string) => void)
) => {
  return useCallback(
    (selectedValue: string) => {
      if (onChange) {
        const numericValue =
          selectedValue === 'null'
            ? null
            : !Number.isNaN(Number(selectedValue))
              ? Number(selectedValue)
              : selectedValue
        onChange(numericValue as string & (string | number | null))
      }
    },
    [onChange]
  )
}

interface FormRadioGroupProps<T extends Record<string, unknown>>
  extends Omit<RadioGroupProps<T>, 'onChange'> {
  onChange?: ((value: string | number | null) => void) | ((value: string) => void)
}

const FormRadioGroup = <T extends Record<string, unknown>>({
  onChange,
  ...props
}: FormRadioGroupProps<T>) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]
  const handleChange = useRadioGroupChange(onChange)

  return (
    <RadioGroup
      errorComponent={FormFieldError}
      errorMessage={error}
      onChange={handleChange}
      {...props}
    />
  )
}

export { FormRadioGroup }
export type { FormRadioGroupProps }
