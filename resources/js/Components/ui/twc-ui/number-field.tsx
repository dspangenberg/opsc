import { ChevronDown, ChevronUp } from 'lucide-react'
import type * as React from 'react'
import {
  type ButtonProps as AriaButtonProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
  composeRenderProps,
  Text
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { Button } from './button'
import { FieldError, FieldGroup, Label } from './field'
import { useFormContext } from './form'

const BaseNumberField = AriaNumberField

const defaultFormatOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'EUR'
}

const NumberFieldInput = ({ className, ...props }: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'mr-2 w-fit min-w-0 flex-1 border-0 border-transparent bg-background pr-4 pl-0 text-right text-sm outline-0 placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden',
          className
        )
      )}
      onFocus={event => event.target.select()}
      {...props}
    />
  )
}

const NumberFieldSteppers = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div className={cn('absolute right-0 flex h-full flex-col border-l', className)} {...props}>
      <NumberFieldStepper slot="increment">
        <ChevronUp aria-hidden className="size-4" />
      </NumberFieldStepper>
      <div className="border-b" />
      <NumberFieldStepper slot="decrement">
        <ChevronDown aria-hidden className="size-4" />
      </NumberFieldStepper>
    </div>
  )
}

const NumberFieldStepper = ({ className, ...props }: AriaButtonProps) => {
  return (
    <Button
      className={composeRenderProps(className, className =>
        cn('w-auto grow rounded-none px-0.5 text-muted-foreground', className)
      )}
      variant={'ghost'}
      size={'icon'}
      {...props}
    />
  )
}

interface NumberFieldProps extends Omit<AriaNumberFieldProps, 'value' | 'onChange'> {
  label?: string
  description?: string
  onChange?: ((value: number | null) => void) | ((value: number) => void)
  value?: number | null | undefined
  error?: string | undefined
  name?: string
}

const NumberField = ({
  label,
  description,
  className,
  formatOptions,
  isRequired = false,
  isInvalid = false,
  onChange,
  value,
  ...props
}: NumberFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string] || props.error
  const hasError = !!error

  if (formatOptions === undefined) {
    formatOptions = defaultFormatOptions
  }

  const handleChange = (val: number) => {
    if (onChange) {
      try {
        // If onChange accepts null, use val directly (can be NaN)
        onChange(Number.isNaN(val) ? 0 : val)
      } catch {
        // If onChange only accepts number, use 0 as fallback
        ;(onChange as (value: number) => void)(Number.isNaN(val) ? 0 : val)
      }
    }
  }

  return (
    <BaseNumberField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      formatOptions={formatOptions}
      value={value ?? undefined}
      onChange={handleChange}
      {...props}
    >
      {label && <Label value={label} isRequired={isRequired} />}
      <FieldGroup isInvalid={hasError}>
        <NumberFieldInput />
        <NumberFieldSteppers />
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{error}</FieldError>
    </BaseNumberField>
  )
}

export { BaseNumberField, NumberFieldInput, NumberFieldSteppers, NumberFieldStepper, NumberField }
