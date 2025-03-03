import { cn, focusInput, hasErrorInput } from '@/Lib/utils'
import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
  passwordRules?: string | undefined
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, hasError = false, passwordRules = '', autoComplete = 'off', ...props },
    ref
  ) => {
    const inputProps: React.InputHTMLAttributes<HTMLInputElement> & { [key: string]: any } = {
      ...props,
      type,
      autoComplete: autoComplete,
      className: cn(
        'flex h-9 w-full rounded border border-input bg-background px-3 py-2 text-base font-medium text-foreground transition-shadow placeholder:font-normal placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50',
        type === 'search' &&
          '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
        type === 'file' &&
          'p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground',
        focusInput,
        hasError && hasErrorInput,
        className
      )
    }

    if (passwordRules) {
      inputProps.passwordrules = passwordRules
    }

    return <input ref={ref} {...inputProps} />
  }
)
Input.displayName = 'Input'

export { Input }
