/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormLabel } from '@/Components/FormLabel'
import { RadioGroup, RadioGroupItem, type RadioGroupProps } from '@/Components/ui/radio-group'
import React from 'react'

export interface Option<T> {
  id: T
  name: string
}

export interface Props<T> extends Omit<RadioGroupProps<T>, 'value' | 'onValueChange'> {
  options: Option<T>[]
  value: T
  onValueChange: (value: T) => void
}

export const FormRadioGroup = <T,>({ options, value, onValueChange, ...props }: Props<T>) => {
  return (
    <RadioGroup value={value} onValueChange={onValueChange} {...props}>
      {options.map(option => (
        <div key={String(option.id)} className="flex items-center space-x-2">
          <RadioGroupItem value={option.id} id={String(option.id)} />
          <FormLabel className="text-base" htmlFor={String(option.id)}>
            {option.name}
          </FormLabel>
        </div>
      ))}
    </RadioGroup>
  )
}
