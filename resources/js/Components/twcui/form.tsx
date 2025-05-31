import type { FormDataConvertible } from '@inertiajs/core'
import type React from 'react'
import { createContext, type HTMLAttributes, useContext, type FormEvent } from 'react'
import { useForm as internalUseForm } from '@/Hooks/use-form'
import type { RequestMethod, ValidationConfig } from 'laravel-precognition'
import { cn } from '@/Lib/utils'
import { FormErrors } from '@/Components/twcui/form-errors'

export type FormSchema = Record<string, FormDataConvertible>;

type UseFormReturn<T extends FormSchema> = ReturnType<typeof internalUseForm<T>>;
type BaseFormProps = Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'>;

const FormContext = createContext<UseFormReturn<FormSchema> | null>(null)

interface FormProps<T extends FormSchema> extends BaseFormProps {
  form: ReturnType<typeof useForm<T>>
  children: React.ReactNode
  onSubmitted?: () => void,
  className?: string
}

export const Form = <T extends FormSchema> ({
  form,
  children,
  onSubmitted,
  ...props
}: FormProps<T>) => {
  if (!form) {
    console.error('Form component received undefined form prop')
    return null
  }
  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ): Promise<Partial<Record<keyof T, string>> | boolean> => {
    e.preventDefault()
    return new Promise((resolve, reject) => {
      form.submit({
        preserveScroll: true,
        onError: (errors: Partial<Record<keyof T, string>>) => {
          form.setErrors(errors)
          reject(errors)
        },
        onSuccess: () => {
          onSubmitted?.()
          resolve(true)
        }
      })
    })
  }


  return (
    <FormContext.Provider value={form as UseFormReturn<FormSchema>}>
      <form
        id={form.id}
        method={form.method}
        action={form.action}
        onSubmit={handleSubmit}
        className={cn('w-full', form.className)}
        {...props}
      >
        <FormErrors errors={form.errors} />
        <div className="divide-y divide-border">
          {children}
        </div>
      </form>
    </FormContext.Provider>
  )
}

export const useFormContext = <T extends FormSchema> () => {
  const context = useContext(FormContext)
  if (context === null) {
    throw new Error('useFormContext must be used within a Form component')
  }
  return context as UseFormReturn<T>
}

export const useForm = <T extends FormSchema> (
  id: string,
  method: RequestMethod,
  action: string,
  data: T,
  config: ValidationConfig = {}
) => {
  const internalForm = internalUseForm(method, action, data, config)

  return {
    ...internalForm,
    id,
    form: {
      id,
      ...internalForm
    },
    method,
    action,
    config,
    errors: internalForm.errors || {},
    data: internalForm.data || data
  }
}
