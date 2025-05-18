import * as React from 'react'
import {
  composeRenderProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  Text,
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult as AriaValidationResult
} from 'react-aria-components'

import { cn } from '@/Lib/utils'

import { FieldError, Label } from './field'

const TextField = AriaTextField

const Input = ({ className, ...props }: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-base font-medium shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ',
          /* Focused */
          /* Resets */
          'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
          'data-[invalid]:focus-visible:ring-destructive/20  data-[invalid]:focus-visible:border-destructive  data-[invalid]:border-destructive',
          className
        )
      )}
      {...props}
      onFocus={event => event.target.select()}
    />
  )
}

//         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

const TextArea = ({ className, ...props }: AriaTextAreaProps) => {
  return (
    <AriaTextArea
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full min-h-[80px] rounded-sm border border-input bg-transparent px-3 py-1 text-base font-medium shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          /* Focused */
          /* Resets */
          'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
          'data-[invalid]:focus-visible:ring-destructive/20  data-[invalid]:focus-visible:border-destructive  data-[invalid]:border-destructive',
          className
        )
      )}
      onFocus={event => event.target.select()}
      {...props}
    />
  )
}

interface JollyTextFieldProps extends AriaTextFieldProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  textArea?: boolean
}

function JollyTextField({
  label,
  description,
  errorMessage,
  textArea,
  className,
  ...props
}: JollyTextFieldProps) {
  return (
    <TextField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      {...props}
    >
      <Label>{label}:</Label>
      {textArea ? <TextArea /> : <Input />}
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  )
}

export { Input, TextField, JollyTextField, TextArea }
