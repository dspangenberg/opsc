/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  ColorPicker,
  ColorPickerHue,
  ColorPickerSelection,
} from '@/Components/ui/kibo-ui/color-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { colors as tailwindColors } from '@/Lib/tailwind-colors'
import { cn } from '@/Lib/utils'
import Color from 'color'
import type { ColorLike } from 'color'
import type React from 'react'
import { useCallback, useState } from 'react'

type ColorPickerProps = {
  value: string
  onChange: (color: string) => void
  className: string
}

const colors500 = Object.keys(tailwindColors).filter(key => key.includes('-500'))
const colors: string[] = []

for (const [key, value] of Object.entries(tailwindColors)) {
  if (colors500.includes(key)) {
    colors.push(value)
  }
}

export const FormColorPicker: React.FC<ColorPickerProps> = ({ value, className, onChange }) => {
  const [color, setColor] = useState<string>(value)

  const handleColorChange = useCallback((newColor: ColorLike) => {
    try {
      const colorInstance = Color(newColor)
      const hexColor = colorInstance.hex()
      if (hexColor !== color) {
        // setColor(hexColor)
        // onChange(hexColor)
      }
    } catch (error) {
      console.error('Invalid color input:', error)
    }
  }, [onChange])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>, colorValue: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      // handleColorChange(colorValue)
      console.log('Selected color:', colorValue)
      onChange(colorValue)
    }
  }, [onChange])

  const handleOnClick = useCallback((colorValue: string) => {
    console.log('Selected color:', colorValue)
    setColor(colorValue)
    onChange(colorValue)
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          style={{ backgroundColor: color }}
          className={cn('h-5 w-5 rounded-md mr-2 border border-stone-200', className)}
        />
      </PopoverTrigger>
      <PopoverContent className="space-y-4 w-full max-w-[300px] gap-4 items-center flex justify-center flex-col">
        <ColorPicker
          className="w-full max-w-[300px] rounded-md bg-background"
          value={color}
          defaultValue={color}
          onChange={handleColorChange}
        >
          <ColorPickerSelection />
          <div className="flex items-center gap-4">
            <div className="w-full grid gap-1">
              <ColorPickerHue />
            </div>
          </div>
        </ColorPicker>
        <div className="flex items-center gap-1 flex-wrap">
          {colors.map((colorValue) => (
            <div
              key={colorValue}
              className="size-5 rounded-md border cursor-pointer"
              style={{ backgroundColor: colorValue }}
              onClick={() => handleOnClick(colorValue)}
              onKeyDown={(e) => handleKeyDown(e, colorValue)}
              role="button"
              tabIndex={0}
              aria-label={`Select color ${colorValue}`}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
