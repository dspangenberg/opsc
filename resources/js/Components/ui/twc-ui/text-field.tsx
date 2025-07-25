import {
  Input as AriaInput,
  type InputProps as AriaInputProps,
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  composeRenderProps,
  Text
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { FieldError, Label } from './field'
import { useFormContext } from './form'

const BaseTextField = AriaTextField

const Input = ({
  className,
  ...props
}: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 font-medium text-sm shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ',
          /* Focused */
          /* Resets */
          'focus:border-primary focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20',
          'data-[invalid]:border-destructive data-[invalid]:focus-visible:border-destructive data-[invalid]:focus-visible:ring-destructive/20',
          className
        )
      )}
      {...props}
      onFocus={event => event.target.select()}
    />
  )
}

interface TextAreaProps extends AriaTextAreaProps {
  autoSize?: boolean
}

const TextArea = ({
  className,
  autoSize = false,
  ...props
}: TextAreaProps) => {
  return (
    <AriaTextArea
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 min-h-[80px] w-full rounded-sm border border-input bg-transparent px-3 py-1 font-medium text-sm shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          /* Focused */
          /* Resets */
          'focus:border-primary focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20',
          'data-[invalid]:border-destructive data-[invalid]:focus-visible:border-destructive data-[invalid]:focus-visible:ring-destructive/20',
          autoSize ? 'field-sizing-content min-h-[80px] resize-none' : 'h-9 min-h-[80px]',
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
  autoSize?: boolean
  onChange?: ((value: string | null) => void) | ((value: string) => void)
  name?: string
  placeholder?: string
  value?: string | null | undefined
  error?: string | undefined
  onBlur?: () => void
  autoComplete?: string
}

function TextField ({
  label,
  description,
  textArea,
  isRequired = false,
  autoSize = false,
  rows = 3,
  className,
  autoComplete = 'off',
  onChange,
  value,
  ...props
}: TextFieldProps) {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string] || props.error
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
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      value={value ?? undefined}
      onChange={handleChange}
      {...props}
    >
      <Label isRequired={isRequired} value={label} />
      {textArea ? <TextArea rows={rows} autoSize={autoSize} autoComplete={autoComplete} /> :
        <Input autoComplete={autoComplete} />}
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{error}</FieldError>
    </AriaTextField>
  )
}

export { Input, TextField, BaseTextField, TextArea }
