import { ChevronsUpDown } from 'lucide-react'
import type React from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  ListBox as AriaListBox,
  type ListBoxProps as AriaListBoxProps,
  type PopoverProps as AriaPopoverProps,
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue as AriaSelectValue,
  type SelectValueProps as AriaSelectValueProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  type Key,
  Text
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { FieldError, Label } from './field'
import { useFormContext } from './form'
import { ListBoxCollection, ListBoxHeader, ListBoxItem, ListBoxSection } from './list-box'
import { Popover } from './popover'

const BaseSelect = AriaSelect

const SelectItem = ListBoxItem

const SelectHeader = ListBoxHeader

const SelectSection = ListBoxSection

const SelectCollection = ListBoxCollection

const SelectValue = <T extends object>({ className, ...props }: AriaSelectValueProps<T>) => (
  <AriaSelectValue
    className={composeRenderProps(className, className =>
      cn(
        'line-clamp-1 data-[placeholder]:text-muted-foreground ',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20',
        /* Description */
        '[&>[slot=description]]:hidden',
        className
      )
    )}
    {...props}
  />
)

const SelectTrigger = ({ className, children, ...props }: AriaButtonProps) => (
  <AriaButton
    type="button"
    className={composeRenderProps(className, className =>
      cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-sm border border-input bg-transparent px-3 py-2 font-medium text-sm shadow-none outline-0 ring-offset-0',
        /* Disabled */
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        'focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20',
        /* Focused */
        'data-[invalid]:border-destructive data-[invalid]:focus-visible:border-destructive data-[invalid]:focus-visible:ring-destructive/20',
        className
      )
    )}
    {...props}
  >
    {composeRenderProps(children, children => (
      <>
        {children}
        <ChevronsUpDown aria-hidden="true" className="size-4 opacity-50" />
      </>
    ))}
  </AriaButton>
)

const SelectPopover = ({ className, ...props }: AriaPopoverProps) => (
  <Popover
    className={composeRenderProps(className, className => cn('w-[--trigger-width]', className))}
    {...props}
  />
)

const SelectListBox = <T extends object>({ className, ...props }: AriaListBoxProps<T>) => (
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

// Generischer Value-Typ
type SelectValue = string | number | null

interface SelectProps<T extends object, V extends SelectValue = SelectValue> extends Omit<AriaSelectProps<T>, 'children'> {
  label?: string
  description?: string
  error?: string | ((validation: AriaValidationResult) => string)
  children?: React.ReactNode | ((item: T) => React.ReactNode)
  onChange: (value: V) => void // Generischer Value-Typ
  onBlur?: () => void
  isOptional?: boolean
  optionalValue?: string
  value: V | undefined
  items: Iterable<T>
  itemName?: keyof T & string
  itemValue?: keyof T & string
  name?: string
  // Neue Props für Value-Konvertierung
  valueType?: 'string' | 'number' // Bestimmt, welcher Typ zurückgegeben wird
  nullValue?: V // Wert für "keine Auswahl"
}

function Select<T extends object, V extends SelectValue = number>({
  label,
  description,
  error,
  children,
  autoFocus,
  className,
  items,
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  isOptional = false,
  optionalValue = '(leer)',
  onChange,
  onBlur,
  name,
  value,
  valueType = 'number',
  nullValue = (valueType === 'number' ? 0 : null) as V,
  ...props
}: SelectProps<T, V>) {
  const form = useFormContext()
  const realError = form?.errors?.[name as string] || error
  const hasError = !!realError

  const itemsWithNothing = isOptional
    ? [
      {
        [itemValue]: nullValue,
        [itemName]: optionalValue
      } as T,
      ...Array.from(items)
    ]
    : Array.from(items)

  const handleSelectionChange = (key: Key | null) => {
    if (key === null) {
      onChange(nullValue)
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
  }

  // Konvertiere value zu selectedKey für React Aria
  const selectedKey = value !== null && value !== undefined ? String(value) : null

  return (
    <BaseSelect
      isInvalid={hasError}
      selectedKey={selectedKey}
      onSelectionChange={handleSelectionChange}
      onBlur={onBlur}
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5 text-sm', className)
      )}
      name={name}
      {...props}
    >
      {label && <Label value={label} />}
      <SelectTrigger autoFocus={autoFocus}>
        <SelectValue className="focus-within-0 border-transparent" />
      </SelectTrigger>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{realError}</FieldError>
      <SelectPopover>
        <SelectListBox items={itemsWithNothing}>
          {children ||
            (item => {
              // Sichere Konvertierung zu String für die ID
              const itemId = String(item[itemValue] ?? '')
              const itemDisplayName = typeof item[itemName] === 'string'
                ? item[itemName]
                : String(item[itemName] ?? '')

              return (
                <SelectItem id={itemId}>
                  {itemDisplayName}
                </SelectItem>
              )
            })}
        </SelectListBox>
      </SelectPopover>
    </BaseSelect>
  )
}

export {
  Select,
  BaseSelect,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectPopover,
  SelectHeader,
  SelectListBox,
  SelectSection,
  SelectCollection
}
export type { SelectProps }
