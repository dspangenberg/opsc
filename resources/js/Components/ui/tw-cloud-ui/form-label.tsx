import { Label } from '@/Components/ui/label'
import { cn } from '@/Lib/utils'
import type { LabelHTMLAttributes, ReactNode } from 'react'

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  value?: string
  children?: ReactNode
  required?: boolean
  className?: string
  asChild?: boolean
}

export function FormLabel({
  value,
  children,
  className,
  asChild = false,
  required = false,
  ...props
}: FormLabelProps) {
  const valueWithColon = value ? `${value}:` : value
  const attributes = required ? { 'data-required': 'true' } : {}

  return (
    <Label
      {...props}
      {...attributes}
      className={cn('font-normal text text-base leading-none', className)}
    >
      {valueWithColon ?? children} {required && <span className="text-red-600">*</span>}
    </Label>
  )
}
