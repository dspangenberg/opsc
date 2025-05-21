import type React from 'react'
import { JollySelect, SelectItem } from '@/Components/jolly-ui/select'
import { useFormChange } from '@/Hooks/use-form-change'

interface SelectProps<T extends Record<string, unknown>> {
  label?: string
  value: number
  name: string
  className?: string
  autoFocus?: boolean
  items: Iterable<T>
  itemName?: keyof T & string
  itemValue?: keyof T & string
  hasError?: boolean
  errors?: Partial<Record<keyof T, string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isOptional?: boolean
  optionalValue?: string
}

export const Select = <T extends Record<string, unknown>> ({
  label,
  value,
  name,
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  isOptional = false,
  optionalValue = '(leer)',
  className = '',
  autoFocus = false,
  hasError = false,
  items,
  errors,
  onChange,
  ...props
}: SelectProps<T>) => {
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
    <JollySelect<T>
      onSelectionChange={handleValueChange}
      selectedKey={Number(value)}
      label={label}
      items={itemsWithNothing}
      autoFocus={autoFocus}
      className={className}
      isInvalid={hasError}
      {...props}
    >
      {item => (
        <SelectItem id={Number(item[itemValue])}>
          {typeof item[itemName] === 'string' ? item[itemName] : String(item[itemName])}
        </SelectItem>
      )}
    </JollySelect>
  )
}
