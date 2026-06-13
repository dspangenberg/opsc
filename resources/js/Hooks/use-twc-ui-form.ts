import type { FormDataConvertible } from '@inertiajs/core'
import { useForm as useInertiaForm } from '@inertiajs/react'
import type { RangeValue } from '@react-types/shared'
import { format, isValid, parse, parseISO } from 'date-fns'
import type { ChangeEvent } from 'react'

type InputElements = HTMLInputElement | HTMLSelectElement

const DATE_FORMAT = import.meta.env.VITE_APP_DATE_FORMAT || 'yyyy-MM-dd'

/**
 * Helper function to get a nested value from an object using a path string
 * Supports both dot notation (obj.key) and array notation (arr[0])
 * @example getNestedValue(data, 'user.name') // returns data.user.name
 * @example getNestedValue(data, 'phones[0].number') // returns data.phones[0].number
 */
function getNestedValue(obj: any, path: string): any {
  // Convert array notation to dot notation: phones[0].number -> phones.0.number
  const normalizedPath = path.replace(/\[(\d+)]/g, '.$1')

  return normalizedPath.split('.').reduce((current, key) => {
    return current?.[key]
  }, obj)
}

/**
 * Helper function to set a nested value in an object using a path string
 * Supports both dot notation (obj.key) and array notation (arr[0])
 * Creates intermediate objects/arrays as needed
 * @example setNestedValue(data, 'user.name', 'John') // sets data.user.name = 'John'
 * @example setNestedValue(data, 'phones[0].number', '123') // sets data.phones[0].number = '123'
 */
function setNestedValue(obj: any, path: string, value: any): any {
  // Convert array notation to dot notation: phones[0].number -> phones.0.number
  const normalizedPath = path.replace(/\[(\d+)]/g, '.$1')
  const keys = normalizedPath.split('.')
  const lastKey = keys.pop()

  if (!lastKey) {
    return obj
  }

  // Navigate to the parent object, creating intermediate objects as needed
  const parent = keys.reduce((current, key, index) => {
    if (!(key in current)) {
      // Check if next key is a number (array index)
      const nextKey = keys[index + 1]
      current[key] = /^\d+$/.test(nextKey) ? [] : {}
    }

    return current[key]
  }, obj)

  parent[lastKey] = value

  return obj
}

export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'
export type FormValidationMode = 'change' | 'blur' | 'both' | 'none'

export interface FormValidationOptions {
  validateOn?: FormValidationMode
  onSuccess?: () => void
}

