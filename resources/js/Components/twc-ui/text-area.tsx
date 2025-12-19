import type React from 'react'
import {
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  composeRenderProps,
  type ValidationResult
} from 'react-aria-components'
import { useFieldChange } from '@/Hooks/use-field-change'
import { cn } from '@/Lib/utils'
import { FieldDescription, FieldError, FormFieldError, Label } from './field'
import { useFormContext } from './form'

interface RACTextAreaProps extends AriaTextAreaProps {
  autoSize?: boolean
  rows?: number
}

const RACTextArea = ({ className, autoSize = true, rows = 2, ...props }: RACTextAreaProps) => {
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
          autoSize ? 'field-sizing-content min-h-20' : 'h-9 min-h-20 resize-none',
          className
        )
      )}
      {...props}
    />
  )
}

interface TextAreaProps extends Omit<AriaTextFieldProps, 'value' | 'onChange'> {
  label?: string
  description?: string
  rows?: number
  placeholder?: string
  autoSize?: boolean
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

const TextArea = ({
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
  errorMessage,
  value,
  ...props
}: TextAreaProps) => {
  const hasError = !!errorMessage
  const handleChange = useFieldChange(onChange)

  return (
    <AriaTextField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5 text-sm', className)
      )}
      isInvalid={hasError}
      value={value ?? undefined}
      onChange={handleChange}
      {...props}
    >
      {label && <Label isRequired={isRequired} value={label} />}
      <RACTextArea
        rows={rows}
        autoSize={autoSize}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <ErrorComponent>{errorMessage}</ErrorComponent>
    </AriaTextField>
  )
}

const FormTextArea = ({ ...props }: TextAreaProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]

  return <TextArea errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { TextArea, FormTextArea, RACTextArea }
export type { TextAreaProps }
