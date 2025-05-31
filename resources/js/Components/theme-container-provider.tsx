/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

export type Container = '6xl' | '7xl' | 'full' | '8xl' | '9xl'
export type BackgroundColor = 'bg-background' | 'bg-page-content' | 'bg-sidebar-content' | 'bg-sidebar-accent'

type ThemeContainerProviderProps = {
  children: React.ReactNode
  width: Container
  backgroundColor?: BackgroundColor
}

type ContainerProviderState = {
  classNames: string
  backgroundClass: string
  width: Container
  backgroundColor?: BackgroundColor
  setWidth: (width: Container) => void
  setBackgroundColor: (bg: BackgroundColor) => void
}

const initialState: ContainerProviderState = {
  classNames: '',
  backgroundClass: '',
  width: '7xl',
  backgroundColor: 'bg-page-content',
  setWidth: () => null,
  setBackgroundColor: () => null
}

const ThemeContainerProviderContext = createContext<ContainerProviderState>(initialState)

export function ThemeContainerProvider({
  children,
  width: initialWidth,
  backgroundColor: initialBackgroundColor = 'bg-page-content',
  ...props
}: ThemeContainerProviderProps) {
  const [width, setWidth] = useState<Container>(initialWidth)
  const [classNames, setClassNames] = useState<string>('')
  const [backgroundClass, setBackgroundClass] = useState<string>('')
  const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>(initialBackgroundColor)

  const getClassNames = (width: Container): string => {
    return {
      full: 'max-w-full mx-4',
      '6xl': 'w-screen max-w-full 2xl:mx-auto 2xl:max-w-6xl',
      '7xl': 'w-screen max-w-full 2xl:mx-auto 2xl:max-w-7xl',
      '8xl': 'w-screen max-w-full 2xl:mx-auto 2xl:max-w-8xl',
      '9xl': 'w-screen max-w-full 2xl:mx-auto 2xl:max-w-9xl'
    }[width]
  }

  const getBackgroundClass = (backgroundColor: BackgroundColor): string => {
    return {
      'bg-background': 'bg-background',
      'bg-page-content': 'bg-page-content',
      'bg-sidebar-content': 'bg-sidebar-content',
      'bg-sidebar-accent': 'bg-sidebar-accent'
    }[backgroundColor]
  }

  useEffect(() => {
    setClassNames(getClassNames(width))
    setBackgroundClass(getBackgroundClass(backgroundColor))
  }, [width, backgroundColor])

  const value: ContainerProviderState = {
    width,
    backgroundColor,
    classNames,
    backgroundClass,
    setWidth: (newWidth: Container) => {
      setWidth(newWidth)
    },
    setBackgroundColor: (newBackgroundColor: BackgroundColor) => {
      setBackgroundColor(newBackgroundColor)
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
