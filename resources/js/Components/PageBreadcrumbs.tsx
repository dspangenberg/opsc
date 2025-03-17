/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useBreadcrumbProvider } from '@/Components/BreadcrumbProvider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/Components/ui/breadcrumb'
import { Link } from '@inertiajs/react'
import * as React from 'react'
import { useEffect } from 'react'

type BreadcrumbTypes = 'link' | 'text' | 'menu'
export interface BreadcrumbProp {
  title: string
  route?: string
  type?: BreadcrumbTypes
}

interface Props {
  items?: BreadcrumbProp[]
  className?: string
}

export const PageBreadcrumbs: React.FC<Props> = ({ className = '', items }: Props) => {
  const { breadcrumbs } = useBreadcrumbProvider()

  useEffect(() => {
    items = breadcrumbs
  }, [breadcrumbs])

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            className="transition-colors text-foreground hover:text-foreground font-medium hover:underline"
            href={route('app.dashboard')}
          >
            Dashboard
          </Link>
        </BreadcrumbItem>

        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}

        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.route}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <Link
                  className="transition-colors hover:text-foreground"
                  href={item.route as string}
                >
                  {item.title}
                </Link>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
