import type React from 'react'

import { useBreadcrumb } from '@/Components/BreadcrumbProvider'
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs
} from '@/Components/twc-ui/breadcrumbs'

export type BreadcrumbProp = {
  title: string
  url?: string
}

type PageBreadcrumbsProps = {
  className?: string
}

export const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({ className }) => {
  const { breadcrumbs } = useBreadcrumb()

  return (
    <Breadcrumbs className={className}>
      <BreadcrumbItem>
        <BreadcrumbLink href={route('app.dashboard')}>Dashboard</BreadcrumbLink>
        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
      </BreadcrumbItem>
      {breadcrumbs.map((item: BreadcrumbProp, index: number) => (
        <BreadcrumbItem key={index}>
          {item.url ? (
            <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{item.title}</BreadcrumbPage>
          )}
          {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  )
}
