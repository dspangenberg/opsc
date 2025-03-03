/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Label } from '@/Components/ui/label'
import { cn } from '@/Lib/utils'
import React, { type LabelHTMLAttributes, type ReactNode } from 'react'

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  value?: string
  children?: ReactNode
  required?: boolean
  className?: string
}

export function FormLabel({
  value,
  children,
  className,
  required = false,
  ...props
}: FormLabelProps) {
  return (
    <Label {...props} className={cn('font-normal text text-base leading-none', className)}>
      {value ?? children}
      {required && <span className="pl-0.5 text-red-600">*</span>}
    </Label>
  )
}
