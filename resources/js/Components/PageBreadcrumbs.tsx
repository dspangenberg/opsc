import React from 'react'

import { useBreadcrumb } from '@/Components/BreadcrumbProvider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/Components/ui/breadcrumb'

export type BreadcrumbProp = {
  title: string
  url?: string
}

type PageBreadcrumbsProps = {
  className?: string
}

export const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({ className }) => {
  const { breadcrumbs } = useBreadcrumb()

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbs.map((item: BreadcrumbProp, index: number) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.url ? (
                <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
