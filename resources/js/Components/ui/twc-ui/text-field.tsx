import {
  Input as AriaInput,
  type InputProps as AriaInputProps,
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  composeRenderProps
} from 'react-aria-components'
import { useFormContext } from './form'
import { cn } from '@/Lib/utils'
import { FieldError, FormFieldError, Label, FieldDescription } from './field'
import React from 'react'

const BaseTextField = AriaTextField

const Input = ({ className, ...props }: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 font-medium shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          /* Disabled */
          'data-disabled:cursor-not-allowed data-disabled:opacity-50 ',
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

interface RACTextAreaProps extends AriaTextAreaProps {
  autoSize?: boolean
  rows?: number
}

const RACTextarea = ({ className, autoSize = true, rows = 2, ...props }: RACTextAreaProps) => {
  return (
    <AriaTextArea
      className={composeRenderProps(className, className =>
        cn(
          'flex w-full rounded-sm border border-input bg-transparent px-3 py-1 font-medium shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          /* Disabled */
          'data-disabled:cursor-not-allowed data-disabled:opacity-50',
          /* Focused */
          /* Resets */
          'focus:border-primary focus:ring-[3px] focus:ring-primary/20',
          'data-invalid:border-destructive data-invalid:focus:border-destructive data-invalid:focus:ring-destructive/20',
          autoSize ? 'field-sizing-content min-h-20 ' : 'h-9 min-h-20 resize-none',
          className
        )
      )}
      {...props}
    />
  )
}

interface TextFieldProps extends Omit<AriaTextFieldProps, 'value' | 'onChange'> {
  label?: string
  description?: string
  textArea?: boolean
  rows?: number
  placeholder?: string
  autoSize?: boolean
  onChange?: ((value: string | null) => void) | ((value: string) => void)
  errorComponent?: React.ComponentType<{ children?: React.ReactNode }>
  name?: string
  value?: string | null | undefined
  error?: string | undefined
  onBlur?: () => void
  autoComplete?: string
}

const TextField = ({
  label,
  description,
  textArea,
  isRequired = false,
  className,
  autoComplete = 'off',
  placeholder = '',
  onChange,
  errorComponent: ErrorComponent = FieldError,
  value,
  error,
  ...props
}: TextFieldProps) => {
  const hasError = !!error

  const handleChange = (val: string) => {
    if (onChange) {
      try {
        onChange(val || '')
      } catch {
        // If not, use the string directly
        ;(onChange as (value: string) => void)(val)
      }
    }
  }

  return (
    <AriaTextField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5  text-sm ', className)
      )}
      isInvalid={hasError}
      value={value ?? undefined}
      onChange={handleChange}
      {...props}
    >
      {label && <Label isRequired={isRequired} value={label} />}
      <Input autoComplete={autoComplete} placeholder={placeholder} />
      {description && <FieldDescription>{description}</FieldDescription>}
      <ErrorComponent>{error}</ErrorComponent>
    </AriaTextField>
  )
}

interface TextAreaProps extends Omit<AriaTextFieldProps, 'value' | 'onChange'> {
  label?: string
  description?: string
  rows?: number
  placeholder?: string
  autoSize?: boolean
  onChange?: ((value: string | null) => void) | ((value: string) => void)
  errorComponent?: React.ComponentType<{ children?: React.ReactNode }>
  name?: string
  value?: string | null | undefined
  error?: string | undefined
  onBlur?: () => void
  autoComplete?: string
}

const TextAreaField = ({
  label,
  description,
  isRequired = false,
  autoSize = true,
  rows = 3,
  className,
  autoComplete = 'off',
  placeholder = '',
  onChange,
  errorComponent: ErrorComponent = FieldError,
  error,
  value,
  ...props
}: TextAreaProps) => {
  const hasError = !!error

  const handleChange = (val: string) => {
    if (onChange) {
      try {
        onChange(val || '')
      } catch {
        // If not, use the string directly
        ;(onChange as (value: string) => void)(val)
      }
    }
  }

  return (
    <AriaTextField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5  text-sm ', className)
      )}
      isInvalid={hasError}
      value={value ?? undefined}
      onChange={handleChange}
      {...props}
    >
      {label && <Label isRequired={isRequired} value={label} />}
      <RACTextarea rows={rows} autoSize={autoSize} autoComplete={autoComplete} />
      {description && <FieldDescription>{description}</FieldDescription>}
      <ErrorComponent>{error}</ErrorComponent>
    </AriaTextField>
  )
}
const FormTextField = ({ ...props }: TextFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]

  return <TextField errorComponent={FormFieldError} error={error} {...props} />
}

const FormTextAreaField = ({ ...props }: TextFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]

  return <TextAreaField errorComponent={FormFieldError} error={error} {...props} />
}

export { Input, TextField, FormTextField, BaseTextField, TextAreaField, FormTextAreaField }
