import { ChevronDown, ChevronUp } from 'lucide-react'
import type React from 'react'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import { NumericFormat, type NumericFormatProps } from 'react-number-format'
import { FormInput, Button } from '@dspangenberg/twcui'

export interface NumberInputProps extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
  stepper?: number
  thousandSeparator?: string
  placeholder?: string
  defaultValue?: number
  min?: number
  max?: number
  label?: string
  value?: number // Controlled value
  suffix?: string
  prefix?: string
  onValueChange?: (value: number | undefined) => void
  fixedDecimalScale?: boolean
  decimalScale?: number
}

export const FormNumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      stepper,
      thousandSeparator,
      placeholder,
      defaultValue,
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      onValueChange,
      fixedDecimalScale = false,
      decimalScale = 0,
      suffix,
      label,
      prefix,
      value: controlledValue,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState<number | undefined>(controlledValue ?? defaultValue)

    const handleIncrement = useCallback(() => {
      setValue(prev => (prev === undefined ? (stepper ?? 1) : Math.min(prev + (stepper ?? 1), max)))
    }, [stepper, max])

    const handleDecrement = useCallback(() => {
      setValue(prev =>
        prev === undefined ? -(stepper ?? 1) : Math.max(prev - (stepper ?? 1), min)
      )
    }, [stepper, min])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleIncrement()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleDecrement()
      }
    }, [handleIncrement, handleDecrement])

    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue)
      }
    }, [controlledValue])

    const handleChange = (values: {
      value: string
      floatValue: number | undefined
    }) => {
      const newValue = values.floatValue === undefined ? undefined : values.floatValue
      setValue(newValue)
      if (onValueChange) {
        onValueChange(newValue)
      }
    }

    const handleBlur = () => {
      if (value !== undefined) {
        if (value < min) {
          setValue(min)
          if (ref && 'current' in ref && ref.current) {
            ref.current.value = String(min)
          }
        } else if (value > max) {
          setValue(max)
          if (ref && 'current' in ref && ref.current) {
            ref.current.value = String(max)
          }
        }
      }
    }

    return (
      <div className="flex items-center relative">
        <NumericFormat
          value={value}
          onValueChange={handleChange}
          thousandSeparator={thousandSeparator}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          allowNegative={min < 0}
          valueIsNumericString
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          max={max}
          min={min}
          suffix={suffix}
          prefix={prefix}
          customInput={FormInput}
          placeholder={placeholder}
          className="pe-8 border h-9 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative"
          getInputRef={ref}
          {...props}
        />

        <div className="flex-col hidden right-2 p-1">
          <button
            aria-label="Increase value"
            className="size-4"
            type="button"
            onClick={handleIncrement}
            disabled={value === max}
          >
            <ChevronUp size={15} />
          </button>
          <button
            aria-label="Decrease value"
            className="size-4"
            type="button"
            onClick={handleDecrement}
            disabled={value === min}
          >
            <ChevronDown size={15} />
          </button>
        </div>
      </div>
    )
  }
)
