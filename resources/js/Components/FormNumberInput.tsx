/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormLabel } from '@/Components/FormLabel'
import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { forwardRef, type InputHTMLAttributes } from 'react'
import { Button, Group, Input, NumberField } from 'react-aria-components'

interface FormNumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  help?: string
  required?: boolean
  value: number
}

export const FormNumberInput = forwardRef<HTMLInputElement, FormNumberInputProps>(
  ({ type = "text", required = false, className = "", help = "", label, error, ...props }, ref) => {
    return (
      <div className="space-y-0.5">

        <NumberField
          defaultValue={props.value}
          formatOptions={{
            style: "currency",
            currency: "EUR",
            currencySign: "accounting",
          }}
        >
          {label && (
            <FormLabel htmlFor={props.name} required={required}>
              {label}:
            </FormLabel>
          )}
          <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
            <Input className="flex-1 bg-background px-3 py-2 tabular-nums text-foreground focus:outline-none" />
            <div className="flex h-[calc(100%+2px)] flex-col">
              <Button
                slot="increment"
                className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronUp size={12} strokeWidth={2}  />
              </Button>
              <Button
                slot="decrement"
                className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronDown size={12} strokeWidth={2} aria-hidden="true" />
              </Button>
            </div>
          </Group>
        </NumberField>
        {help && <div className="text-sm font-normal text-gray-600">{help}</div>}
      </div>
    )
  },
)

FormNumberInput.displayName = "FormNumberInput"
