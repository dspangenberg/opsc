import type React from 'react'
import { Checkbox as JollyCheckbox } from "@/Components/jolly-ui/checkbox"
import { cn } from '@/Lib/utils'

interface CheckBoxProps {
  label?: string
  name: string
  className?: string
  autoFocus?: boolean
  hasError?: boolean
  isIndeterminate?: boolean
  isSelected?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  checked?: boolean
  children?: React.ReactNode
}

export const Checkbox = ({
  label,
  name,
  className = '',
  autoFocus = false,
  hasError = false,
  isSelected = false,
  isIndeterminate = false,
  onChange,
  checked,
  children,
  ...props
}: CheckBoxProps) => {
  const handleChange = (isSelected: boolean) => {
    console.log('checkbox change', isSelected);
    // Create a synthetic event
    const syntheticEvent = {
      target: {
        name,
        checked: isSelected,
        type: 'checkbox',
        value: isSelected.toString()
      },
      currentTarget: {
        name,
        checked: isSelected,
        type: 'checkbox',
        value: isSelected.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <JollyCheckbox
      onChange={handleChange}
      isSelected={isSelected}
      isIndeterminate={isIndeterminate}
      className={className}
      isInvalid={hasError}
    >
      {children || label}
    </JollyCheckbox>
  )
}
