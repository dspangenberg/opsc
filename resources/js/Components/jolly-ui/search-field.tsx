'use client'

import { SearchIcon, XIcon } from 'lucide-react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text
} from 'react-aria-components'

import { cn } from '@/Lib/utils'

import { FieldError, FieldGroup, Label } from './field'

function SearchField({ className, ...props }: AriaSearchFieldProps) {
  return (
    <AriaSearchField
      className={composeRenderProps(className, className => cn('group', className))}
      {...props}
    />
  )
}

function SearchFieldInput({ className, ...props }: AriaInputProps) {
  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full rounded-sm border-0 bg-background px-3 py-1 font-medium text-sm shadow-none outline-0 transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          'focus:border-0 focus-visible:border-transparent',
          className
        )
      )}
      {...props}
    />
  )
}

function SearchFieldGroup({ className, ...props }: AriaGroupProps) {
  return (
    <AriaGroup
      className={composeRenderProps(className, className =>
        cn(
          'flex h-10 w-full items-center overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          /* Focus Within */
          'data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring data-[focus-within]:ring-offset-2',
          /* Disabled */
          'data-[disabled]:opacity-50',
          className
        )
      )}
      {...props}
    />
  )
}

function SearchFieldClear({ className, ...props }: AriaButtonProps) {
  return (
    <AriaButton
      className={composeRenderProps(className, className =>
        cn(
          'mr-1 rounded-sm opacity-70 ring-offset-background transition-opacity',
          /* Hover */
          'data-[hovered]:opacity-100',
          /* Disabled */
          'data-[disabled]:pointer-events-none',
          /* Empty */
          'group-data-[empty]:invisible',
          className
        )
      )}
      {...props}
    />
  )
}

interface JollySearchFieldProps extends AriaSearchFieldProps {
  label?: string
  description?: string
  placeholder?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function JollySearchField({
  label,
  description,
  className,
  placeholder = 'Suchen',
  errorMessage,
  ...props
}: JollySearchFieldProps) {
  return (
    <SearchField
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-2', className)
      )}
      {...props}
    >
      <Label>{label}</Label>
      <FieldGroup>
        <SearchIcon aria-hidden className="size-4 text-muted-foreground" />
        <SearchFieldInput
          placeholder={placeholder}
          type="text"
          className="pressed:ring-0 focus:ring-0"
        />
        <SearchFieldClear>
          <XIcon aria-hidden className="size-4" />
        </SearchFieldClear>
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
    </SearchField>
  )
}

export { SearchField, SearchFieldGroup, SearchFieldInput, SearchFieldClear, JollySearchField }
export type { JollySearchFieldProps }
