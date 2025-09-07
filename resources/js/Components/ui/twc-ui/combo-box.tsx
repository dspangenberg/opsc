import { ChevronsUpDown } from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFilter } from 'react-aria'
import type { Key } from 'react-aria-components'
import {
  ComboBox as AriaComboBox,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  ListBox as AriaListBox,
  type ListBoxProps as AriaListBoxProps,
  type PopoverProps as AriaPopoverProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { Button } from './button'
import { BaseFieldError, FieldError, FieldGroup, Label } from './field'
import { useFormContext } from './form'
import { ListBoxCollection, ListBoxHeader, ListBoxItem, ListBoxSection } from './list-box'
import { Popover } from './popover'

const BaseComboBox = AriaComboBox
const ComboBoxItem = ListBoxItem
const ComboBoxHeader = ListBoxHeader
const ComboBoxSection = ListBoxSection
const ComboBoxCollection = ListBoxCollection

const ComboBoxInput = ({ className, ...props }: AriaInputProps) => {
  const [isReadOnly, setIsReadOnly] = useState(true)
  const randomName = useMemo(() => `combo_${Math.random().toString(36).substring(2, 11)}`, [])

  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full border-input bg-background px-3 py-2 text-sm outline-none file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          className
        )
      )}
      onFocus={event => {
        event.target.select()
        setIsReadOnly(false)
      }}
      onBlur={() => setIsReadOnly(true)}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      data-form-type="other"
      data-lpignore="true"
      name={randomName}
      readOnly={isReadOnly}
      {...props}
    />
  )
}

const ComboBoxPopover = ({ className, ...props }: AriaPopoverProps) => (
  <Popover
    className={composeRenderProps(className, className =>
      cn('w-[calc(var(--trigger-width)+4px)]', className)
    )}
    {...props}
  />
)

const ComboBoxListBox = <T extends object>({ className, ...props }: AriaListBoxProps<T>) => (
  <AriaListBox
    className={composeRenderProps(className, className =>
      cn(
        'max-h-[inherit] overflow-auto p-1 outline-none [clip-path:inset(0_0_0_0_round_calc(var(--radius)-2px))]',
        className
      )
    )}
    {...props}
  />
)

// Erweiterte ComboBoxValue-Typen um null zu unterstützen - analog zu Select
type ComboBoxValue = string | number | null | undefined

interface ComboBoxProps<T extends object, V extends ComboBoxValue = ComboBoxValue> {
  label?: string
  value: V
  name: string
  className?: string
  autoFocus?: boolean
  items: T[]
  description?: string
  itemName?: keyof T & string
  itemValue?: keyof T & string
  hasError?: boolean
  errors?: Partial<Record<keyof T, string>>
  onChange: (value: V) => void
  onBlur?: () => void
  isOptional?: boolean
  optionalValue?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  children?: React.ReactNode | ((item: T) => React.ReactNode)
  // Neue Props für Value-Konvertierung - analog zu Select
  valueType?: 'string' | 'number'
  nullValue?: V
}

