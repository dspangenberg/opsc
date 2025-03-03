/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormColorPicker } from '@/Components/FormColorPicker'
import { FormInput } from '@/Components/FormInput'
import type React from 'react'
import { useState } from 'react'
import { useCallback } from 'react'

type FormInputColorPickerProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
}

export const FormInputColorPicker: React.FC<FormInputColorPickerProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  className
}) => {


  const [color, setColor] = useState<string>(value)

   const handleColorChange = (color: string) => {
     console.log('Color changed:', color)
     setColor(color.toUpperCase())
   }

  return (
    <div className="space-y-2">
      <div className="relative">
        <FormInput
          id={id}
          className={`pe-9 ${className}`}
          value={color}
          label={label}
          error={error}
          onChange={(e) => onChange(e.target.value)}
        />
        <FormColorPicker
          className="absolute inset-y-2 top-[34px] end-0 flex size-5 items-center justify-center text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          value={color}
          onChange={(color: string) => handleColorChange(color)}
        />
      </div>
    </div>
  )
}
