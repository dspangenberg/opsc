/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Head } from '@inertiajs/react'
import type React from 'react'
import { useEffect } from 'react'
import { LayoutContainer } from '@/Components/LayoutContainer'
import {
  type Container,
  useThemeContainer
} from '@/Components/theme-container-provider'

interface PageContainerProps {
  title: string
  children: React.ReactNode
  header: React.ReactNode
  width?: Container
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  header,
  width = '7xl',
  children
}) => {
  const { setWidth } = useThemeContainer()

  useEffect(() => {
    setWidth(width)
  }, [setWidth, width])

  return (
    <div className="flex flex-col overflow-hidden absolute top-0 bottom-0 left-0 right-0">
      <Head title={title} />

      <div className="flex-none bg-sidebar border-t border-b border-sidebar">
        <LayoutContainer className="w-full flex flex-col py-1.5 px-5">
          {header}
        </LayoutContainer>
      </div>
      <div className="relative flex-1">
        <LayoutContainer className="absolute top-0 bottom-0 left-0 min-h-0 right-0 overflow-y-auto my-4">
          {children}
        </LayoutContainer>
      </div>
    </div>
  )
}
