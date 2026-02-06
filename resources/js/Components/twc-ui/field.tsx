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
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/Lib/utils'

const labelVariants = tv({
  base: [
    'font-normal text-sm leading-none',
    /* Disabled */
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
    /* Invalid */
    'group-data-[invalid]:text-destructive'
  ]
})

interface LabelProps extends AriaLabelProps {
  isRequired?: boolean
  value?: string
}

const Label = ({ className, children, value, isRequired = false, ...props }: LabelProps) => {
  const valueWithColon = value ? `${value}:` : ''
  return (
    <AriaLabel className={cn(labelVariants(), className)} {...props}>
      {children ? (
        children
      ) : (
        <span>
          {valueWithColon ?? ''} {isRequired && <span className="text-destructive">*</span>}
        </span>
      )}
    </AriaLabel>
  )
}

function FieldDescription({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
      slot="description"
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

const fieldGroupVariants = tv({
  variants: {
    variant: {
      default: [
        'relative flex h-9 w-full items-center overflow-hidden rounded-sm border border-input bg-background px-3 py-1 font-medium text-base shadow-none transition-colors',
        /* Focus Within */
        'focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/20 focus:border-primary',
        'data-[invalid]:border-destructive data-[invalid]:focus-within:border-destructive data-[invalid]:focus-within:ring-destructive/20',
        /* Disabled */
        'data-disabled:cursor-not-allowed data-disabled:opacity-50'
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
        fieldGroupVariants({ variant, className })
      )}
      {...props}
    />
  )
}

export { Label, labelVariants, FieldGroup, fieldGroupVariants, FieldError, FieldDescription }
