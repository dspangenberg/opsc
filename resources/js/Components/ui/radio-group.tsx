import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import * as React from 'react'

import { cn, focusInput } from '@/Lib/utils'

export interface RadioGroupProps<T>
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    'value' | 'defaultValue' | 'onValueChange'
  > {
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
}

export interface RadioGroupItemProps<T>
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'value'> {
  value: T
}

const RadioGroup = (<T,>(
  {
    ref,
    className,
    ...props
  }: RadioGroupProps<T> & {
    ref: React.RefObject<HTMLDivElement>;
  }
) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...(props as RadioGroupPrimitive.RadioGroupProps)}
      ref={ref}
    />
  )
}) as <T>(props: RadioGroupProps<T> & { ref?: React.Ref<HTMLDivElement> }) => React.ReactElement

const RadioGroupItem = (<T,>(
  {
    ref,
    className,
    ...props
  }: RadioGroupItemProps<T> & {
    ref: React.RefObject<HTMLButtonElement>;
  }
) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-input shadow-xs shadow-black/5 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/90 data-[state=checked]:text-white',
        focusInput,
        className
      )}
      {...(props as RadioGroupPrimitive.RadioGroupItemProps)}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center text-current">
        <svg
          width="6"
          height="6"
          viewBox="0 0 6 6"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Radio button indicator</title>
          <circle cx="3" cy="3" r="3" />
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}) as <T>(
  props: RadioGroupItemProps<T> & { ref?: React.Ref<HTMLButtonElement> }
) => React.ReactElement

export { RadioGroup, RadioGroupItem }
