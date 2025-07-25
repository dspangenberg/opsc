import * as React from "react"
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
  type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components"

import { cn } from "@/Lib/utils"

import { FieldError, Label, labelVariants } from "./field"

interface TWCUICheckBoxProps {
  label?: string
  name: string
  className?: string
  autoFocus?: boolean
  hasError?: boolean
  isIndeterminate?: boolean
  isSelected?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  checked?: boolean
  children?: React.ReactNode
}

const CheckboxGroup = AriaCheckboxGroup

const Checkbox = ({ className, children, ...props }: AriaCheckboxProps) => (
  <AriaCheckbox
    className={composeRenderProps(className, (className) =>
      cn(
        "group/checkbox flex items-center gap-x-2",
        /* Disabled */
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70 items-center",
        labelVariants,
        className
      )
    )}
    {...props}
  >
    {composeRenderProps(children, (children, renderProps) => (
      <>
        <div
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-sm text-base border border-input text-current",
            /* Focus Visible */
            "group-data-[focus-visible]/checkbox:outline-none group-data-[focus-visible]/checkbox:ring-1 group-data-[focus-visible]/checkbox:ring-ring",
            /* Selected */
            "group-data-[indeterminate]/checkbox:bg-primary group-data-[selected]/checkbox:bg-primary group-data-[indeterminate]/checkbox:text-primary-foreground  group-data-[selected]/checkbox:text-primary-foreground",
            /* Disabled */
            "group-data-[disabled]/checkbox:cursor-not-allowed group-data-[disabled]/checkbox:opacity-50",
            /* Invalid */
            "group-data-[invalid]/checkbox:border-destructive group-data-[invalid]/checkbox:group-data-[selected]/checkbox:bg-destructive group-data-[invalid]/checkbox:group-data-[selected]/checkbox:text-destructive-foreground",
            /* Resets */
            "focus-visible:outline-none"
          )}
        >
          {renderProps.isIndeterminate ? (
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="currentcolor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Checkbox indeterminate</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.75 4.5C0.75 4.08579 1.08579 3.75 1.5 3.75H7.5C7.91421 3.75 8.25 4.08579 8.25 4.5C8.25 4.91421 7.91421 5.25 7.5 5.25H1.5C1.08579 5.25 0.75 4.91421 0.75 4.5Z"
                />
              </svg>
          ) : renderProps.isSelected ? (
            <svg
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="currentcolor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Checkbox checked</title>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.9764 8.49358C3.75883 8.52167 3.53987 8.45309 3.3772 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.84105 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"
              />
            </svg>
          ) : null}
        </div>
        <Label htmlFor="props.name" className="font-medium">{children}</Label>
      </>
    ))}
  </AriaCheckbox>
)

interface JollyCheckboxGroupProps extends AriaCheckboxGroupProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function JollyCheckboxGroup({
  label,
  description,
  errorMessage,
  className,
  children,
  ...props
}: JollyCheckboxGroupProps) {
  return (
    <CheckboxGroup
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className)
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          <Label>{label}</Label>
          {children}
          {description && (
            <Text className="text-sm text-muted-foreground" slot="description">
              {description}
            </Text>
          )}
          <FieldError>{errorMessage}</FieldError>
        </>
      ))}
    </CheckboxGroup>
  )
}

const TWCUICheckbox = ({
  label,
  name,
  className = '',
  autoFocus = false,
  hasError = false,
  isSelected = false,
  isIndeterminate = false,
  onChange,
  checked,
  children,
  ...props
}: TWCUICheckBoxProps) => {
  const handleChange = (isSelected: boolean) => {
    console.log('checkbox change', isSelected);
    // Create a synthetic event
    const syntheticEvent = {
      target: {
        name,
        checked: isSelected,
        type: 'checkbox',
        value: isSelected.toString()
      },
      currentTarget: {
        name,
        checked: isSelected,
        type: 'checkbox',
        value: isSelected.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <AriaCheckbox
      onChange={handleChange}
      isSelected={isSelected}
      isIndeterminate={isIndeterminate}
      className={composeRenderProps(className, (className) =>
        cn(
          "group/checkbox flex items-center gap-x-2",
          /* Disabled */
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70 items-center",
          labelVariants,
          className
        )
      )}
      isInvalid={hasError}
    >
      {composeRenderProps(children || label, (children, renderProps) => (
        <>
          <div
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-sm text-base border border-input text-current",
              /* Focus Visible */
              "group-data-[focus-visible]/checkbox:outline-none group-data-[focus-visible]/checkbox:ring-1 group-data-[focus-visible]/checkbox:ring-ring",
              /* Selected */
              "group-data-[indeterminate]/checkbox:bg-primary group-data-[selected]/checkbox:bg-primary group-data-[indeterminate]/checkbox:text-primary-foreground  group-data-[selected]/checkbox:text-primary-foreground",
              /* Disabled */
              "group-data-[disabled]/checkbox:cursor-not-allowed group-data-[disabled]/checkbox:opacity-50",
              /* Invalid */
              "group-data-[invalid]/checkbox:border-destructive group-data-[invalid]/checkbox:group-data-[selected]/checkbox:bg-destructive group-data-[invalid]/checkbox:group-data-[selected]/checkbox:text-destructive-foreground",
              /* Resets */
              "focus-visible:outline-none"
            )}
          >
            {renderProps.isIndeterminate ? (
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 9 9"
                  fill="currentcolor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Checkbox indeterminate</title>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.75 4.5C0.75 4.08579 1.08579 3.75 1.5 3.75H7.5C7.91421 3.75 8.25 4.08579 8.25 4.5C8.25 4.91421 7.91421 5.25 7.5 5.25H1.5C1.08579 5.25 0.75 4.91421 0.75 4.5Z"
                  />
                </svg>
            ) : renderProps.isSelected ? (
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="currentcolor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Checkbox checked</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.9764 8.49358C3.75883 8.52167 3.53987 8.45309 3.3772 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.84105 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"
                />
              </svg>
            ) : null}
          </div>
          <Label htmlFor="props.name" className="font-medium">{children}</Label>
        </>
      ))}
    </AriaCheckbox>
  )
}

// Export the original components
export { Checkbox as JollyCheckbox, CheckboxGroup, JollyCheckboxGroup, TWCUICheckbox }
export type { JollyCheckboxGroupProps, TWCUICheckBoxProps }

// Re-export TWCUICheckbox as Checkbox for backward compatibility with twcui/checkbox
export { TWCUICheckbox as Checkbox }
