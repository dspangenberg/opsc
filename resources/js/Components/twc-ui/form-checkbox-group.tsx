import { cn } from '@/Lib/utils'
import { BaseCheckbox, CheckboxGroup, type CheckboxProps } from './checkbox'
import { useFormContext } from './form'
import { FormFieldError, getFormError } from './form-errors'

interface CheckboxGroupProps<T extends object = any> {
  name: string
  label?: string
  description?: string
  items?: T[]
  itemName?: keyof T & string
  itemValue?: keyof T & string
  listClassName?: string
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  onBlur?: () => void
  errorMessage?: string | ((validation: any) => string)
}

export const FormCheckboxGroup = <T extends object>({
  name,
  items = [],
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  listClassName,
  value,
  onChange,
  onBlur,
  ...props
}: CheckboxGroupProps<T>) => {
  const form = useFormContext()
  const errorFromProps = (props as { error?: string }).error
  const error = errorFromProps ?? getFormError(form?.errors, name)

  const itemsArray = Array.from(items)
  const firstItem = itemsArray[0]
  const isStringValue = firstItem && typeof firstItem[itemValue] === 'string'

  const handleChange = (selectedValues: string[]) => {
    if (isStringValue) {
      onChange?.(selectedValues)
    } else {
      const numericValues = selectedValues.map(v => Number(v))
      onChange?.(numericValues)
    }
  }

  const stringValue = value?.map(v => String(v))

  return (
    <CheckboxGroup
      name={name}
      value={stringValue}
      onChange={handleChange}
      onBlur={onBlur}
      {...props}
    >
      <div className={cn('space-y-1.5', listClassName)}>
        {itemsArray.map((item, index) => {
          const textValue =
            typeof item[itemName] === 'string' ? item[itemName] : String(item[itemName])
          const idValue = item[itemValue]
          const stringIdValue = String(idValue)
          return (
            <BaseCheckbox key={stringIdValue || index} value={stringIdValue}>
              {textValue}
            </BaseCheckbox>
          )
        })}
      </div>
      {error && <FormFieldError>{error}</FormFieldError>}
    </CheckboxGroup>
  )
}

export { BaseCheckbox as FormCheckbox }
export type { CheckboxProps as FormCheckboxProps }
