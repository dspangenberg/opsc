import type * as React from 'react'
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioProps as AriaRadioProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text
} from 'react-aria-components'
import { useFormContext } from './form'
import { cn } from '@/Lib/utils'

import { FieldError, Label, labelVariants } from './field'

const BaseRadioGroup = AriaRadioGroup

const Radio = ({ className, children, ...props }: AriaRadioProps) => (
  <AriaRadio
    className={composeRenderProps(className, className =>
      cn(
        'group/radio flex items-center gap-x-2',
        /* Disabled */
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70',
        labelVariants,
        className
      )
    )}
    {...props}
  >
    {composeRenderProps(children, (children, renderProps) => (
      <>
        <span
          className={cn(
            'flex aspect-square size-4 items-center justify-center rounded-full border border-input text-primary',
            /* Focus */
            'group-data-[focused]/radio:outline-none',
            /* Focus Visible */
            'group-data-[focus-visible]/radio:ring-1 group-data-[focus-visible]/radio:ring-ring',
            /* Selected */
            'group-data-[selected]/radio:border-primary group-data-[selected]/radio:bg-primary group-data-[selected]/radio:text-primary-foreground',
            /* Disabled */
            'group-data-[disabled]/radio:cursor-not-allowed group-data-[disabled]/radio:opacity-50',
            /* Invalid */
            'group-data-[invalid]/radio:group-data-[selected]/radio:bg-destructive group-data-[invalid]/radio:group-data-[selected]/radio:text-destructive-foreground group-data-[invalid]/radio:border-destructive'
          )}
        >
          {renderProps.isSelected && (
            <svg
              className="size-2.5 fill-current"
              viewBox="0 0 6 6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Radio selected</title>
              <circle cx="3" cy="3" r="3" />
            </svg>
          )}
        </span>
        <Label className="font-medium">{children}</Label>
      </>
    ))}
  </AriaRadio>
)

interface RadioGroupProps<T extends Record<string, unknown>> {
  name: string
  label?: string
  description?: string
  className?: string
  autoFocus?: boolean
  items: T[]
  itemName?: keyof T & string
  itemValue?: keyof T & string
  value?: string | number | null | undefined
  onChange: (value: string | number | null) => void
  onBlur?: () => void
  isOptional?: boolean
  optionalValue?: string
  orientation?: 'horizontal' | 'vertical'
  error?: string | ((validation: AriaValidationResult) => string)
  children?: React.ReactNode
  renderItem?: (item: T) => React.ReactNode
}

const RadioGroup = <T extends Record<string, unknown>>({
  label,
  description,
  className = '',
  autoFocus = false,
  name,
  items,
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  value,
  onChange,
  onBlur,
  isOptional = false,
  optionalValue = '(leer)',
  orientation = 'vertical',
  children,
  renderItem,
  ...props
}: RadioGroupProps<T>) => {
  const form = useFormContext()
  const error = form?.errors?.[name as string] || props.error
  const realHasError = !!error

  const itemsWithOptional = isOptional
    ? [
        {
          [itemValue]: null,
          [itemName]: optionalValue
        } as T,
        ...Array.from(items)
      ]
    : Array.from(items)

  const handleSelectionChange = (selectedValue: string) => {
    const numericValue =
      selectedValue === 'null'
        ? null
        : !Number.isNaN(Number(selectedValue))
          ? Number(selectedValue)
          : selectedValue
    onChange(numericValue)
  }

  const selectedKey = value === null ? 'null' : String(value)

  const renderRadioItems = () => {
    if (children) {
      return children
    }

    return itemsWithOptional.map(item => {
      const itemKey = item[itemValue] === null ? 'null' : String(item[itemValue])

      if (renderItem) {
        return (
          <Radio key={itemKey} value={itemKey} autoFocus={autoFocus}>
            {renderItem(item)}
          </Radio>
        )
      }

      return (
        <Radio key={itemKey} value={itemKey} autoFocus={autoFocus}>
          {String(item[itemName])}
        </Radio>
      )
    })
  }

  return (
    <BaseRadioGroup
      className={composeRenderProps(className, className =>
        cn(
          'group flex flex-col gap-2',
          orientation === 'horizontal' && 'flex-row flex-wrap items-center',
          className
        )
      )}
      isInvalid={realHasError}
      value={selectedKey}
      onChange={handleSelectionChange}
      orientation={orientation}
      name={name}
      {...props}
    >
      <Label value={label} />
      <div
        className={cn(
          'flex gap-2',
          orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'
        )}
      >
        {renderRadioItems()}
      </div>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{error}</FieldError>
    </BaseRadioGroup>
  )
}

export { BaseRadioGroup, RadioGroup, Radio }
export type { RadioGroupProps }
