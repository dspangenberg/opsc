import type * as React from 'react'
import {
  type Color as AriaColor,
  ColorSwatch as AriaColorSwatch,
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  type ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
  type ColorSwatchPickerProps as AriaColorSwatchPickerProps,
  type ColorSwatchProps as AriaColorSwatchProps,
  composeRenderProps,
  FieldErrorContext,
  type ValidationResult
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { FieldDescription, FieldError, Label } from './field'

const BaseColorSwatchPicker = AriaColorSwatchPicker

const ColorSwatch = ({ className, ...props }: AriaColorSwatchProps) => (
  <AriaColorSwatch
    className={composeRenderProps(className, className =>
      cn('size-4.5 rounded-full border border-border', className)
    )}
    {...props}
  />
)

const ColorSwatchPickerItem = ({ className, ...props }: AriaColorSwatchPickerItemProps) => (
  <AriaColorSwatchPickerItem
    className={composeRenderProps(className, className =>
      cn(
        'rounded-full outline-none',
        /* Selected */
        'data-selected:ring-2 data-selected:ring-ring data-selected:ring-offset-2 data-selected:ring-offset-background',
        /* Focus Visible */
        'data-focus-visible:ring-2 data-focus-visible:ring-ring data-focus-visible:ring-offset-2',
        /* Disabled */
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )
    )}
    {...props}
  />
)

interface ColorSwatchPickerProps
  extends Omit<AriaColorSwatchPickerProps, 'value' | 'onChange' | 'className' | 'children'> {
  label?: string
  description?: string
  name?: string
  className?: string
  value?: string | null
  onChange?: (value: string) => void
  onBlur?: () => void
  isRequired?: boolean
  colors?: readonly string[]
  errorMessage?: string | ((validation: ValidationResult) => string)
  errorComponent?: React.ComponentType<{
    children?: React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  }>
  children?: React.ReactNode
}

const ColorSwatchPicker = ({
  label,
  description,
  name,
  value,
  onChange,
  onBlur,
  isRequired = false,
  colors = [],
  errorMessage,
  errorComponent: ErrorComponent = FieldError,
  className,
  children,
  ...props
}: ColorSwatchPickerProps) => {
  const hasError = !!errorMessage

  const handleChange = (color: AriaColor) => {
    onChange?.(color.toString('hex').toLowerCase())
  }

  return (
    <fieldset
      className={cn('group flex w-fit flex-col gap-1.5 border-0 p-0', className)}
      onBlur={onBlur}
    >
      {label && <Label isRequired={isRequired} value={label} />}
      <BaseColorSwatchPicker
        className="flex w-fit flex-wrap gap-2"
        value={value ?? '#000000'}
        onChange={handleChange}
        aria-label={label}
        {...props}
      >
        {children ??
          colors.map(color => (
            <ColorSwatchPickerItem key={color} color={color}>
              <ColorSwatch />
            </ColorSwatchPickerItem>
          ))}
      </BaseColorSwatchPicker>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldErrorContext.Provider
        value={{
          isInvalid: hasError,
          validationErrors: typeof errorMessage === 'string' && errorMessage ? [errorMessage] : [],
          validationDetails: {} as ValidityState
        }}
      >
        <ErrorComponent>{errorMessage}</ErrorComponent>
      </FieldErrorContext.Provider>
    </fieldset>
  )
}

export type { ColorSwatchPickerProps }
export { BaseColorSwatchPicker, ColorSwatch, ColorSwatchPicker, ColorSwatchPickerItem }
