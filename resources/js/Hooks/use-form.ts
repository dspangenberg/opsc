import type { FormDataConvertible } from '@inertiajs/core'
import { useForm as useInertiaForm } from 'laravel-precognition-react-inertia'
import type { ChangeEvent } from 'react'
import type { RequestMethod, ValidationConfig } from 'laravel-precognition'
import { isEqual } from 'moderndash'

type InputElements = HTMLInputElement | HTMLSelectElement;

export function useForm<T extends Record<string, FormDataConvertible>> (
  method: RequestMethod,
  url: string,
  data: T,
  config?: ValidationConfig
) {

  const initialData = {...data}
  const form = useInertiaForm<T>(method, url, data, config)
  const isDirty =!isEqual(initialData, form.data)

  const updateAndValidateWithoutEvent = (name: keyof T, value: T[keyof T]) => {
    form.setData(name, value)
    form.validate(name)
  }

  function register (name: keyof T) {
    return {
      name,
      value: form.data[name],
      error: form.errors[name],
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

  const registerCheckbox = (name: keyof T) => {
    return {
      name,
      checked: Boolean(form.data[name]),
      hasError: !!form.errors[name],
      isSelected:  Boolean(form.data[name]),
      onChange: (checked: boolean) => {
        form.setData(
          name,
          checked
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

  form.isDirty = isDirty

  return {
    ...form,
    isDirty,
    register,
    registerCheckbox,
    updateAndValidate,
    updateAndValidateWithoutEvent
  } as const
}
