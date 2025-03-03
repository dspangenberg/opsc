/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { RadioGroup } from '@/Components/ui/radio-group'
import type * as React from 'react'

interface Props<T> {
  value: T
  defaultValue: T
  children: React.ReactNode
  onValueChange?: (value: T) => void
}

export const AccommodationTypeGroup = <T,>({
  value,
  children,
  defaultValue,
  onValueChange
}: Props<T>) => {
  return (
    <RadioGroup<T>
      className="gap-2"
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      {children}
    </RadioGroup>
  )
}
