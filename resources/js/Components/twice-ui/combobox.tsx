import type React from 'react'
import { ComboboxItem, JollyComboBox } from '@/Components/jolly-ui/combobox'
import { useFormChange } from '@/Hooks/use-form-change'

interface ComboboxProps<T extends Record<string, unknown>> {
  label?: string
  value: number
  name: string
  className?: string
  autoFocus?: boolean
  items: Iterable<T>
  description?: string
  itemName?: keyof T & string
  itemValue?: keyof T & string
  hasError?: boolean
  errors?: Partial<Record<keyof T, string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isOptional?: boolean
  optionalValue?: string
}

export const Combobox = <T extends Record<string, unknown>> ({
  label,
  value,
  name,
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  isOptional = false,
  optionalValue = '(leer)',
  className = '',
  description,
  autoFocus = false,
  hasError = false,
  items,
  errors,
  onChange,
  ...props
}: ComboboxProps<T>) => {
  const handleValueChange = useFormChange({
    name,
    onChange
  })
  const itemsWithNothing = isOptional
    ? [{
      [itemValue]: 0,
      [itemName]: optionalValue
    } as T, ...Array.from(items)]
    : Array.from(items)

  return (
    <JollyComboBox<T>
      onSelectionChange={handleValueChange}
      selectedKey={Number(value)}
      label={label}
      items={itemsWithNothing}
      description={description}
      autoFocus={autoFocus}
      className={className}
      isInvalid={hasError}
      {...props}
    >
      {item => (
        <ComboboxItem id={Number(item[itemValue])}>
          {typeof item[itemName] === 'string' ? item[itemName] : String(item[itemName])}
        </ComboboxItem>
      )}
    </JollyComboBox>
  )
}
