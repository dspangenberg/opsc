/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { FC, ReactNode } from 'react'
import { cn } from '@/Lib/utils'
interface Props {
  value?: string | number
  label: string
  children?: ReactNode
  classNameValue?: string
}

export const StatsField: FC<Props> = ({ value = '', label, children, classNameValue = '' }) => {
  return (
    <div className="block space-x-1 font-normal text-center space-y-0 px-3">
      <div className={cn('text-base font-medium', classNameValue)}>{children || value}</div>
      <div className="text-xs text-foreground/60">{label}</div>
    </div>
  )
}
