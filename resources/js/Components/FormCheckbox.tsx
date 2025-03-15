/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Checkbox } from '@/Components/ui/checkbox'
import { Label } from '@/Components/ui/label'
import type { CheckboxProps } from '@radix-ui/react-checkbox'
import React, { forwardRef } from 'react'

interface FormCheckboxProps extends Omit<CheckboxProps, 'ref'> {
  label?: string
  id: string
  className?: string
}

export const FormCheckbox = forwardRef<HTMLButtonElement, FormCheckboxProps>(
  (
    {
      label,
      id,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex items-center gap-2 ">
        <Checkbox
          id={id}
          name={id}
          {...props}
          className={`text-base font-normal ${className}`}
        />
        {label && (
          <Label htmlFor={id} className="text-base font-normal text-black" ref={undefined}>
            {label}
          </Label>
        )}
      </div>
    )
  }
)

FormCheckbox.displayName = 'FormCheckbox'