import { SearchIcon, XIcon } from 'lucide-react'
import type React from 'react'
import {
  type ButtonProps as AriaButtonProps,
  type InputProps as AriaInputProps,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  useLocale,
  type ValidationResult
} from 'react-aria-components'
import { useFieldChange } from '@/Hooks/use-field-change'
import { cn } from '@/Lib/utils'
import { Button } from './button'
import { FieldDescription, FieldError, FieldGroup, FormFieldError, Label } from './field'
import { useFormContext } from './form'
import { Input } from './text-field'

function BaseSearchField({ className, ...props }: AriaSearchFieldProps) {
  return (
    <AriaSearchField
      className={composeRenderProps(className, className => cn('group', className))}
      {...props}
    />
  )
}

function SearchFieldInput({ className, ...props }: AriaInputProps) {
  return (
    <Input
      className={composeRenderProps(className, className =>
        cn('rounded-none border-x-0', className)
      )}
      {...props}
    />
  )
}
function SearchFieldClear({ className, ...props }: AriaButtonProps) {
  return <Button icon={XIcon} variant="ghost" size="icon-xs" {...props} />
}

interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string
  description?: string
  isRequired?: boolean
  placeholder?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  onChange?: ((value: string | null) => void) | ((value: string) => void)
  errorComponent?: React.ComponentType<{
    children?: React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  }>
}

function SearchField({
  label,
  description,
  className,
  isRequired,
  placeholder,
  errorMessage,
  onChange,
  errorComponent: ErrorComponent = FieldError,
  ...props
}: SearchFieldProps) {
  const { locale } = useLocale()

  const searchText = locale.startsWith('de') ? 'Suche …' : 'Search …'
  const realPlaceholder = placeholder ?? searchText
  const handleChange = useFieldChange(onChange)
  const hasError = !!errorMessage

  return (
    <BaseSearchField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-2', className)
      )}
      aria-label={!label ? searchText : undefined}
      onChange={handleChange}
      {...props}
    >
      {label && <Label isRequired={isRequired} value={label} />}
      <FieldGroup aria-label="Search" isInvalid={hasError}>
        <SearchIcon aria-hidden className="size-4 text-muted-foreground" />
        <SearchFieldInput
          placeholder={realPlaceholder}
          type="text"
          className="pressed:ring-0 focus:ring-0"
        />
        <SearchFieldClear />
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <ErrorComponent>{errorMessage}</ErrorComponent>
    </BaseSearchField>
  )
}

const FormSearchField = ({ ...props }: SearchFieldProps) => {
  const form = useFormContext()
  const error = form?.errors?.[props.name as string]

  return <SearchField errorComponent={FormFieldError} errorMessage={error} {...props} />
}

export { SearchField, FormSearchField }
export type { SearchFieldProps }
