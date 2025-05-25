import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
} from "react-aria-components"

import { cn } from "@/Lib/utils"

import { FieldError, Label, labelVariants } from "./field"

const RadioGroup = ({ className, ...props }: AriaRadioGroupProps) => {
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

function JollyRadioGroup<T extends object>({
  label,
  description,
  className,
  errorMessage,
  children,
  ...props
}: JollyRadioGroupProps) {
  return (
    <RadioGroup
      className={composeRenderProps(className, (className) =>
        cn("group/radiogroup flex-col items-start", className)
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          <Label>{label}:</Label>
          <div className="flex flex-col flex-wrap gap-0.5 group-data-[orientation=horizontal]/radiogroup:flex-row">
            {children}
          </div>
          {description && (
            <Text slot="description" className="text-sm text-muted-foreground">
              {description}
            </Text>
          )}
          <FieldError>{errorMessage}</FieldError>
        </>
      ))}
    </RadioGroup>
  )
}

export { RadioGroup, Radio, JollyRadioGroup }
export type { JollyRadioGroupProps }
