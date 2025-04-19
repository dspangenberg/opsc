/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Head } from '@inertiajs/react'
import type React from 'react'
import { useEffect, useMemo } from 'react'
import { LayoutContainer } from '@/Components/LayoutContainer'
import type { BreadcrumbProp } from '@/Components/PageBreadcrumbs'
import { type Container, useThemeContainer } from '@/Components/theme-container-provider'
import { cn } from '@/Lib/utils'
import { useBreadcrumbProvider } from '@/Components/BreadcrumbProvider'
import { NavTabs } from '@/Components/NavTabs'
import { ClassicNavTabs } from '@/Components/ClassicNavTabs'

interface PageContainerProps {
  title: string
  header?: string | React.ReactNode
  children: React.ReactNode
  toolbar?: React.ReactNode
  footer?: React.ReactNode
  tabs?: React.ReactNode
  width?: Container
  breadcrumbs?: BreadcrumbProp[]
  className?: string
  headerClassname?: string
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  width = '7xl',
  header,
  toolbar,
  tabs,
  breadcrumbs = null,
  className = '',
  headerClassname = '',
  footer,
  children
}) => {
  const { setWidth } = useThemeContainer()
  const { setBreadcrumbs } = useBreadcrumbProvider()

  useEffect(() => {
    if (breadcrumbs) {
      setBreadcrumbs(breadcrumbs)
    }
    setWidth(width)
  }, [setBreadcrumbs, breadcrumbs, setWidth, width])

  const headerContent = useMemo(() => {
    if (header) {
      return typeof header === 'string' ? (
        <span className="text-2xl font-bold">{header}</span>
      ) : (
        header
      )
    }
    return <span className="text-2xl font-bold">{title}</span>
  }, [header, title])

  return (
    <div className="flex flex-col overflow-hidden absolute inset-0 bg-page-content">
      <Head title={title} />

      <div className="flex-none  border-y z-10 border-border/50 bg-background rounded-t-xl">
        <LayoutContainer
          className={cn(
            'w-full flex items-center flex-1 z-10',
            tabs ? 'py-0' : '',
            headerClassname
          )}
        >
          <div className={cn('flex flex-1 flex-col justify-center ', tabs ? 'pb-0' : 'py-3')}>
            <div className="flex-1 flex items-center py-3 h-fit">{headerContent}</div>
            <div>{tabs && <ClassicNavTabs>{tabs}</ClassicNavTabs>}</div>
          </div>
          <div className="flex flex-none items-center justify-stretch self-stretch">
            {toolbar && <div className="flex-none">{toolbar}</div>}
          </div>
        </LayoutContainer>
      </div>
      <div className="relative flex-1 my-6 bg-page-content">
        <LayoutContainer className={cn('absolute inset-0 min-h-0 overflow-y-auto my-4', className)}>
          {children}
        </LayoutContainer>
      </div>
      {footer && <LayoutContainer className="w-full">{footer}</LayoutContainer>}
    </div>
  )
}
