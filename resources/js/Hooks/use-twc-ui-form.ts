import type { FormDataConvertible } from '@inertiajs/core'
import type { RangeValue } from '@react-types/shared'
import { format, isValid, parse, parseISO } from 'date-fns'
import type { RequestMethod, ValidationConfig } from 'laravel-precognition'
import { useForm as useInertiaForm } from 'laravel-precognition-react-inertia'
import { isEqual } from 'moderndash'
import type { ChangeEvent } from 'react'
import { useRef } from 'react'

type InputElements = HTMLInputElement | HTMLSelectElement

const DATE_FORMAT = import.meta.env.VITE_APP_DATE_FORMAT || 'yyyy-MM-dd'

export function useForm<T extends Record<string, FormDataConvertible>>(
  method: RequestMethod,
  url: string,
  data: T,
  config?: ValidationConfig
) {
  // Capture the very first snapshot only once
  const initialDataRef = useRef({ ...data })
  const form = useInertiaForm<T>(method, url, data, config)
  const isDirty = !isEqual(initialDataRef.current, form.data)

  // Create a type-safe wrapper that bypasses Inertia's complex types
  const setFormData = (name: string, value: any) => {
    ;(form as any).setData(name, value)
  }

  const validateFormField = (name: string) => {
    ;(form as any).validate(name)
  }

  const touchFormField = (name: string) => {
    ;(form as any).touched(name)
  }

  const updateAndValidateWithoutEvent = (name: string, value: any) => {
    setFormData(name, value)
    validateFormField(name)
  }

  function register(name: string) {
    return {
      name,
      value: (form.data as any)[name],
      error: (form.errors as any)[name],
      onChange: (value: any) => {
        setFormData(name, value)
        validateFormField(name)
      },
      onBlur: () => {
        validateFormField(name)
      }
    } as const
  }

  function registerEvent(name: string) {
    return {
      name,
      value: (form.data as any)[name],
      error: (form.errors as any)[name],
      onChange: (e: ChangeEvent<InputElements>) => {
        setFormData(name, e.currentTarget.value)
        validateFormField(name)
      },
      onBlur: () => {
        validateFormField(name)
      }
    } as const
  }

  const registerCheckbox = (name: string) => {
    return {
      name,
      checked: Boolean((form.data as any)[name]),
      hasError: !!(form.errors as any)[name],
      isSelected: Boolean((form.data as any)[name]),
      onChange: (checked: boolean) => {
        setFormData(name, checked)
        validateFormField(name)
      },
      onBlur: () => {
        validateFormField(name)
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
    validateFormField(name)
  }

  // Hilfsfunktion: Konvertiert Datum vom konfigurierten Format zu ISO (yyyy-MM-dd) mit date-fns
  const convertToISO = (dateString: string): string | null => {
    if (!dateString) return null

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
    if (!isoDateString) return ''

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

      if (!startValue || !endValue) return null

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
          validateFormField(startFieldName)
          validateFormField(endFieldName)
        } else {
          setFormData(startFieldName, null)
          setFormData(endFieldName, null)
          validateFormField(startFieldName)
          validateFormField(endFieldName)
        }
      },
      onBlur: () => {
        validateFormField(startFieldName)
        validateFormField(endFieldName)
      }
    } as const
  }

  // Add isDirty to the form object
  ;(form as any).isDirty = isDirty

  return {
    ...form,
    isDirty,
    register,
    registerEvent,
    registerCheckbox,
    registerDateRange,
    updateAndValidate,
    updateAndValidateWithoutEvent,
    transform: form.transform
  } as const
}
