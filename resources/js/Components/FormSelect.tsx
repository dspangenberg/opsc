import { FormLabel } from '@/Components/FormLabel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import { cn, focusInput, hasErrorInput } from '@/Lib/utils'
import type React from 'react'
import { forwardRef } from 'react'

export interface Option<T> {
  value: T
  label: string
}

type SelectProps = React.ComponentPropsWithoutRef<typeof Select>

export interface FormSelectProps<T extends React.Key> extends Omit<SelectProps, 'children' | 'value' | 'onValueChange' | 'defaultValue'> {
  label?: string
  value: T
  options: Option<T>[]
  required?: boolean
  className?: string
  defaultValue?: T
  placeholder?: string
  onValueChange: (value: T) => void
  error?: string
  id?: string
}

const FormSelectInner = <T extends React.Key>(
  {
    label,
    options,
    error,
    required = false,
    className = '',
    placeholder = '(Bitte auswählen)',
    id,
    onValueChange,
    value,
    defaultValue,
    ...selectProps
  }: FormSelectProps<T>,
  ref: React.Ref<HTMLButtonElement>
) => {
  return (
    <div className="space-y-1">
      {label && (
        <FormLabel htmlFor={id} required={required}>
          {label}:
        </FormLabel>
      )}
      <Select 
        onValueChange={(newValue: string) => onValueChange(newValue as unknown as T)} 
        value={value?.toString()}
        defaultValue={defaultValue?.toString()}
        {...selectProps}
      >
        <SelectTrigger ref={ref} className={cn(error ? [hasErrorInput] : [focusInput], className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value.toString()} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const FormSelect = forwardRef(FormSelectInner) as <T extends React.Key>(
  props: FormSelectProps<T> & React.RefAttributes<HTMLButtonElement>
) => React.ReactElement
