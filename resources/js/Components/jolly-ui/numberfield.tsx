import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons'
import {
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
  Text,
  type ValidationResult as AriaValidationResult
} from 'react-aria-components'

import { cn } from '@/Lib/utils'

import { Button } from './button'
import { FieldError, FieldGroup, Label } from './field'

const NumberField = AriaNumberField

function NumberFieldInput({ className, ...props }: AriaInputProps) {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'w-fit min-w-0 flex-1 border-0 text-right text-base border-transparent bg-background pl-0 pr-4 placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden ',
          className
        )
      )}
      onFocus={event => event.target.select()}
      {...props}
    />
  )
}

function NumberFieldSteppers({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('absolute right-0 flex h-full flex-col border-l', className)} {...props}>
      <NumberFieldStepper slot="increment">
        <CaretUpIcon aria-hidden className="size-4" />
      </NumberFieldStepper>
      <div className="border-b" />
      <NumberFieldStepper slot="decrement">
        <CaretDownIcon aria-hidden className="size-4" />
      </NumberFieldStepper>
    </div>
  )
}

function NumberFieldStepper({ className, ...props }: AriaButtonProps) {
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

interface JollyNumberFieldProps extends AriaNumberFieldProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function JollyNumberField({
  label,
  description,
  errorMessage,
  className,
  ...props
}: JollyNumberFieldProps) {
  return (
    <NumberField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5',
          className)
      )}
      {...props}
    >
      <Label>{label}:</Label>
      <FieldGroup>
        <NumberFieldInput className="focus:ring-0" />
        <NumberFieldSteppers />
      </FieldGroup>
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
    </NumberField>
  )
}

export { NumberField, NumberFieldInput, NumberFieldSteppers, NumberFieldStepper, JollyNumberField }

export type { JollyNumberFieldProps }
