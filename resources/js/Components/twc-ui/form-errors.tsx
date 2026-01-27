import { Sad01Icon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { useMemo } from 'react'
import { type FieldErrorProps as AriaFieldErrorProps, useLocale } from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { Alert } from './alert'
import { FieldError } from './field'
import { useFormContext } from './form'

export type FormErrorsMap = Partial<Record<string, string>>

export const getFormError = (errors: FormErrorsMap | undefined, name?: string) => {
  if (!errors || !name) return undefined

  const directError = errors[name]
  if (directError) return directError

  const laravelName = name.replace(/\[(\d+)]/g, '.$1')
  return errors[laravelName]
}

interface Props {
  errors: FormErrorsMap
  className?: string
  title?: string
  showErrors?: boolean
}

export const FormErrors: React.FC<Props> = ({ className, errors, showErrors = true, title }) => {
  const { locale } = useLocale()

  const realErrorTitle = title
    ? title
    : locale.startsWith('de')
      ? 'Etwas ist schiefgelaufen'
      : 'Something went wrong'

  const errorMessages = useMemo(() => {
    if (!errors) return []
    return Object.values(errors)
  }, [errors])

  if (errorMessages.length === 0) {
    return null
  }

  return (
    <Alert variant="destructive" icon={Sad01Icon} title={realErrorTitle} className={className}>
      {showErrors && (
        <ul className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md list-inside list-disc text-sm">
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

  return <FieldError className={cn('font-medium text-destructive text-sm', className)} {...props} />
}