export function useForm<T extends Record<string, FormDataConvertible>>(
  method: RequestMethod,
  url: string,
  data: T,
  config?: FormValidationOptions
) {
  const configValue = config ?? {}
  const { validateOn: configValidateOn } = configValue
  // Inertia v3: passing method/url/data enables built-in Precognition
  const form = useInertiaForm(method, url, data as any)
  const validateOn = configValidateOn ?? 'blur'
  const shouldValidateOnChange = validateOn === 'change' || validateOn === 'both'
  const shouldValidateOnBlur = validateOn === 'blur' || validateOn === 'both'

  // Create a type-safe wrapper that bypasses Inertia's complex types
  // Now supports nested paths like 'phones[0].number'
  const setFormData = (name: string, value: any) => {
    // Check if this is a nested path (contains dots or brackets)
    if (name.includes('.') || name.includes('[')) {
      // Create a deep clone of the current data
      const updatedData = JSON.parse(JSON.stringify(form.data))
      // Set the nested value
      setNestedValue(updatedData, name, value)
      // Update the entire data object
      ;(form as any).setData(updatedData)
    } else {
      // Simple top-level field
      ;(form as any).setData(name, value)
    }
  }

  const validateFormField = (name: string) => {
    const laravelName = name.replace(/\[(\d+)]/g, '.$1')
    ;(form as any).validate(laravelName)
  }

  const touchAndValidateFormField = (name: string) => {
    const laravelName = name.replace(/\[(\d+)]/g, '.$1')
    ;(form as any).touch(laravelName)
    // validate() without args validates all touched fields, even if value is unchanged
    ;(form as any).validate()
  }

  const touchFormField = (name: string) => {
    const laravelName = name.replace(/\[(\d+)]/g, '.$1')
    ;(form as any).touch(laravelName)
  }

  const updateAndValidateWithoutEvent = (name: string, value: any) => {
    setFormData(name, value)

    if (shouldValidateOnChange) {
      validateFormField(name)
    }
  }

  function register(name: string) {
    const laravelName = name.replace(/\[(\d+)]/g, '.$1')
    const error = (form.errors as any)[name] || (form.errors as any)[laravelName]

    return {
      name,
      value:
        name.includes('.') || name.includes('[')
          ? getNestedValue(form.data, name)
          : (form.data as any)[name],
      error,
      onChange: (value: any) => {
        setFormData(name, value)

        if (shouldValidateOnChange) {
          validateFormField(name)
        }
      },
      onBlur: () => {
        if (shouldValidateOnBlur) {
          touchAndValidateFormField(name)
        }
      }
    } as const
  }

  function registerEvent(name: string) {
    const laravelName = name.replace(/\[(\d+)]/g, '.$1')
    const error = (form.errors as any)[name] || (form.errors as any)[laravelName]

    return {
      name,
      value:
        name.includes('.') || name.includes('[')
          ? getNestedValue(form.data, name)
          : (form.data as any)[name],
      error,
      onChange: (e: ChangeEvent<InputElements>) => {
        setFormData(name, e.currentTarget.value)

        if (shouldValidateOnChange) {
          validateFormField(name)
        }
      },
      onBlur: () => {
        if (shouldValidateOnBlur) {
          touchAndValidateFormField(name)
        }
      }
    } as const
  }

  const registerCheckbox = (name: string) => {
    // Get error using both array notation and Laravel dot notation
    const laravelName = name.replace(/\[(\d+)]/g, '.$1')
    const error = (form.errors as any)[name] || (form.errors as any)[laravelName]
    const value =
      name.includes('.') || name.includes('[')
        ? getNestedValue(form.data, name)
        : (form.data as any)[name]

    return {
      name,
      checked: Boolean(value),
      hasError: !!error,
      isSelected: Boolean(value),
      onChange: (checked: boolean) => {
        setFormData(name, checked)

        if (shouldValidateOnChange) {
          validateFormField(name)
        }
      },
      onBlur: () => {
        if (shouldValidateOnBlur) {
          touchAndValidateFormField(name)
        }
      }
    } as const
  }

  const updateAndValidate = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    touchFormField(name)
    setFormData(name, newValue)

    if (shouldValidateOnChange) {
      validateFormField(name)
    }
  }

  // Hilfsfunktion: Konvertiert Datum vom konfigurierten Format zu ISO (yyyy-MM-dd) mit date-fns
  const convertToISO = (dateString: string): string | null => {
    if (!dateString) {
      return null
    }

    try {
      // Wenn bereits im ISO-Format (yyyy-MM-dd)
      if (DATE_FORMAT === 'yyyy-MM-dd') {
        // Validiere, dass es ein gültiges Datum ist
        const date = parseISO(dateString)

        return isValid(date) ? dateString : null
      }

      // Parse mit dem konfigurierten Format
      const parsedDate = parse(dateString, DATE_FORMAT, new Date())

      if (isValid(parsedDate)) {
        return format(parsedDate, 'yyyy-MM-dd')
      }
    } catch (error) {
      console.warn('Fehler beim Konvertieren zu ISO-Format:', dateString, error)
    }

    return null
  }

  // Hilfsfunktion: Konvertiert Datum von ISO (yyyy-MM-dd) zum konfigurierten Format mit date-fns
  const convertFromISO = (isoDateString: string): string => {
    if (!isoDateString) {
      return ''
    }

    try {
      // Wenn das Zielformat bereits yyyy-MM-dd ist
      if (DATE_FORMAT === 'yyyy-MM-dd') {
        return isoDateString
      }

      // Parse ISO-Format und formatiere zum konfigurierten Format
      const date = parseISO(isoDateString)

      if (isValid(date)) {
        return format(date, DATE_FORMAT)
      }
    } catch (error) {
      console.warn('Fehler beim Konvertieren von ISO-Format:', isoDateString, error)
    }

    return isoDateString // Fallback
  }

  // Neue registerDateRange Funktion für separate start/end Felder
  const registerDateRange = (startFieldName: string, endFieldName: string) => {
    // Konvertiere die gespeicherten Werte zu RangeValue für DateRangePicker
    const convertToRangeValue = (): RangeValue<string> | null => {
      const startValue = (form.data as any)[startFieldName] as string
      const endValue = (form.data as any)[endFieldName] as string

      if (!startValue || !endValue) {
        return null
      }

      // Konvertiere beide Werte mit date-fns zu ISO-Format
      const startISO = convertToISO(startValue)
      const endISO = convertToISO(endValue)

      if (startISO && endISO) {
        return { start: startISO, end: endISO }
      }

      return null
    }

    const value = convertToRangeValue()
    const error = (form.errors as any)[startFieldName] || (form.errors as any)[endFieldName]

    return {
      name: `${startFieldName}_${endFieldName}`,
      value,
      error,
      onChange: (rangeValue: RangeValue<string> | null) => {
        if (rangeValue) {
          // Konvertiere von yyyy-MM-dd zurück zum konfigurierten Format mit date-fns
          const startFormatted = convertFromISO(rangeValue.start)
          const endFormatted = convertFromISO(rangeValue.end)

          setFormData(startFieldName, startFormatted)
          setFormData(endFieldName, endFormatted)

          if (shouldValidateOnChange) {
            validateFormField(startFieldName)
            validateFormField(endFieldName)
          }
        } else {
          setFormData(startFieldName, null)
          setFormData(endFieldName, null)

          if (shouldValidateOnChange) {
            validateFormField(startFieldName)
            validateFormField(endFieldName)
          }
        }
      },
      onBlur: () => {
        if (shouldValidateOnBlur) {
          touchAndValidateFormField(startFieldName)
          touchAndValidateFormField(endFieldName)
        }
      }
    } as const
  }

  // Wrap submit to automatically include method and url (Inertia v3 requires both)
  const submit = (options: any) => (form as any).submit(method, url, options)

  return {
    ...form,
    isDirty: form.isDirty,
    recentlySuccessful: form.recentlySuccessful,
    register,
    registerEvent,
    registerCheckbox,
    registerDateRange,
    updateAndValidate,
    updateAndValidateWithoutEvent,
    submit,
    transform: form.transform
  } as const
}
