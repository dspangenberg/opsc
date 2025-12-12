import { cva, type VariantProps } from 'class-variance-authority'
import {
  FieldError as AriaFieldError,
  type FieldErrorProps as AriaFieldErrorProps,
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  Text as AriaText,
  type TextProps as AriaTextProps,
  composeRenderProps
} from 'react-aria-components'
import { useFormContext } from './form'
import { cn } from '@/Lib/utils'

const labelVariants = cva([
  'text-sm font-normal leading-none',
  /* Disabled */
  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70',
  /* Invalid */
  'group-data-[invalid]:text-destructive'
])

interface LabelProps extends AriaLabelProps {
  isRequired?: boolean
  value?: string
}

const Label = ({ className, children, value, isRequired = false, ...props }: LabelProps) => {
  const form = useFormContext()

  const valueWithColon = value && !form?.hideColonInLabels ? `${value}:` : value
  return (
    <AriaLabel className={cn(labelVariants(), className)} {...props}>
      {valueWithColon ?? children} {isRequired && <span className="text-destructive">*</span>}
    </AriaLabel>
  )
}

function FieldDescription({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
      slot="description"
    />
  )
}

function FormFieldError({ className, ...props }: AriaFieldErrorProps) {
  const form = useFormContext()

  if (form?.errorVariant === 'form') return null

  return (
    <AriaFieldError
      className={cn('font-medium text-[0.8rem] text-destructive', className)}
      {...props}
    />
  )
}

function FieldError({ className, ...props }: AriaFieldErrorProps) {
  return (
    <AriaFieldError
      className={cn('font-medium text-[0.8rem] text-destructive', className)}
      {...props}
    />
  )
}

const fieldGroupVariants = cva('', {
  variants: {
    variant: {
      default: [
        'relative flex h-9 w-full items-center overflow-hidden rounded-sm border border-input bg-background px-3 py-1 text-base font-medium shadow-none transition-colors',
        /* Focus Within */
        'focus:border-primary focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/20',
        'data-[invalid]:focus-within:ring-destructive/20  data-[invalid]:focus-within:border-destructive  data-[invalid]:border-destructive',
        /* Disabled */
        'data-[disabled]:opacity-50'
      ],
      ghost: 'w-full data-[invalid]:border-destructive'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface GroupProps extends AriaGroupProps, VariantProps<typeof fieldGroupVariants> {}

function FieldGroup({ className, variant, ...props }: GroupProps) {
  return (
    <AriaGroup
      className={composeRenderProps(className, className =>
        cn(fieldGroupVariants({ variant }), className)
      )}
      {...props}
    />
  )
}

export { Label, labelVariants, FieldGroup, fieldGroupVariants, FormFieldError, FieldError, FieldDescription }
