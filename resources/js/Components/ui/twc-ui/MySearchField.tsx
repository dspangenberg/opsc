import type { SearchFieldProps, ValidationResult } from 'react-aria-components'
import { Button, FieldError, Input, Label, SearchField, Text } from 'react-aria-components'

interface MySearchFieldProps extends SearchFieldProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  placeholder?: string
}

export function MySearchField({
  label,
  description,
  errorMessage,
  placeholder,
  ...props
}: MySearchFieldProps) {
  return (
    <SearchField {...props}>
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
      <Button>X</Button>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </SearchField>
  )
}
