/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useForm as usePrecognitionForm } from 'laravel-precognition-react-inertia'
import type { ChangeEvent, FormEvent } from 'react'

interface fieldObjects {
  [key: string]: number | string | boolean | undefined | null
}

interface FormProps<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  invalid: Record<string, boolean>
  processing: boolean
  submit: (e: FormEvent<HTMLFormElement>) => Promise<Partial<Record<keyof T, string>> | boolean>
  updateAndValidateWithoutEvent: (name: keyof T, value: T[keyof T]) => void
  updateAndValidate: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  validate: (name: keyof T, value: T[keyof T]) => void
  reset: () => void
  setDataFromObject: (data: Partial<T>) => void
  setData: (key: keyof T, value: T[keyof T]) => void
  validateAll: () => Promise<Partial<Record<keyof T, string>> | boolean>
  clearErrors: () => void
  setErrors: (errors: Partial<Record<keyof T, string>>) => void
  status: () => string
}

export const useForm = <T extends Record<string, any>>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  initialData: Partial<T>
): FormProps<T> => {
  const form = usePrecognitionForm(method, url, initialData)

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
          resolve(true)
        }
      })
    })
  }

  const validateAll = (): Promise<Partial<Record<keyof T, string>> | boolean> => {
    return new Promise((resolve, reject) => {
      form.submit({
        preserveScroll: true,
        onError: (errors: Partial<Record<keyof T, string>>) => {
          form.setErrors(errors)
          reject(errors)
        },
        onSuccess: () => {
          resolve(true)
        }
      })
    })
  }

  const validate = (name: keyof T) => {
    form.touched(name)
    form.validate(name)
  }

  const setDataFromObject = (data: fieldObjects) => {
    for (const [key, value] of Object.entries(data)) {
      form.setData(key as keyof T, value)
    }
  }

  const updateAndValidateWithoutEvent = (name: keyof T, value: T[keyof T]) => {
    form.setData(name, value)
    form.validate(name)
  }

  const updateAndValidate = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    form.touched(name)
    form.setData(name as keyof T, newValue)
    form.validate(name as keyof T)
  }

  const setErrors = (errors: Partial<Record<keyof T, string>>) => {
    form.setErrors(errors)
  }

  return {
    data: form.data,
    errors: form.errors,
    invalid: form.invalid,
    processing: form.processing,
    submit: handleSubmit,
    setErrors,
    validateAll,
    validate,
    updateAndValidate,
    status: form.status,
    updateAndValidateWithoutEvent,
    clearErrors: form.clearErrors,
    setDataFromObject,
    reset: form.reset,
    setData: form.setData
  }
}
