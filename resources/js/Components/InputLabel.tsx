import { Label } from '@/Components/ui/label'
import type { LabelHTMLAttributes } from 'react'

export default function FormLabel({
  value,
  className = '',
  children,
  htmlFor,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
  return (
    <label {...props} className={`block text-sm text-gray-700 ${className}`} htmlFor={htmlFor}>
      {value ? value : children}
    </label>
  )
}