// Internal shared component that contains all the common logic
function ComboBoxCore<T extends object, V extends ComboBoxValue = number>({
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
  errorMessage,
  onChange,
  onBlur,
  children,
  valueType = 'number',
  nullValue,
  ErrorComponent,
  ...props
}: ComboBoxProps<T, V> & { hasError: boolean; ErrorComponent: React.ComponentType<any> }) {
  // Bestimme den nullValue basierend auf dem valueType, falls nicht explizit gesetzt
  const effectiveNullValue: V =
    nullValue !== undefined ? nullValue : ((valueType === 'number' ? 0 : null) as V)

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      if (key === null) {
        onChange(effectiveNullValue)
        return
      }

      // Konvertiere basierend auf valueType
      let convertedValue: V
      if (valueType === 'string') {
        convertedValue = String(key) as V
      } else {
        convertedValue = Number(key) as V
      }

      onChange(convertedValue)

      // Nach Auswahl den Input-Wert zurücksetzen, damit der vollständige Name angezeigt wird
      setFilterValue('')
      setHasUserInteracted(false)
    },
    [onChange, valueType, effectiveNullValue]
  )

  const itemsWithPlaceholder = useMemo(
    () =>
      isOptional
        ? [
            ...Array.from(items),
            {
              [itemValue]: effectiveNullValue,
              [itemName]: optionalValue
            } as T
          ]
        : Array.from(items),
    [isOptional, itemValue, itemName, optionalValue, items, effectiveNullValue]
  )

  const { contains } = useFilter({ sensitivity: 'base' })
  const [filterValue, setFilterValue] = useState('')
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const filteredItems: T[] = useMemo(
    () => itemsWithPlaceholder.filter(item => contains(String(item[itemName]), filterValue)),
    [itemsWithPlaceholder, itemName, contains, filterValue]
  )

  // Konvertiere value zu selectedKey für React Aria
  const selectedKey = value !== null && value !== undefined ? String(value) : null

  // Finde das ausgewählte Item
  const selectedItem = useMemo(() => {
    if (selectedKey === null) return null
    return itemsWithPlaceholder.find(item => String(item[itemValue]) === selectedKey)
  }, [selectedKey, itemsWithPlaceholder, itemValue])

  // Bestimme den Input-Wert basierend auf Zustand
  const inputValue = useMemo(() => {
    // Wenn der Benutzer gerade tippt/filtert, verwende den Filterwert
    if (hasUserInteracted && filterValue !== '') {
      return filterValue
    }

    // Wenn ein Item ausgewählt ist, zeige dessen Namen
    if (selectedItem) {
      return String(selectedItem[itemName])
    }

    // Sonst leer
    return ''
  }, [hasUserInteracted, filterValue, selectedItem, itemName])

  const handleInputChange = useCallback((value: string) => {
    setHasUserInteracted(true)
    setFilterValue(value)
  }, [])

  return (
    <BaseComboBox
      onSelectionChange={handleSelectionChange}
      selectedKey={selectedKey}
      autoFocus={autoFocus}
      items={filteredItems}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-2', className)
      )}
      isInvalid={hasError}
      name={name}
      {...props}
    >
      <Label value={label} />
      <FieldGroup className="p-0">
        <ComboBoxInput className="border-transparent focus:ring-0" />
        <Button variant="ghost" size="icon" className="mr-1.5 size-6 p-1">
          <ChevronsUpDown aria-hidden="true" className="size-4 opacity-50" />
        </Button>
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <ErrorComponent>{errorMessage}</ErrorComponent>
      <ComboBoxPopover>
        <ComboBoxListBox>
          {children ||
            ((item: T) => (
              <ComboBoxItem id={String(item[itemValue] ?? '')}>
                {String(item[itemName])}
              </ComboBoxItem>
            ))}
        </ComboBoxListBox>
      </ComboBoxPopover>
    </BaseComboBox>
  )
}

function ComboBox<T extends object, V extends ComboBoxValue = number>(props: ComboBoxProps<T, V>) {
  const form = useFormContext()
  const realError = form?.errors?.[props.name as string] || props.errorMessage
  const hasError = !!realError

  return (
    <ComboBoxCore
      {...props}
      errorMessage={realError}
      hasError={hasError}
      ErrorComponent={FieldError}
    />
  )
}

function FormlessCombobox<T extends object, V extends ComboBoxValue = number>(
  props: ComboBoxProps<T, V>
) {
  const hasError = !!props.errorMessage

  return <ComboBoxCore {...props} hasError={hasError} ErrorComponent={BaseFieldError} />
}

export {
  ComboBoxSection,
  ComboBoxListBox,
  ComboBoxInput,
  ComboBoxCollection,
  ComboBoxItem,
  ComboBoxHeader,
  ComboBoxPopover,
  ComboBox,
  FormlessCombobox
}
export type { ComboBoxProps }
