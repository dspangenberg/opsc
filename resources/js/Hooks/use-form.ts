import type { FormDataConvertible } from '@inertiajs/core'
import { useForm as useInertiaForm } from 'laravel-precognition-react-inertia'
import type { ChangeEvent } from 'react'
import type { RequestMethod, ValidationConfig } from 'laravel-precognition'

type InputElements = HTMLInputElement | HTMLSelectElement;

export function useForm<T extends Record<string, FormDataConvertible>> (
  method: RequestMethod,
  url: string,
  data: T,
  config?: ValidationConfig
) {
  const form = useInertiaForm<T>(method, url, data, config)

  const updateAndValidateWithoutEvent = (name: keyof T, value: T[keyof T]) => {
    form.setData(name, value)
    form.validate(name)
  }

  function register (name: keyof T) {
    return {
      name,
      value: form.data[name],
      hasError: form.errors[name],
      onChange: (e: ChangeEvent<InputElements>) => {
        form.setData(
          name,
          e.currentTarget.value as (typeof form.data)[typeof name]
        )
        form.validate(name)
      },
      onBlur: () => {
        form.validate(name)
      }
    } as const
  }

  const updateAndValidate = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const {
      name,
      value,
      type
    } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    form.touched(name)
    form.setData(name as keyof T, newValue)
    form.validate(name as keyof T)
  }

  return {
    ...form,
    register,
    updateAndValidate,
    updateAndValidateWithoutEvent
  } as const
}
