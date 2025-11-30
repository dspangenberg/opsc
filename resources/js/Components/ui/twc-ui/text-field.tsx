import { useEffect, useRef } from 'react'
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

const Input = ({ className, ...props }: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 font-medium text-sm shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          /* Focused */
          /* Resets */
          'focus:border-primary focus:ring-[3px] focus:ring-primary/20',
          'data-[invalid]:border-destructive data-[invalid]:focus:border-destructive data-[invalid]:focus:ring-destructive/20',
          className
        )
      )}
      {...props}
      onFocus={event => event.target.select()}
    />
  )
}

interface TextAreaProps extends AriaTextAreaProps {
  rows?: number
  autoSize?: boolean
}

const TextArea = ({ className, autoSize = false, rows = 2, ...props }: TextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoSize && textAreaRef.current) {
      const adjustHeight = () => {
        const textarea = textAreaRef.current
        if (textarea) {
          textarea.style.height = 'auto'
          textarea.style.height = `${textarea.scrollHeight}px`
        }
      }

      adjustHeight()

      const textarea = textAreaRef.current
      textarea.addEventListener('input', adjustHeight)

      return () => textarea.removeEventListener('input', adjustHeight)
    }
  }, [autoSize, props.value])

  return (
    <AriaTextArea
      ref={textAreaRef}
      rows={rows}
      className={composeRenderProps(className, className =>
        cn(
          'flex min-h-[40px] w-full rounded-sm border border-input bg-transparent px-3 py-1 font-medium text-sm shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          /* Focused */
          /* Resets */
          'focus:border-primary focus:ring-[3px] focus:ring-primary/20',
          'data-[invalid]:border-destructive data-[invalid]:focus:border-destructive data-[invalid]:focus:ring-destructive/20',
          autoSize ? 'resize-none overflow-hidden' : '',
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
  value?: string | null | undefined
  error?: string | undefined
  onBlur?: () => void
  autoComplete?: string
}

function TextField({
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
      {label && <Label isRequired={isRequired} value={label} />}
      {textArea ? (
        <TextArea rows={rows} autoSize={autoSize} autoComplete={autoComplete} />
      ) : (
        <Input autoComplete={autoComplete} />
      )}
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
