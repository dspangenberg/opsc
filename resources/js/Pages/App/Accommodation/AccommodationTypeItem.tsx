/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Label } from '@/Components/ui/label'
import { RadioGroupItem } from '@/Components/ui/radio-group'
import type * as React from 'react'

interface Props<T> {
  value: T
  title: string
  description: string
}

export const AccommodationTypeItem = <T,>({ value, title, description }: Props<T>) => {
  return (
    <div className="relative flex w-full items-start rounded-lg border border-input px-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
      <RadioGroupItem
        value={value as number}
        id="radio-08-r1"
        aria-describedby="radio-08-r1-description"
        className="order-1 after:absolute after:inset-0"
      />
      <div className="grid grow">
        <Label className="text-base font-medium" htmlFor="radio-08-r1">
          {title}
        </Label>
        <p
          id="radio-08-r1-description"
          className="text-sm font-normal hyphens-auto text-muted-foreground"
        >
          {description}
        </p>
      </div>
    </div>
  )
}
