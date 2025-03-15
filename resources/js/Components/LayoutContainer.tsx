/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useThemeContainer } from '@/Components/theme-container-provider'
import { cn } from '@/Lib/utils'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
interface Props<T extends ElementType = 'div'> {
  as?: T
  containerClassName?: string[] | string
  children: ReactNode
  className?: string
}

export const LayoutContainer = <T extends ElementType = 'div'>({
  as,
  children,
  containerClassName = '',
  className,
  ...rest
}: Props<T> & Omit<ComponentPropsWithoutRef<T>, keyof Props<T>>) => {
  const Component = as || 'div'

  const { classNames } = useThemeContainer()

  return (
    <Component className={cn(classNames, className)} {...rest}>
      {children}
    </Component>
  )
}
