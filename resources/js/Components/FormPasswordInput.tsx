/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Input } from '@/Components/ui/input'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { FormLabel } from '@dspangenberg/twcui'

import type React from 'react';
import { type InputHTMLAttributes, useMemo, useState } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  passwordRules: string
  help?: string
  required?: boolean
}

export const FormPasswordInput = (
  {
    ref,
    type = 'text',
    required = false,
    className = '',
    help = '',
    label,
    error,
    passwordRules,
    ...props
  }: FormInputProps & {
    ref?: React.RefObject<HTMLInputElement>;
  }
) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => { setIsVisible(prevState => !prevState); }

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'mindestens acht Zeichen' },
      { regex: /[0-9]/, text: 'mindestens eine Ziffer' },
      { regex: /[a-z]/, text: 'mindestens einen Kleinbuchstaben' },
      { regex: /[A-Z]/, text: 'mindestens einen Großbuchstaben' },
      { regex: /[!@#$%^&*,)(+=._-]/, text: 'mindestens ein Sonderzeichen' }
    ]

    return requirements.map(req => ({
      met: req.regex.test(pass),
      text: req.text
    }))
  }

  const strength = checkStrength(props.value as unknown as string)

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length
  }, [strength])

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border'
    if (score <= 1) return 'bg-red-500'
    if (score <= 2) return 'bg-orange-500'
    if (score === 3) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Kennwort eingeben'
    if (score <= 2) return 'Schwaches Kennwort'
    if (score === 3) return 'Mittelschweres Kennwort'
    return 'Starkes Kennwort'
  }

  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <div className="space-y-1">
        {label && (
          <FormLabel htmlFor={props.name} required={required}>
            {label}:
          </FormLabel>
        )}
        <div className="relative">
          <Input
            ref={ref}
            type={isVisible ? 'text' : 'password'}
            name={props.id}
            aria-invalid={strengthScore < 4}
            aria-describedby="password-strength"
            {...props}
          />
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Password strength indicator */}
      {/* biome-ignore lint/a11y/useFocusableInteractive: <explanation> */}
      <div
        className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        />
      </div>

      {/* Password strength description */}
      <p id="password-strength" className="mb-2 text-sm font-medium text-foreground">
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      {/* Password requirements list */}
      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <Check size={16} className="text-emerald-500" aria-hidden="true" />
            ) : (
              <X size={16} className="text-muted-foreground/80" aria-hidden="true" />
            )}
            <span className={`text-sm ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}>
              {req.text}
              <span className="sr-only">
                {req.met ? ' - Requirement met' : ' - Requirement not met'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
