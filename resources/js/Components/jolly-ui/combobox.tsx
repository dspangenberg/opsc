import { CaretSortIcon } from "@radix-ui/react-icons"
import {
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  ListBox as AriaListBox,
  type ListBoxProps as AriaListBoxProps,
  type PopoverProps as AriaPopoverProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
} from "react-aria-components"
import type { Key } from 'react-aria-components'
import { useFilter } from 'react-aria'
import { useMemo, useState, useCallback } from 'react'

import { cn } from "@/Lib/utils"

import { Button } from "@/Components/ui/twc-ui/button"
import { FieldError, FieldGroup, Label } from "./field"
import {
  ListBoxCollection,
  ListBoxHeader,
  ListBoxItem,
  ListBoxSection,
} from "./list-box"
import { Popover } from "./popover"
import type React from 'react'
import { useFormChange } from '@/Hooks/use-form-change'

const BaseCombobox = AriaComboBox

const ComboboxItem = ListBoxItem

const ComboboxHeader = ListBoxHeader

const ComboboxSection = ListBoxSection

const ComboboxCollection = ListBoxCollection

const ComboboxInput = ({ className, ...props }: AriaInputProps) => (
  <AriaInput
    className={composeRenderProps(className, (className) =>
      cn(
        "flex h-9 w-full border-input bg-background text-base px-3 py-2 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
        /* Disabled */
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )
    )}
    onFocus={event => event.target.select()}
    {...props}
  />
)

const ComboboxPopover = ({ className, ...props }: AriaPopoverProps) => (
  <Popover
    className={composeRenderProps(className, (className) =>
      cn("w-[calc(var(--trigger-width)+4px)]", className)
    )}
    {...props}
  />
)

const ComboboxListBox = <T extends object>({
  className,
  ...props
}: AriaListBoxProps<T>) => (
  <AriaListBox
    className={composeRenderProps(className, (className) =>
      cn(
        "max-h-[inherit] overflow-auto p-1 outline-none [clip-path:inset(0_0_0_0_round_calc(var(--radius)-2px))]",
        className
      )
    )}
    {...props}
  />
)

interface JollyComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, "children"> {
  label?: string
  description?: string | null
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  children: React.ReactNode | ((item: T) => React.ReactNode)
}

function JollyComboBox<T extends object>({
  label,
  description,
  errorMessage,
  className,
  children,
  ...props
}: JollyComboBoxProps<T>) {
  return (
    <BaseCombobox
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className)
      )}
      {...props}
    >
      <Label>{label}:</Label>
      <FieldGroup className="p-0">
        <ComboboxInput className="focus:ring-0 border-transparent"/>
        <Button variant="ghost" size="icon" className="mr-1.5 size-6 p-1">
          <CaretSortIcon aria-hidden="true" className="size-4 opacity-50" />
        </Button>
      </FieldGroup>
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <ComboboxPopover>
        <ComboboxListBox>{children}</ComboboxListBox>
      </ComboboxPopover>
    </BaseCombobox>
  )
}

interface ComboboxProps<T extends Record<string, unknown>> {
  label?: string
  value: number
  name: string
  className?: string
  autoFocus?: boolean
  items: T[],
  description?: string
  itemName?: keyof T & string
  itemValue?: keyof T & string
  hasError?: boolean
  errors?: Partial<Record<keyof T, string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isOptional?: boolean
  optionalValue?: string
}

function Combobox<T extends Record<string, unknown>> ({
  label,
  value,
  name,
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  isOptional = false,
  optionalValue = '(leer)',
  className = '',
  description,
  autoFocus = false,
  hasError = false,
  items,
  errors,
  onChange,
  ...props
}: ComboboxProps<T>) {
  const formChange = useFormChange({ name, onChange });

  const handleValueChange = useCallback((key: Key | null) => {
    let adjustedValue: number;
    if (key === null) {
      adjustedValue = 0;
    } else if (typeof key === 'string') {
      adjustedValue = Number.parseInt(key, 10) || 0;
    } else {
      adjustedValue = key;
    }

    formChange(adjustedValue);
  }, [formChange]);

  const itemsWithPlaceholder = useMemo(() =>
    isOptional
      ? [...Array.from(items),{
        [itemValue]: -1,
        [itemName]: optionalValue
      } as T]
      : Array.from(items),
    [isOptional, itemValue, itemName, optionalValue, items]
  );

  const { contains } = useFilter({ sensitivity: 'base' });
  const [filterValue, setFilterValue] = useState('');
  const filteredItems: T[] = useMemo(
    () => itemsWithPlaceholder.filter((item) => contains(String(item[itemName]), filterValue)),
    [itemsWithPlaceholder, itemName, contains, filterValue]
  );

  return (
    <JollyComboBox<T>
      onSelectionChange={handleValueChange}
      selectedKey={value}
      label={label}
      items={filteredItems}
      description={description}
      autoFocus={autoFocus}
      onInputChange={setFilterValue}
      className={className}
      isInvalid={hasError}
      {...props}
    >
      {item => (
        <ComboboxItem id={Number(item[itemValue])}>
          {String(item[itemName])}
        </ComboboxItem>
      )}
    </JollyComboBox>
  )
}

export {
  ComboboxSection,
  ComboboxListBox,
  ComboboxInput,
  ComboboxCollection,
  ComboboxItem,
  ComboboxHeader,
  ComboboxPopover,
  JollyComboBox,
  Combobox,
}
export type { JollyComboBoxProps, ComboboxProps }
