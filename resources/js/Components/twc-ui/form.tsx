import type { FormDataConvertible } from '@inertiajs/core'
import type React from 'react'
import type { FormEvent, HTMLAttributes } from 'react'
import { createContext, useContext } from 'react'
import type { FormValidationOptions, RequestMethod } from '@/Hooks/use-twc-ui-form'
import { useForm as internalUseForm } from '@/Hooks/use-twc-ui-form'
import { cn } from '@/Lib/utils'
import { FormErrors } from './form-errors'

export type FormSchema = Record<string, FormDataConvertible>

type SimpleValidationErrors = Record<string, string[]>
type UseFormReturn<T extends FormSchema> = ReturnType<typeof internalUseForm<T>>
type BaseFormProps = Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'>

// Erweiterte Form-Typ Definition - mit korrektem errors Typ
type ExtendedForm<T extends FormSchema> = {
  id: string
  className?: string
  method: RequestMethod
  action: string
  config: FormValidationOptions
  isDirty: boolean
  recentlySuccessful: boolean
  reset: UseFormReturn<T>['reset']
  register: UseFormReturn<T>['register']
  registerEvent: UseFormReturn<T>['registerEvent']
  registerDateRange: UseFormReturn<T>['registerDateRange']
  registerCheckbox: UseFormReturn<T>['registerCheckbox']
  updateAndValidate: UseFormReturn<T>['updateAndValidate']
  updateAndValidateWithoutEvent: UseFormReturn<T>['updateAndValidateWithoutEvent']
  data: T
  errors: UseFormReturn<T>['errors']
  processing: boolean
  submit: UseFormReturn<T>['submit']
  setData: UseFormReturn<T>['setData']
  setError: UseFormReturn<T>['setError']
  validate: UseFormReturn<T>['validate']
  touched: UseFormReturn<T>['touched']
  transform: UseFormReturn<T>['transform']
  form: UseFormReturn<T> & { id: string }
}

// Typisierter Context mit zusätzlichen UI-Properties
type FormContextValue = {
  errorTitle?: string
  errorVariant?: 'form' | 'field'
  errorClassName?: string
  [key: string]: any // Erlaubt alle ExtendedForm Properties
}

const FormContext = createContext<FormContextValue | null>(null)

interface FormProps<T extends FormSchema> extends BaseFormProps {
  form: ExtendedForm<T>
  children: React.ReactNode
  onSubmit?: (e: FormEvent<HTMLFormElement>) => Promise<void> | void
  onSubmitted?: () => void
  errorTitle?: string
  className?: string
  errorVariant?: 'form' | 'field'
  errorClassName?: string
  preserveState?: boolean
}

export const Form = <T extends FormSchema>({
  form,
  children,
  errorVariant = 'form',
  errorTitle,
  errorClassName,
  onSubmit,
  onSubmitted,
  className,
  preserveState = true,
  ...props
}: FormProps<T>) => {
  if (!form) {
    console.error('Form component received undefined form prop')

    return null
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<SimpleValidationErrors | boolean> => {
    e.preventDefault()

    // If custom onSubmit is provided, call it instead of default behavior
    if (onSubmit) {
      try {
        await onSubmit(e)
        onSubmitted?.()

        return Promise.resolve(true)
      } catch (error) {
        console.error('Error in custom onSubmit handler:', error)

        return Promise.reject(error)
      }
    }

    return new Promise((resolve, reject) => {
      form.submit({
        preserveScroll: true,
        preserveState,
        onError: (errors: Record<string, string | string[]>) => {
          const simpleErrors = Object.entries(errors).reduce<SimpleValidationErrors>((acc, [key, value]) => {
            acc[key] = Array.isArray(value) ? value : [value]

            return acc
          }, {})
          form.setError(simpleErrors)
          reject(simpleErrors)
        },
        onSuccess: () => {
          onSubmitted?.()
          resolve(true)
        }
      })
    })
  }

  return (
    <FormContext.Provider
      value={{
        ...form,
        errorTitle,
        errorVariant,
        errorClassName
      }}
    >
      <form
        id={form.id}
        method={form.method}
        action={form.action}
        onSubmit={handleSubmit}
        className={cn('w-full', className)}
        {...props}
      >
        {form.errors && (
          <FormErrors
            className={errorClassName}
            errors={form.errors}
            title={errorTitle}
            showErrors={errorVariant === 'form'}
          />
        )}
        <fieldset disabled={form.processing}>{children}</fieldset>
      </form>
    </FormContext.Provider>
  )
}

export const useFormContext = <T extends FormSchema = FormSchema>() => {
  const context = useContext(FormContext)

  if (context === null) {
    return null
  }

  return context as ExtendedForm<T> & {
    errorTitle?: string
    errorClass?: string
    errorVariant?: 'form' | 'field'
  }
}

export function useForm<T extends FormSchema>(
  id: string,
  method: RequestMethod,
  action: string,
  data: T,
  configOrClassName?: FormValidationOptions | string,
  className?: string
): ExtendedForm<T> {
  const config = typeof configOrClassName === 'string' ? {} : (configOrClassName ?? {})
  const resolvedClassName = typeof configOrClassName === 'string' ? configOrClassName : className
  const internalForm = internalUseForm(method, action, data, config)

  const onSuccessHandler = config.onSuccess

  return {
    id,
    className: resolvedClassName,
    method,
    action,
    config,
    isDirty: internalForm.isDirty,
    recentlySuccessful: internalForm.recentlySuccessful,
    register: internalForm.register,
    registerEvent: internalForm.registerEvent,
    registerCheckbox: internalForm.registerCheckbox,
    registerDateRange: internalForm.registerDateRange,
    updateAndValidate: internalForm.updateAndValidate,
    updateAndValidateWithoutEvent: internalForm.updateAndValidateWithoutEvent,
    data: internalForm.data,
    errors: internalForm.errors,
    processing: internalForm.processing,
    submit: (options?: any) =>
      internalForm.submit({
        ...options,
        onSuccess: () => {
          options?.onSuccess?.()
          onSuccessHandler?.()
        }
      }),
    setData: internalForm.setData,
    reset: internalForm.reset,
    setError: internalForm.setError,
    validate: internalForm.validate,
    touched: internalForm.touched,
    transform: internalForm.transform,
    form: {
      id,
      ...internalForm
    }
  }
}
