import type React from 'react'
import type { Key } from 'react-aria-components';
import { ComboboxItem,  JollyComboBox } from '@/Components/jolly-ui/combobox'
import { useFormChange } from '@/Hooks/use-form-change'
import {useFilter} from 'react-aria'
import { useMemo, useState, useCallback } from 'react'

interface ComboboxProps<T extends Record<string, unknown>> {
  label?: string
  value: number
  name: string
  className?: string
  autoFocus?: boolean
  items: T[],
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
  const formChange = useFormChange({ name, onChange });

  const handleValueChange = useCallback((key: Key | null) => {
    let adjustedValue: number;
    if (key === null) {
      adjustedValue = 0;
    } else if (typeof key === 'string') {
      adjustedValue = Number.parseInt(key, 10) || 0;
    } else {
      adjustedValue = key;
    }

    formChange(adjustedValue);
  }, [formChange]);

  const itemsWithPlaceholder = useMemo(() =>
    isOptional
      ? [...Array.from(items),{
        [itemValue]: -1,
        [itemName]: optionalValue
      } as T]
      : Array.from(items),
    [isOptional, itemValue, itemName, optionalValue, items]
  );

  const { contains } = useFilter({ sensitivity: 'base' });
  const [filterValue, setFilterValue] = useState('');
  const filteredItems: T[] = useMemo(
    () => itemsWithPlaceholder.filter((item) => contains(String(item[itemName]), filterValue)),
    [itemsWithPlaceholder, itemName, contains, filterValue]
  );

  return (
    <JollyComboBox<T>
      onSelectionChange={handleValueChange}
      selectedKey={value}
      label={label}
      items={filteredItems}
      description={description}
      autoFocus={autoFocus}
      onInputChange={setFilterValue}
      className={className}
      isInvalid={hasError}
      {...props}
    >
        {item => (
          <ComboboxItem id={Number(item[itemValue])}>
            {String(item[itemName])}
          </ComboboxItem>
        )}
    </JollyComboBox>
  )
}
