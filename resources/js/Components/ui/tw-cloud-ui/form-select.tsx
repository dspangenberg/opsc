import { FormLabel } from '.'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { cn } from '@/Lib/utils'
import type React from 'react'
import { useFormChange } from '@/Hooks/use-form-change'

type SelectProps = React.ComponentPropsWithoutRef<typeof Select>

export interface FormSelectProps<T extends Record<string, unknown>>
  extends Omit<SelectProps, 'children' | 'value' | 'onValueChange' | 'defaultValue'> {
  label?: string
  value: string | number
  options: ReadonlyArray<T>
  required?: boolean
  className?: string
  itemName?: keyof T & string
  itemValue?: keyof T & string
  name: string
  autofocus?: boolean
  placeholder?: string
  error?: string
  id?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FormSelect = <T extends Record<string, unknown>>({
  label,
  value,
  options,
  required,
  className,
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  name,
  autofocus,
  placeholder,
  error,
  id,
  onChange,
  ref,
  ...selectProps
}: FormSelectProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }) => {

  const handleValueChange = useFormChange({
    name,
    onChange
  })

  return (
    <div className="space-y-1">
      {label && (
        <FormLabel htmlFor={id} required={required}>
          {label}:
        </FormLabel>
      )}
      <Select
        onValueChange={handleValueChange}
        aria-invalid={!!error}
        value={String(value)}
        {...selectProps}
      >
        <SelectTrigger
          ref={ref}
          className={cn(
            'font-medium  w-full text-base rounded-sm shadow-none ',
            className
          )}
        >
          <SelectValue
            placeholder={placeholder}
            className={cn(' w-full text-base rounded-sm shadow-none', className)}
          />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option, index) => (
            <SelectItem key={index} value={String(option[itemValue])}>
              {typeof option[itemName] === 'string' ? option[itemName] : String(option[itemName])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <div className="text-sm font-normal text-red-600">{error}</div>}
    </div>
  )
}

FormSelect.displayName = 'FormSelect'
