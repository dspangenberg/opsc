/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

export type Container = '6xl' | '7xl' | 'full' | '8xl' | '9xl'

type ThemeContainerProviderProps = {
  children: React.ReactNode
  width: Container
}

type ContainerProviderState = {
  classNames: string
  width: Container
  setWidth: (width: Container) => void
}

const initialState: ContainerProviderState = {
  classNames: '',
  width: '7xl',
  setWidth: () => null
}

const ThemeContainerProviderContext = createContext<ContainerProviderState>(initialState)

export function ThemeContainerProvider({
  children,
  width: initialWidth,
  ...props
}: ThemeContainerProviderProps) {
  const [width, setWidth] = useState<Container>(initialWidth)
  const [classNames, setClassNames] = useState<string>('')

  const getClassNames = (width: Container): string => {
    return {
      full: 'max-w-full mx-4',
      '6xl': 'max-w-sm md:max-w-6xl lg:max-w-6xl mx-auto md:min-w-6xl lg:min-w-6xl',
      '7xl': 'max-w-sm md:max-w-7xl lg:max-w-7xl mx-auto md:min-w-7xl lg:min-w-7xl',
      '8xl': 'max-w-sm md:max-w-[88rem] lg:max-w-[88rem] mx-auto md:min-w-[88rem] lg:min-w-[88rem]',
      '9xl': 'max-w-sm md:max-w-[96rem] lg:max-w-[96rem] mx-auto md:min-w-[96rem] lg:min-w-[96rem]'
    }[width]
  }

  useEffect(() => {
    setClassNames(getClassNames(width))
  }, [width])

  const value: ContainerProviderState = {
    width,
    classNames,
    setWidth: (newWidth: Container) => {
      setWidth(newWidth)
    }
  }

  return (
    <ThemeContainerProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeContainerProviderContext.Provider>
  )
}

export const useThemeContainer = () => {
  const context = useContext(ThemeContainerProviderContext)
  if (context === undefined)
    throw new Error('useThemeContainer must be used within a ThemeContainerProvider')
  return context
}
