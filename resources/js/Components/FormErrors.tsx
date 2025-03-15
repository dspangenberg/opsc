/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Alert02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type * as React from 'react'
import { useMemo } from 'react'

interface Props {
  errors: Partial<Record<string, string>>
  title?: string
}

export const FormErrors: React.FC<Props> = ({
  errors,
  title = 'Das hat leider nicht funktioniert.'
}) => {
  const errorMessages = useMemo(() => {
    if (!errors) return []
    return Object.values(errors)
  }, [errors])

  if (errorMessages.length === 0) {
    return null
  }

  return (
    <>
      <div className="rounded-lg border border-red-500/50 px-4 py-3 text-red-600" role="alert">
        <div className="flex gap-3 flex-col">
          <div className="flex items-center space-x-2">
            <div className="flex-none">
              <HugeiconsIcon
                icon={Alert02Icon}
                size={24}
                color="currentColor"
                className="mt-0.5 shrink-0 opacity-60 motion-rotate-loop-[6deg] motion-loop-once motion-ease-spring-bounciest"
                strokeWidth={3}
              />
            </div>
            <div className="text-base font-medium flex-1">{title}</div>
          </div>
          <div className="grow space-y-1">
            <ul className="list-inside list-disc text-sm opacity-80 pl-9 motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md">
              {errorMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
