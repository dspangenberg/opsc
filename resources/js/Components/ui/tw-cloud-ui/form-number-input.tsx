import { Button, } from '@dspangenberg/twcui'
import { FormInput } from '.'
import { FormLabel } from '.'
import { cn } from '@/Lib/utils'
import type React from 'react'
import { useId, useRef } from 'react'
import { type AriaNumberFieldProps, useLocale, useNumberField } from 'react-aria'
import { useNumberFieldState } from 'react-stately'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

export interface FormNumberInputProps extends AriaNumberFieldProps {
  label?: string
  error?: string
  help?: string
  name: string
  hideButtons?: boolean
  required?: boolean
  formatOptions?: Intl.NumberFormatOptions
  className?: string
}

export const FormNumberInput = ({
  required = false,
  help = '',
  label,
  hideButtons = true,
  className,
  error,
  ...props
}: FormNumberInputProps) => {
  const { locale } = useLocale()

  const inputRef = useRef<HTMLInputElement>(null)
  const labelId = useId()

  const state = useNumberFieldState({
    ...props,
    locale
  })

  const hasError = !!error
  const {
    inputProps
  } = useNumberField(
    {
      ...props,
      'aria-labelledby': labelId
    },
    state,
    inputRef
  )

  const handleIncrement = () => {
    state.increment()
  }

  const handleDecrement = () => {
    state.decrement()
  }

  return (
    <div className="space-y-2">
      {label && (
        <FormLabel htmlFor={props.name} id={labelId} required={required}>
          {label}:
        </FormLabel>
      )}
      <FormInput
        name={props.id}
        error={error}
        {...inputProps}
        className={cn('font-medium text-base rounded-sm shadow-none', className)}
        aria-invalid={hasError}
        suffixClassName="absolute top-0 bottom-0 w-7 border-0 right-0 w-7 border-l pointer-events-auto p-0.5 divide-y divide-border-accent items-center flex flex-col"
        suffix={
          !hideButtons ? (
            <>
              <Button
                variant="ghost"
                size="icon-xs"
                className="max-h-4 w-5 hover:bg-transparent active:bg-transparent !border-0 border-b active-border-transparent active-border-transparent focus:outline-none focus:ring-0"
                tabIndex={-1}
                onClick={handleIncrement}
              >
                <ChevronUpIcon className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                tabIndex={-1}
                className="max-h-4 w-5 hover:bg-transparent active:bg-transparent !border-0 border-b active-border-transparent active-border-transparent focus:outline-none focus:ring-0"
                onClick={handleDecrement}
              >
                <ChevronDownIcon className="size-3.5" />
              </Button>
            </>
          ) : null
        }
      />
      {help && <div className="text-xs font-normal text-gray-600">{help}</div>}
    </div>
  )
}

FormNumberInput.displayName = 'FormNumberInput'
