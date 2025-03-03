/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormLabel } from '@/Components/FormLabel'
import { Input } from '@/Components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { cn, focusInput, hasErrorInput } from '@/Lib/utils'
import { Check, Copy } from "lucide-react";
import React, { forwardRef, useState, type InputHTMLAttributes, useRef } from 'react'
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  help?: string
  required?: boolean
}

export const FormInputWithCopyToClipboard = forwardRef<HTMLInputElement, FormInputProps>(
  ({ type = 'text', required = false, className = '', help = '', label, error, ...props }, ref) => {
    const [copied, setCopied] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCopy = () => {
      if (inputRef.current) {
        navigator.clipboard.writeText(inputRef.current.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    };

    return (
      <div className="space-y-1" ref={ref}>
        {label && (
          <FormLabel htmlFor={props.name} required={required}>
            {label}:
          </FormLabel>
        )}
        <div className="relative">

          <Input
            ref={inputRef}
            name={props.id}
            {...props}
            type={type}
            readOnly
            hasError={!!error}
            className={cn(error ? [hasErrorInput] : [focusInput], 'pe-9')}
          />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopy}
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
                  aria-label={copied ? "Copied" : "Copy to clipboard"}
                  type="button"
                  disabled={copied}
                >
                  <div
                    className={cn(
                      "transition-all",
                      copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
                    )}
                  >
                    <Check
                      className="stroke-emerald-500"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    className={cn(
                      "absolute transition-all",
                      copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                    )}
                  >
                    <Copy size={16} strokeWidth={2} aria-hidden="true" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 text-xs">In Zwischenablage kopieren</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {help && <div className="text-sm pt-0.5 font-normal text-gray-600">{help}</div>}
        </div>
      </div>
        )
              }
        )

FormInputWithCopyToClipboard.displayName = 'FormInputWithCopyToClipboard'
