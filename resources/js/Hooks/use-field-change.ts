import { useCallback } from 'react'

export const useFieldChange = (
  onChange?: ((value: string | null) => void) | ((value: string) => void)
) => {
  return useCallback(
    (val: string) => {
      if (onChange) {
        onChange(val || '')
      }
    },
    [onChange]
  )
}
