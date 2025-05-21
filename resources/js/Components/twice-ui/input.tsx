import type React from 'react'
import { JollyTextField } from '@/Components/jolly-ui/textfield'
import { useFormChange } from '@/Hooks/use-form-change'

interface InputProps {
  label?: string
  value: number | string | null
  name: string
  className?: string
  autoFocus?: boolean
  hasError?: boolean
  textArea?: boolean
  rows?: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  name,
  textArea = false,
  className = '',
  autoFocus = false,
  hasError = false,
  rows,
  onChange,
  ...props
}: InputProps) => {
  const handleValueChange = useFormChange({
    name,
    onChange
  })

  return (
    <JollyTextField
      onChange={handleValueChange}
      label={label}
      value={value !== null ? String(value) : ''}
      name={name}
      rows={rows}
      autoFocus={autoFocus}
      className={className}
      isInvalid={hasError}
      textArea={textArea}
      {...props}
    />
  )
}
