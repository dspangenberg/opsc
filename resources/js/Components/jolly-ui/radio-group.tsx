import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
} from "react-aria-components"
import type React from 'react'
import { cn } from "@/Lib/utils"
import { useFormChange } from '@/Hooks/use-form-change'

import { FieldError, Label, labelVariants } from "./field"

const BaseRadioGroup = ({ className, ...props }: AriaRadioGroupProps) => {
  return (
    <AriaRadioGroup
      className={composeRenderProps(className, (className, renderProps) =>
        cn(
          "group/radiogroup flex flex-col flex-wrap gap-2",
          renderProps.orientation === "horizontal" && "flex-row items-center",
          className
        )
      )}
      {...props}
    />
  )
}

const Radio = ({ className, children, ...props }: AriaRadioProps) => {
  return (
    <AriaRadio
      autoFocus={props.autoFocus}
      className={composeRenderProps(className, (className) =>
        cn(
          "group/radio flex items-center gap-x-2",
          /* Disabled */
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
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
              "flex aspect-square size-4 items-center justify-center rounded-full border border-input text-primary",
              /* Focus */
              "group-data-[focused]/radio:outline-none",
              /* Focus Visible */
              "group-data-[focus-visible]/radio:ring-1 group-data-[focus-visible]/radio:ring-ring",
              /* Disabled */
              "group-data-[disabled]/radio:cursor-not-allowed group-data-[disabled]/radio:opacity-50",
              /* Invalid */
              "group-data-[invalid]/radio:border-destructive"
            )}
          >
            {renderProps.isSelected && (
                <svg
                className="size-3.5 p-0.5"
                viewBox="0 0 6 6"
                fill="currentcolor"
                stroke="currencolor"

                xmlns="http://www.w3.org/2000/svg"
                >
                  <title>RadioGroup Item-Indicator</title>
                  <circle cx="3" cy="3" r="3" />
              </svg>
            )}
          </span>
          {children}
        </>
      ))}
    </AriaRadio>
  )
}

interface JollyRadioGroupProps extends AriaRadioGroupProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

interface RadioGroupProps<T extends Record<string, unknown>> extends JollyRadioGroupProps {
  name: string
  autoFocus?: boolean
  items: Iterable<T>
  value: number | string
  itemName?: keyof T & string
  itemValue?: keyof T & string
  hasError?: boolean
  errors?: Partial<Record<keyof T, string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  selected: number | string
  isOptional?: boolean
  optionalValue?: string
}

const RadioGroup = <T extends Record<string, unknown>>({
  label,
  value,
  name,
  itemName = 'name' as keyof T & string,
  itemValue = 'id' as keyof T & string,
  isOptional = false,
  optionalValue = '(leer)',
  orientation = 'vertical',
  className = '',
  autoFocus = false,
  hasError = false,
  items,
  errors,
  onChange,
  ...props
}: RadioGroupProps<T>) => {
  const handleValueChange = useFormChange({
    name,
    onChange
  })
  const itemsWithNothing = isOptional
    ? [{
      [itemValue]: 0,
      [itemName]: optionalValue
    } as T, ...Array.from(items)]
    : Array.from(items)

  return (
    <BaseRadioGroup
      onChange={handleValueChange}
      value={String(value)}
      className={composeRenderProps(className, (className) =>
        cn("group/radiogroup flex-col items-start font-medium", className)
      )}
      orientation={orientation}
      isInvalid={hasError}
      {...props}
    >
      <>
        <Label>{label}:</Label>
        <div className="flex flex-col flex-wrap gap-0.5 group-data-[orientation=horizontal]/radiogroup:flex-row">
          {Array.from(itemsWithNothing).map(item => (
            <Radio className="text-base" key={String(item[itemValue])} value={String(item[itemValue])} autoFocus={autoFocus}>
              {typeof item[itemName] === 'string' ? item[itemName] : String(item[itemName])}
            </Radio>
          ))}
        </div>
        {props.description && (
          <Text slot="description" className="text-muted-foreground text-sm">
            {props.description}
          </Text>
        )}
        <FieldError>{props.errorMessage}</FieldError>
      </>
    </BaseRadioGroup>
  )
}


export { BaseRadioGroup, RadioGroup, Radio }
export type { RadioGroupProps }
