/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Checkbox } from '@/Components/ui/checkbox'
import { Label } from '@/Components/ui/label'
import type React from 'react'

type FormInputProps = Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, 'ref'> & {
  label?: string
  id: string
  className?: string
}

export const FormCheckbox = (
  {
    ref,
    label,
    value,
    ...props
  }: FormInputProps & {
    ref: React.RefObject<HTMLButtonElement>;
  }
) => {
  return (
    <div className="flex items-center gap-2 ">
      <Checkbox
        ref={ref}
        name={props.id}
        value={value}
        {...props}
        className={`text-base font-normal ${props.className}`}
      />
      {label && (
        <Label className="text-base font-normal text-black" htmlFor={props.id}>
          {label}
        </Label>
      )}
    </div>
  )
}

FormCheckbox.displayName = 'FormCheckbox'
