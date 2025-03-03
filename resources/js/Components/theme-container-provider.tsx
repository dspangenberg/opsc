/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

type Container = "6xl" | "7xl" | "full"

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
  setWidth: () => null,
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
      'full': 'max-w-full mx-4',
      '6xl': 'max-w-sm md:max-w-6xl lg:mx-w-6xl mx-auto',
      '7xl': 'max-w-sm md:max-w-7xl lg:mx-w-7xl mx-auto'
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
    },
  }

  return (
    <ThemeContainerProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeContainerProviderContext.Provider>
  )
}

export const useThemeContainer = () => {
  const context = useContext(ThemeContainerProviderContext)
  if (context === undefined) throw new Error("useThemeContainer must be used within a ThemeContainerProvider")
  return context
}
