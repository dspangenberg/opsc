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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  name,
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

  return (
    <JollyNumberField
      label={label}
      value={value || 0}
      isInvalid={hasError}
      onChange={handleValueChange}
      {...props}
    />
  )
}
