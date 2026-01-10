import { ChevronsUpDown } from 'lucide-react'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useFilter } from 'react-aria'
import type { Key } from 'react-aria-components'
import {
  ComboBox as AriaComboBox,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  ListBox as AriaListBox,
  type ListBoxProps as AriaListBoxProps,
  type PopoverProps as AriaPopoverProps,
  composeRenderProps,
  Text
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { Button } from './button'
import { FieldError, FieldGroup, Label } from './field'
import { ListBoxCollection, ListBoxHeader, ListBoxItem, ListBoxSection } from './list-box'
import { Popover } from './popover'

const BaseComboBox = AriaComboBox
const ComboBoxItem = ListBoxItem
const ComboBoxHeader = ListBoxHeader
const ComboBoxSection = ListBoxSection
const ComboBoxCollection = ListBoxCollection

const ComboBoxInput = ({ autoFocus, className, ...props }: AriaInputProps) => {
  const [isReadOnly, setIsReadOnly] = useState(true)
  const randomName = useMemo(() => `combo_${Math.random().toString(36).substring(2, 11)}`, [])

  return (
    <AriaInput
      className={composeRenderProps(className, className =>
        cn(
          'flex h-9 w-full border-input bg-background px-3 py-2 text-sm outline-none file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground',
          'data-disabled:cursor-not-allowed data-disabled:opacity-50',
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
      autoFocus={autoFocus}
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

interface ComboBoxProps<T extends object> {
  label?: string
  value: string | number | null | undefined
  name: string
  className?: string
  autoFocus?: boolean
  items: T[]
  description?: string
  itemName?: keyof T & string
  itemValue?: keyof T & string
  hasError?: boolean
  onChange: (value: string | number | null) => void
  onBlur?: () => void
  isOptional?: boolean
  optionalValue?: string
  error?: string
  children?: React.ReactNode | ((item: T) => React.ReactNode)
  errorComponent?: React.ComponentType<{ children?: React.ReactNode }>
}

const ComboBox = <T extends Record<string, unknown>>({
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
  items,
  error = '',
  errorComponent: ErrorComponent = FieldError,
  onChange,
  onBlur,
  children,
  ...props
}: ComboBoxProps<T>) => {
  const hasError = !!error

  // Determine the type of itemValue from the first item
  const firstItem = items[0]
  const isStringValue = firstItem && typeof firstItem[itemValue] === 'string'

  const NULL_SENTINEL = '__NULL__'
  const NUMERIC_NULL_SENTINEL = -1

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      if (key === null) {
        onChange(null)
      } else if (isStringValue) {
        const stringKey = String(key)
        onChange(stringKey === NULL_SENTINEL ? null : stringKey)
      } else {
        const numericKey = Number(key)
        onChange(numericKey === NUMERIC_NULL_SENTINEL ? null : numericKey)
      }
    },
    [onChange]
  )

  const itemsWithPlaceholder = useMemo(
    () =>
      isOptional
        ? [
            ...Array.from(items),
            {
              [itemValue]: isStringValue ? NULL_SENTINEL : NUMERIC_NULL_SENTINEL,
              [itemName]: optionalValue
            } as T
          ]
        : Array.from(items),
    [isOptional, itemValue, itemName, optionalValue, items]
  )

  const { contains } = useFilter({ sensitivity: 'base' })
  const [filterValue, setFilterValue] = useState('')
  const filteredItems: T[] = useMemo(
    () => itemsWithPlaceholder.filter(item => contains(String(item[itemName]), filterValue)),
    [itemsWithPlaceholder, itemName, contains, filterValue]
  )

  const selectedKey = value ?? null

  return (
    <BaseComboBox
      onSelectionChange={handleSelectionChange}
      selectedKey={selectedKey}
      items={filteredItems}
      onInputChange={setFilterValue}
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      isInvalid={hasError}
      autoFocus={autoFocus}
      name={name}
      {...props}
    >
      {label && <Label value={label} isRequired={!isOptional} />}
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
      <ErrorComponent>{error}</ErrorComponent>
      <ComboBoxPopover>
        <ComboBoxListBox>
          {children ||
            ((item: T) => {
              const idValue = isStringValue ? String(item[itemValue]) : Number(item[itemValue])
              return (
                <ComboBoxItem id={idValue} textValue={String(item[itemName])}>
                  {String(item[itemName])}
                </ComboBoxItem>
              )
            })}
        </ComboBoxListBox>
      </ComboBoxPopover>
    </BaseComboBox>
  )
}

export {
  ComboBoxSection,
  ComboBoxListBox,
  ComboBoxInput,
  ComboBoxCollection,
  ComboBoxItem,
  ComboBoxHeader,
  ComboBoxPopover,
  ComboBox
}
export type { ComboBoxProps }
