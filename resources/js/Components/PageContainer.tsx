/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Head } from '@inertiajs/react'
import type React from 'react'
import { useEffect, useMemo } from 'react'
import { useBreadcrumb } from '@/Components/BreadcrumbProvider'
import { LayoutContainer } from '@/Components/LayoutContainer'
import type { BreadcrumbProp } from '@/Components/PageBreadcrumbs'
import {
  type BackgroundColor,
  type Container,
  useThemeContainer
} from '@/Components/theme-container-provider'
import { cn } from '@/Lib/utils'

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
  headerClassname = '',
  footer,
  children
}) => {
  const { setWidth, setBackgroundColor, backgroundClass } = useThemeContainer()
  const { setBreadcrumbs } = useBreadcrumb()

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
        <span className="font-bold text-2xl">{header}</span>
      ) : (
        header
      )
    }
    return <div className="font-bold text-xl">{title}</div>
  }, [header, title])

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-page-content">
      <Head title={title} />

      {!hideHeader && (
        <div className="z-10 flex-none rounded-t-xl border-border/50 border-y bg-background">
          <LayoutContainer className={cn('px-4', tabs ? 'py-0' : '', headerClassname)}>
            <div className="flex flex-1 flex-col">
              <div className={cn('flex flex-1 justify-between')}>
                <div
                  className={cn('flex flex-1 items-center justify-stretch', tabs ? 'py-3' : 'py-6')}
                >
                  {headerContent}
                </div>
                {toolbar && <div className="flex-none items-end justify-end py-6">{toolbar}</div>}
              </div>
              {tabs && <div className="flex flex-1 items-center">{tabs}</div>}
            </div>
          </LayoutContainer>
        </div>
      )}

      <div className={cn('relative flex-1 bg-page-content py-6', backgroundClass)}>
        <LayoutContainer
          className={cn(
            'xl:!flex-row absolute inset-0 my-6 min-h-0 flex-col gap-2 overflow-y-auto px-4',
            className
          )}
        >
          {children}
        </LayoutContainer>
      </div>
      {footer && <LayoutContainer className="w-full">{footer}</LayoutContainer>}
    </div>
  )
}
