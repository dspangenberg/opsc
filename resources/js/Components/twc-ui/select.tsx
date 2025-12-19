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
  composeRenderProps,
  type Key,
  Text
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { FieldError, FormFieldError, Label } from './field'
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
        'line-clamp-1 truncate data-placeholder:text-muted-foreground',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20',
        /* Description */
        '*:[[slot=description]]:hidden',
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
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20',
        /* Focused */
        'data-invalid:border-destructive data-invalid:focus-visible:border-destructive data-invalid:focus-visible:ring-destructive/20',
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
interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, 'children' | 'onSelectionChange' | 'onChange'> {
  label?: string
  description?: string
  error?: string
  children?: React.ReactNode | ((item: T) => React.ReactNode)
  onChange?: (value: string | number | null) => void
  isOptional?: boolean
  optionalValue?: string
  value: string | number | null
  items?: Iterable<T>
  itemName?: keyof T & string
  itemValue?: keyof T & string
  name?: string
  errorComponent?: React.ComponentType<{ children?: React.ReactNode }>
}

const Select = <T extends object>({
  label,
  description,
  error,
  children,
  autoFocus,
  className,
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  errorComponent: ErrorComponent = FieldError,
  isOptional = false,
  optionalValue = '(leer)',
  items = [],
  onChange,
  name,
  ...props
}: SelectProps<T>) => {
  const hasError = !!error

  // Materialize items once to avoid exhausting one-shot iterables
  const itemsArray = Array.from(items)
  const firstItem = itemsArray[0]
  const isStringValue = firstItem && typeof firstItem[itemValue] === 'string'

  const NULL_SENTINEL = '__NULL__'
  const NUMERIC_NULL_SENTINEL = -1

  const itemsWithNothing = isOptional
    ? [
        {
          [itemValue]: isStringValue ? NULL_SENTINEL : NUMERIC_NULL_SENTINEL,
          [itemName]: optionalValue
        } as T,
        ...itemsArray
      ]
    : itemsArray

  const handleSelectionChange = (key: Key | null) => {
    if (key === null) {
      onChange?.(null)
    } else if (isStringValue) {
      const stringKey = String(key)
      onChange?.(stringKey === NULL_SENTINEL ? null : stringKey)
    } else {
      const numericKey = Number(key)
      onChange?.(numericKey === NUMERIC_NULL_SENTINEL ? null : numericKey)
    }
  }

  return (
    <BaseSelect
      isInvalid={hasError}
      onSelectionChange={handleSelectionChange}
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
      <ErrorComponent>{error}</ErrorComponent>
      <SelectPopover>
        <SelectListBox items={itemsWithNothing}>
          {children ||
            (item => {
              const textValue =
                typeof item[itemName] === 'string' ? item[itemName] : String(item[itemName])
              const idValue = isStringValue ? String(item[itemValue]) : Number(item[itemValue])
              return (
                <SelectItem id={idValue} textValue={textValue}>
                  {textValue}
                </SelectItem>
              )
            })}
        </SelectListBox>
      </SelectPopover>
    </BaseSelect>
  )
}

const FormSelect = <T extends object>({ name, ...props }: SelectProps<T>) => {
  const form = useFormContext()
  const realError = form?.errors?.[name as string]
  return <Select<T> error={realError} name={name} {...props} errorComponent={FormFieldError} />
}

export {
  Select,
  BaseSelect,
  FormSelect,
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
