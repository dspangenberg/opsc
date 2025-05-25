import { FormLabel } from '.'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@/Components/ui/kibo-ui/combobox'

import type { FormSelect } from '.'

import { cn } from '@/Lib/utils'
import type React from 'react'
import { useFormChange } from '@/Hooks/use-form-change'

type SelectProps = React.ComponentPropsWithoutRef<typeof FormSelect>

export interface FormComboBoxProps<T extends Record<string, unknown>>
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

export const FormCombobox = <T extends Record<string, unknown>>({
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
}: FormComboBoxProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }) => {

  const handleValueChange = useFormChange({
    name,
    onChange
  })

  type ComboboxData = {
    label: string;
    value: string;
  };

  const items: ComboboxData[] = options.map((option) => ({
    label: String(option[itemName]),
    value: String(option[itemValue]),
  }))



  return (
    <div className="space-y-1">
      {label && (
        <FormLabel htmlFor={id} required={required}>
          {label}:
        </FormLabel>
      )}
      <Combobox
        data={items}
        type="item"
        value={String(value)}
        onOpenChange={(open) => console.log('Combobox is open?', open)}
        onValueChange={value => handleValueChange(value)}
      >
        <ComboboxTrigger />
        <ComboboxContent className="isolate pointer-events-auto z-50">
          <ComboboxInput className="focus-visible:outline-0" />
          <ComboboxEmpty />
          <ComboboxList>
            <ComboboxGroup>
              {items.map((item) => (
                <ComboboxItem key={item.value} value={item.value}>
                  {item.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error && <div className="text-sm font-normal text-red-600">{error}</div>}
    </div>
  )
}

FormCombobox.displayName = 'FormCombobox'
