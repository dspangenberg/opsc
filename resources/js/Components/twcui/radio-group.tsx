import type React from 'react'
import { JollyRadioGroup, Radio } from "@/Components/jolly-ui/radio-group"
import { useFormChange } from '@/Hooks/use-form-change'
import { cn } from '@/Lib/utils'

interface RadioGroupProps<T extends Record<string, unknown>> {
  label?: string
  name: string
  className?: string
  autoFocus?: boolean
  items: Iterable<T>
  value: number | string
  itemName?: keyof T & string
  itemValue?: keyof T & string
  hasError?: boolean
  orientation?: 'horizontal' | 'vertical'  // Changed this line
  errors?: Partial<Record<keyof T, string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  selected: number | string
  isOptional?: boolean
  optionalValue?: string
}

export const RadioGroup = <T extends Record<string, unknown>> ({
  label,
  value,
  name,
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  isOptional = false,
  optionalValue = '(leer)',
  orientation = 'vertical',
  className = '',
  autoFocus = false,
  hasError = false,
  items,
  errors,
  onChange,
  ...props
}: RadioGroupProps<T>) => {
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
    <JollyRadioGroup<T>
      onChange={handleValueChange}
      value={String(value)}
      label={label}
      className={cn('font-medium', className)}
      orientation={orientation}
      isInvalid={hasError}
      {...props}
    >
      {Array.from(itemsWithNothing).map(item => (
        <Radio className="text-base" key={String(item[itemValue])} value={String(item[itemValue])} autoFocus={autoFocus}>
          {typeof item[itemName] === 'string' ? item[itemName] : String(item[itemName])}
        </Radio>
      ))}
    </JollyRadioGroup>
  )
}
