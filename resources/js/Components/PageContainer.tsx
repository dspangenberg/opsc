/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Head } from '@inertiajs/react'
import type React from 'react'
import { useEffect, useMemo } from 'react'
import { LayoutContainer } from '@/Components/LayoutContainer'
import type { BreadcrumbProp } from '@/Components/PageBreadcrumbs'
import { type BackgroundColor, type Container, useThemeContainer } from '@/Components/theme-container-provider'
import { cn } from '@/Lib/utils'
import { useBreadcrumbProvider } from '@/Components/BreadcrumbProvider'
import { NavTabs } from '@/Components/NavTabs'
import { ClassicNavTabs } from '@/Components/ClassicNavTabs'

interface PageContainerProps {
  title?: string
  header?: string | React.ReactNode
  children: React.ReactNode
  toolbar?: React.ReactNode
  footer?: React.ReactNode
  tabs?: React.ReactNode
  width?: Container
  breadcrumbs?: BreadcrumbProp[]
  className?: string
  hideHeader?: boolean
  containerBackground?: BackgroundColor
  headerClassname?: string
  bgClassName?: string
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  width = '7xl',
  header,
  toolbar,
  tabs,
  breadcrumbs = null,
  hideHeader = false,
  containerBackground = 'bg-page-content',
  className = '',
  bgClassName = '',
  headerClassname = '',
  footer,
  children
}) => {
  const { setWidth, setBackgroundColor, backgroundClass } = useThemeContainer()
  const { setBreadcrumbs } = useBreadcrumbProvider()

  useEffect(() => {
    if (breadcrumbs) {
      setBreadcrumbs(breadcrumbs)
    }
    setBackgroundColor(containerBackground)
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


      {!hideHeader &&

        <div className="flex-none  border-y z-10 border-border/50 bg-background rounded-t-xl">
        <LayoutContainer
          className={cn(
            'px-4',
            tabs ? 'py-0' : '',
            headerClassname
          )}
        >
          <div className="flex-1 flex flex-col">
          <div className={cn('flex flex-1 flex justify-between ', tabs ? 'pt-3' : 'py-3')}>
            <div className="flex-1 flex items-stretch py-3 h-fit">{headerContent}</div>
            {toolbar && <div className="flex-none items-center items-end justify-end py-3 h-fit">{toolbar}</div>}
          </div>

          <div className="flex flex-1 items-center">

            <div>{tabs && <ClassicNavTabs>{tabs}</ClassicNavTabs>}</div>
          </div>
          </div>
        </LayoutContainer>
        </div>
      }

      <div className={cn('relative flex-1 py-6 bg-page-content', backgroundClass)}>
        <LayoutContainer className={cn('absolute inset-0 min-h-0 overflow-y-auto px-4 flex-col xl:!flex-row gap-2 my-6', className)}>
          {children}
        </LayoutContainer>
      </div>
      {footer && <LayoutContainer className="w-full">{footer}</LayoutContainer>}
    </div>
  )
}
