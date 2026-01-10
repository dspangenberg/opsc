import type { FormDataConvertible } from '@inertiajs/core'
import type { RequestMethod, SimpleValidationErrors, ValidationConfig } from 'laravel-precognition'
import type React from 'react'
import { createContext, type FormEvent, type HTMLAttributes, useContext } from 'react'
import { useForm as internalUseForm } from '@/Hooks/use-twc-ui-form'
import { cn } from '@/Lib/utils'
import { FormErrors } from './form-errors'

export type FormSchema = Record<string, FormDataConvertible>

type UseFormReturn<T extends FormSchema> = ReturnType<typeof internalUseForm<T>>
type BaseFormProps = Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'>

// Erweiterte Form-Typ Definition - mit korrektem errors Typ
type ExtendedForm<T extends FormSchema> = {
  id: string
  className?: string
  method: RequestMethod
  action: string
  config: ValidationConfig
  isDirty: boolean
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
  setErrors: UseFormReturn<T>['setErrors']
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
  onSubmitted?: () => void
  errorTitle?: string
  className?: string
  errorVariant?: 'form' | 'field'
  errorClassName?: string
}

export const Form = <T extends FormSchema>({
  form,
  children,
  errorVariant = 'form',
  errorTitle,
  errorClassName,
  onSubmitted,
  className,
  ...props
}: FormProps<T>) => {
  if (!form) {
    console.error('Form component received undefined form prop')
    return null
  }
  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ): Promise<SimpleValidationErrors | boolean> => {
    e.preventDefault()
    return new Promise((resolve, reject) => {
      form.submit({
        preserveScroll: true,
        onError: (errors) => {
          // Convert Inertia errors (string[]) to SimpleValidationErrors (string)
          const simpleErrors = Object.entries(errors).reduce((acc, [key, value]) => {
            acc[key] = Array.isArray(value) ? value[0] : value
            return acc
          }, {} as SimpleValidationErrors)
          form.setErrors(simpleErrors)
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
        <FormErrors
          className={errorClassName}
          errors={form.errors}
          title={errorTitle}
          showErrors={errorVariant === 'form'}
        />
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

export const useForm = <T extends FormSchema>(
  id: string,
  method: RequestMethod,
  action: string,
  data: T,
  config: ValidationConfig = {},
  className?: string
): ExtendedForm<T> => {
  const internalForm = internalUseForm(method, action, data, config)

  return {
    id,
    className,
    method,
    action,
    config,
    isDirty: internalForm.isDirty,
    register: internalForm.register,
    registerEvent: internalForm.registerEvent,
    registerCheckbox: internalForm.registerCheckbox,
    registerDateRange: internalForm.registerDateRange,
    updateAndValidate: internalForm.updateAndValidate,
    updateAndValidateWithoutEvent: internalForm.updateAndValidateWithoutEvent,
    data: internalForm.data,
    errors: internalForm.errors,
    processing: internalForm.processing,
    submit: internalForm.submit,
    setData: internalForm.setData,
    reset: internalForm.reset,
    setErrors: internalForm.setErrors,
    validate: internalForm.validate,
    touched: internalForm.touched,
    transform: internalForm.transform,
    form: {
      id,
      ...internalForm
    }
  }
}
