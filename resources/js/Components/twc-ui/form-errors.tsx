import { Sad01Icon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { useMemo } from 'react'
import { type FieldErrorProps as AriaFieldErrorProps, useLocale } from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { Alert } from './alert'
import { FieldError } from './field'
import { useFormContext } from './form'

type ErrorValue = string | string[]

export type FormErrorsMap = Partial<Record<string, ErrorValue>>

const toErrorString = (error: ErrorValue): string => {
  return Array.isArray(error) ? error[0] : error
}

export const getFormError = (
  errors: Record<string, unknown> | undefined,
  name?: string
): string | undefined => {
  if (!errors || !name) return undefined

  const directError = errors[name]
  if (directError) return toErrorString(directError as ErrorValue)

  const laravelName = name.replace(/\[(\d+)]/g, '.$1')
  const laravelError = errors[laravelName] as ErrorValue | undefined
  return laravelError ? toErrorString(laravelError) : undefined
}

interface Props {
  errors: FormErrorsMap
  className?: string
  title?: string
  showErrors?: boolean
}

export const FormErrors: React.FC<Props> = ({ className, errors, showErrors = true, title }) => {
  const { locale } = useLocale()

  const realErrorTitle = title?.trim() || 'Something went wrong'

  const errorMessages = useMemo(() => {
    if (!errors) return []
    return Object.values(errors).flatMap(error => {
      if (!error) return []
      if (Array.isArray(error)) return error
      return [error]
    })
  }, [errors])

  if (errorMessages.length === 0) {
    return null
  }

  if (!showErrors) return null
  return (
    <Alert variant="destructive" icon={Sad01Icon} title={realErrorTitle} className={className}>
      {showErrors && (
        <ul className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md list-inside list-disc text-xs">
          {errorMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      )}
    </Alert>
  )
}

export function FormFieldError({ className, ...props }: AriaFieldErrorProps) {
  const form = useFormContext()

  if (form?.errorVariant === 'form') return null

  return <FieldError className={cn('font-normal text-destructive text-xs', className)} {...props} />
}
