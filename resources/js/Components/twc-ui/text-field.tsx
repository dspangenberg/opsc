import type React from 'react'
import {
  Input as AriaInput,
  type InputProps as AriaInputProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  composeRenderProps,
  type ValidationResult
} from 'react-aria-components'
import { useFieldChange } from '@/Hooks/use-field-change'
import { cn } from '@/Lib/utils'
import { FieldDescription, FieldError, Label } from './field'

const BaseTextField = AriaTextField

const Input = ({ className, ...props }: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 font-medium text-sm shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          /* Disabled */
          'data-disabled:cursor-not-allowed data-disabled:opacity-50',
          /* Focused */
          /* Resets */
          'focus:border-primary focus:ring-[3px] focus:ring-primary/20',
          'data-invalid:border-destructive data-invalid:focus:border-destructive data-invalid:focus:ring-destructive/20',
          className
        )
      )}
      {...props}
      onFocus={event => event.target.select()}
    />
  )
}

interface TextFieldProps extends Omit<AriaTextFieldProps, 'value' | 'onChange'> {
  label?: string
  description?: string
  placeholder?: string
  onChange?: ((value: string | null) => void) | ((value: string) => void)
  errorComponent?: React.ComponentType<{
    children?: React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  }>
  name?: string
  value?: string | null | undefined
  errorMessage?: string | ((validation: ValidationResult) => string)
  onBlur?: () => void
  autoComplete?: string
}

const TextField = ({
  label,
  description,
  isRequired = false,
  className,
  autoComplete = 'off',
  placeholder = '',
  onChange,
  errorComponent: ErrorComponent = FieldError,
  value,
  errorMessage,
  ...props
}: TextFieldProps) => {
  const hasError = !!errorMessage
  const handleChange = useFieldChange(onChange)

  return (
    <AriaTextField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      value={value ?? undefined}
      onChange={handleChange}
      {...props}
    >
      {label && <Label isRequired={isRequired} value={label} />}
      <Input autoComplete={autoComplete} placeholder={placeholder} />
      {description && <FieldDescription>{description}</FieldDescription>}
      <ErrorComponent>{errorMessage}</ErrorComponent>
    </AriaTextField>
  )
}

export { Input, TextField, BaseTextField }
export type { TextFieldProps }
