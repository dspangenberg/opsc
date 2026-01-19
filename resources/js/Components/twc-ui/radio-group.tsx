import { Circle } from 'lucide-react'
import type * as React from 'react'
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioProps as AriaRadioProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
  type ValidationResult
} from 'react-aria-components'

import { cn } from '@/Lib/utils'
import { FieldError, Label, labelVariants } from './field'

const BaseRadioGroup = AriaRadioGroup

const Radio = ({ className, children, ...props }: AriaRadioProps) => (
  <AriaRadio
    className={composeRenderProps(className, className =>
      cn(
        'group/radio flex items-center gap-x-2 text-sm',
        /* Disabled */
        'data-disabled:cursor-not-allowed data-disabled:opacity-70',
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
            'flex aspect-square size-4 items-center justify-center rounded-full border border-border bg-background text-primary ring-offset-background',
            /* Focus */
            'group-data-focused/radio:outline-none',
            /* Focus Visible */
            'group-data-focus-visible/radio:ring-2 group-data-focus-visible/radio:ring-ring group-data-focus-visible/radio:ring-offset-2',
            /* Disabled */
            'group-data-disabled/radio:cursor-not-allowed group-data-disabled/radio:opacity-50',
            /* Invalid */
            'group-data-invalid/radio:border-destructive'
          )}
        >
          {renderProps.isSelected && <Circle className="size-2.5 fill-current text-current" />}
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
  isRequired?: boolean
  items?: T[]
  itemName?: keyof T & string
  itemValue?: keyof T & string
  value?: string | number | null | undefined
  onChange?: (value: string) => void
  onBlur?: () => void
  isOptional?: boolean
  optionalValue?: string
  orientation?: 'horizontal' | 'vertical'
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  errorComponent?: React.ComponentType<{
    children?: React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  }>
  children?: React.ReactNode
  renderItem?: (item: T) => React.ReactNode
}

const RadioGroup = <T extends Record<string, unknown>>({
  label,
  description,
  className = '',
  autoFocus = false,
  name,
  items = [] as T[],
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  value,
  onChange,
  onBlur,
  isRequired,
  isOptional = false,
  optionalValue = '(leer)',
  orientation = 'vertical',
  errorMessage,
  errorComponent: ErrorComponent = FieldError,
  children,
  renderItem,
  ...props
}: RadioGroupProps<T>) => {
  const hasError = !!errorMessage

  const itemsWithOptional = items
    ? isOptional
      ? [
          {
            [itemValue]: null,
            [itemName]: optionalValue
          } as T,
          ...Array.from(items)
        ]
      : Array.from(items)
    : []

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
      isInvalid={hasError}
      value={selectedKey}
      onChange={onChange}
      orientation={orientation}
      name={name}
      {...props}
    >
      {label && <Label isRequired={isRequired} value={label} />}
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
      <ErrorComponent>{errorMessage}</ErrorComponent>
    </BaseRadioGroup>
  )
}

export { BaseRadioGroup, RadioGroup, Radio }
export type { RadioGroupProps }
