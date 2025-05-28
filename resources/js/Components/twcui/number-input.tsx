import type React from 'react'

import { useFormChange } from '@/Hooks/use-form-change'
import type { NumberFieldProps } from 'react-aria-components'
import { JollyNumberField } from '@/Components/jolly-ui/numberfield'

interface NumberInputProps extends Omit<NumberFieldProps, 'value' | 'onChange'> {
  label?: string
  value: number | null
  name: string
  className?: string
  autoFocus?: boolean
  hasError?: boolean
  formatOptions?: Intl.NumberFormatOptions;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const defaultFormatOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'EUR'
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  name,
  formatOptions,
  className = '',
  autoFocus = false,
  hasError = false,
  onChange,
  ...props
}: NumberInputProps) => {
  const handleValueChange = useFormChange({
    name,
    onChange
  })

  if (formatOptions === undefined) {
    formatOptions = defaultFormatOptions;
  }

  return (
    <JollyNumberField
      autoFocus={autoFocus}
      label={label}
      value={value || 0}
      formatOptions={formatOptions}
      isInvalid={hasError}
      onChange={handleValueChange}
      {...props}
    />
  )
}
