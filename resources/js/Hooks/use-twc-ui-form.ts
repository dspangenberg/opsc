import type { FormDataConvertible, FormDataKeys, FormDataValues } from '@inertiajs/core'
import type { RangeValue } from '@react-types/shared'
import { format, isValid, parse, parseISO } from 'date-fns'
import type { RequestMethod, ValidationConfig } from 'laravel-precognition'
import { useForm as useInertiaForm } from 'laravel-precognition-react-inertia'
import { isEqual } from 'moderndash'
import type { ChangeEvent } from 'react'
import { useRef } from 'react'

type InputElements = HTMLInputElement | HTMLSelectElement

console.log('!', import.meta.env.VITE_APP_DATE_FORMAT)
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

  const updateAndValidateWithoutEvent = <K extends FormDataKeys<T>>(
    name: K,
    value: FormDataValues<T, K>
  ) => {
    form.setData(name, value)
    form.validate(name)
  }

  function register<K extends FormDataKeys<T>>(name: K) {
    return {
      name,
      value: form.data[name],
      error: form.errors[name],
      onChange: (value: FormDataValues<T, K> | null) => {
        form.setData(name, value as FormDataValues<T, K>)
        form.validate(name)
      },
      onBlur: () => {
        form.validate(name)
      }
    } as const
  }

  function registerEvent<K extends FormDataKeys<T>>(name: K) {
    return {
      name,
      value: form.data[name],
      error: form.errors[name],
      onChange: (e: ChangeEvent<InputElements>) => {
        form.setData(name, e.currentTarget.value as FormDataValues<T, K>)
        form.validate(name)
      },
      onBlur: () => {
        form.validate(name)
      }
    } as const
  }

  const registerCheckbox = <K extends FormDataKeys<T>>(name: K) => {
    return {
      name,
      checked: Boolean(form.data[name]),
      hasError: !!form.errors[name],
      isSelected: Boolean(form.data[name]),
      onChange: (checked: boolean) => {
        form.setData(name, checked as FormDataValues<T, K>)
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
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    form.touched(name)
    form.setData(name as FormDataKeys<T>, newValue as FormDataValues<T, FormDataKeys<T>>)
    form.validate(name as FormDataKeys<T>)
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
  const registerDateRange = <KStart extends FormDataKeys<T>, KEnd extends FormDataKeys<T>>(
    startFieldName: KStart,
    endFieldName: KEnd
  ) => {
    // Konvertiere die gespeicherten Werte zu RangeValue für DateRangePicker
    const convertToRangeValue = (): RangeValue<string> | null => {
      const startValue = form.data[startFieldName] as string
      const endValue = form.data[endFieldName] as string

      if (!startValue || !endValue) return null

      console.log(
        'Konvertiere Datum-Range von',
        DATE_FORMAT,
        'zu ISO:',
        startValue,
        'bis',
        endValue
      )

      // Konvertiere beide Werte mit date-fns zu ISO-Format
      const startISO = convertToISO(startValue)
      const endISO = convertToISO(endValue)

      console.log('ISO-Konvertierung:', startISO, endISO)

      if (startISO && endISO) {
        return { start: startISO, end: endISO }
      }

      return null
    }

    const value = convertToRangeValue()
    const error = form.errors[startFieldName] || form.errors[endFieldName]

    return {
      name: `${String(startFieldName)}_${String(endFieldName)}`,
      value,
      error,
      onChange: (rangeValue: RangeValue<string> | null) => {
        if (rangeValue) {
          // Konvertiere von yyyy-MM-dd zurück zum konfigurierten Format mit date-fns
          const startFormatted = convertFromISO(rangeValue.start)
          const endFormatted = convertFromISO(rangeValue.end)

          console.log(
            'Rückkonvertierung von ISO zu',
            DATE_FORMAT,
            ':',
            startFormatted,
            endFormatted
          )

          form.setData(startFieldName, startFormatted as FormDataValues<T, KStart>)
          form.setData(endFieldName, endFormatted as FormDataValues<T, KEnd>)
          form.validate(startFieldName)
          form.validate(endFieldName)
        } else {
          form.setData(startFieldName, null as FormDataValues<T, KStart>)
          form.setData(endFieldName, null as FormDataValues<T, KEnd>)
          form.validate(startFieldName)
          form.validate(endFieldName)
        }
      },
      onBlur: () => {
        form.validate(startFieldName)
        form.validate(endFieldName)
      }
    } as const
  }

  form.isDirty = isDirty

  return {
    ...form,
    isDirty,
    register,
    registerEvent,
    registerCheckbox,
    registerDateRange,
    updateAndValidate,
    updateAndValidateWithoutEvent
  } as const
}
